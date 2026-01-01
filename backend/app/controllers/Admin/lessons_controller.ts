import type { HttpContext } from '@adonisjs/core/http'
import Lesson from '#models/lesson'
import Chapter from '#models/chapter'
import Mux from '@mux/mux-node'
import env from '#start/env'
import { broadcastLessonUpdate } from '#controllers/sse_controller'
import muxService from '#services/mux_service'

export default class LessonsController {
  /**
   * Create a new lesson for a chapter
   */
  async store({ params, request, response }: HttpContext) {
    const chapter = await Chapter.findOrFail(params.chapterId)

    // Log full request body
    console.log('[Lesson Create] Full request body:', request.body())

    const { title, type, content, pdfUrl, viewLimit, sortOrder, isFree, description, attachments } = request.only([
      'title',
      'type',
      'content',
      'pdfUrl',
      'viewLimit',
      'sortOrder',
      'isFree',
      'description',
      'attachments',
    ])

    // Get max sort order if not provided
    let order = sortOrder
    if (order === undefined) {
      const maxOrder = await Lesson.query().where('chapter_id', chapter.id).max('sort_order as max')
      order = (maxOrder[0]?.$extras?.max || 0) + 1
    }

    // Process attachments
    const processedAttachments = Array.isArray(attachments) && attachments.length > 0 ? attachments : null

    console.log('[Lesson Create] viewLimit received:', viewLimit, 'typeof:', typeof viewLimit)

    const lesson = await Lesson.create({
      chapterId: chapter.id,
      title,
      type,
      content: type === 'text' ? content : null,
      pdfUrl: type === 'pdf' ? pdfUrl : null,
      viewLimit: viewLimit !== undefined && viewLimit !== null ? viewLimit : 2,
      sortOrder: order,
      muxStatus: type === 'video' ? 'pending' : 'ready',
      isFree: isFree || false,
      description: description || null,
      attachments: processedAttachments,
    })

    console.log('[Lesson Create] Saved lesson viewLimit:', lesson.viewLimit)

    return response.created({ lesson })
  }

  /**
   * Update a lesson
   */
  async update({ params, request, response }: HttpContext) {
    const lesson = await Lesson.findOrFail(params.id)

    // Get the full request body for debugging
    const body = request.body()
    console.log('[Lesson Update] Request body:', JSON.stringify(body, null, 2))

    const { title, type, content, pdfUrl, viewLimit, sortOrder, description, attachments, isFree } = request.only([
      'title',
      'type',
      'content',
      'pdfUrl',
      'viewLimit',
      'sortOrder',
      'description',
      'attachments',
      'isFree',
    ])

    console.log('[Lesson Update] Attachments received:', attachments)

    // Handle attachments - convert empty array to null for MySQL
    let processedAttachments = lesson.attachments
    if (attachments !== undefined) {
      if (Array.isArray(attachments) && attachments.length === 0) {
        processedAttachments = null
      } else if (attachments) {
        processedAttachments = attachments
      } else {
        processedAttachments = null
      }
    }

    console.log('[Lesson Update] Processed attachments:', processedAttachments)

    lesson.merge({
      title: title ?? lesson.title,
      type: type ?? lesson.type,
      content: content !== undefined ? content : lesson.content,
      pdfUrl: pdfUrl !== undefined ? pdfUrl : lesson.pdfUrl,
      viewLimit: viewLimit ?? lesson.viewLimit,
      sortOrder: sortOrder ?? lesson.sortOrder,
      description: description !== undefined ? description : lesson.description,
      attachments: processedAttachments,
      isFree: isFree !== undefined ? isFree : lesson.isFree,
    })

    await lesson.save()

    console.log('[Lesson Update] Saved lesson attachments:', lesson.attachments)

    // Serialize to ensure attachments are properly formatted
    const lessonData = lesson.serialize()
    lessonData.attachments = lessonData.attachments || []

    return response.ok({ lesson: lessonData })
  }

  /**
   * Delete a lesson
   */
  async destroy({ params, response }: HttpContext) {
    const lesson = await Lesson.findOrFail(params.id)

    // Delete the video from Mux if it exists
    if (lesson.muxAssetId) {
      try {
        const deleted = await muxService.deleteAsset(lesson.muxAssetId)
        if (!deleted) {
          console.log(`[Mux] ❌ Failed to delete asset ${lesson.muxAssetId}`)
          return response.internalServerError({
            message: 'Failed to delete video from Mux. Lesson was not deleted.'
          })
        }
        console.log(`[Mux] ✅ Deleted asset ${lesson.muxAssetId} for lesson ${lesson.id}`)
      } catch (error) {
        console.log(`[Mux] ❌ Failed to delete asset ${lesson.muxAssetId}:`, error)
        return response.internalServerError({
          message: 'Failed to delete video from Mux. Lesson was not deleted.'
        })
      }
    }

    await lesson.delete()

    return response.ok({ message: 'Lesson deleted successfully' })
  }

  /**
   * Get signed URLs for video playback (admin)
   */
  async getSignedUrls({ params, response }: HttpContext) {
    const lesson = await Lesson.findOrFail(params.id)

    if (!lesson.muxPlaybackId) {
      return response.badRequest({ message: 'No video available for this lesson' })
    }

    const signingKeyId = env.get('MUX_SIGNING_KEY_ID')
    const signingKeySecret = env.get('MUX_SIGNING_PRIVATE_KEY')

    if (!signingKeyId || !signingKeySecret) {
      // Return unsigned URLs if signing not configured
      return response.ok({
        thumbnailUrl: `https://image.mux.com/${lesson.muxPlaybackId}/thumbnail.png?width=640`,
        playbackUrl: `https://stream.mux.com/${lesson.muxPlaybackId}.m3u8`,
      })
    }

    // Generate signed URLs using JWT
    const jwt = await import('jsonwebtoken')
    const now = Math.floor(Date.now() / 1000)

    // Token for thumbnail (1 hour)
    const thumbnailPayload = {
      sub: lesson.muxPlaybackId,
      aud: 't',
      exp: now + 3600,
      kid: signingKeyId,
    }

    // Token for playback (1 hour)
    const playbackPayload = {
      sub: lesson.muxPlaybackId,
      aud: 'v',
      exp: now + 3600,
      kid: signingKeyId,
    }

    const keySecret = Buffer.from(signingKeySecret, 'base64')

    const thumbnailToken = jwt.default.sign(thumbnailPayload, keySecret, {
      algorithm: 'RS256',
      keyid: signingKeyId,
    })

    const playbackToken = jwt.default.sign(playbackPayload, keySecret, {
      algorithm: 'RS256',
      keyid: signingKeyId,
    })

    return response.ok({
      playbackId: lesson.muxPlaybackId,
      playbackToken,
      thumbnailUrl: `https://image.mux.com/${lesson.muxPlaybackId}/thumbnail.png?width=640&token=${thumbnailToken}`,
      playbackUrl: `https://stream.mux.com/${lesson.muxPlaybackId}.m3u8?token=${playbackToken}`,
    })
  }

  /**
   * Get Mux direct upload URL for video lesson
   */
  async getUploadUrl({ params, response }: HttpContext) {
    const lesson = await Lesson.findOrFail(params.id)

    if (lesson.type !== 'video') {
      return response.badRequest({ message: 'This lesson is not a video lesson' })
    }

    const tokenId = env.get('MUX_TOKEN_ID')
    const tokenSecret = env.get('MUX_TOKEN_SECRET')

    if (!tokenId || !tokenSecret) {
      return response.internalServerError({ message: 'Mux credentials not configured' })
    }

    // If lesson already has a video, delete the existing Mux asset first
    if (lesson.muxAssetId) {
      try {
        await muxService.deleteAsset(lesson.muxAssetId)
        console.log(`[Mux] ✅ Deleted existing asset ${lesson.muxAssetId} for lesson ${lesson.id} (replacing video)`)
      } catch (error) {
        console.log(`[Mux] ⚠️ Failed to delete existing asset ${lesson.muxAssetId}:`, error)
        // Continue anyway - the new video will still be uploaded
      }

      // Clear old video data from database
      lesson.muxAssetId = null
      lesson.muxPlaybackId = null
      lesson.duration = null
    }

    const mux = new Mux({ tokenId, tokenSecret })

    const upload = await mux.video.uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: ['signed'],
        encoding_tier: 'baseline',
      },
    })

    // Store the upload ID (we'll get asset ID from webhook)
    lesson.muxUploadId = upload.id
    lesson.muxStatus = 'pending'
    await lesson.save()

    return response.ok({
      uploadUrl: upload.url,
      uploadId: upload.id,
    })
  }

  /**
   * Mux webhook handler
   */
  async muxWebhook({ request, response }: HttpContext) {
    const body = request.body()
    const { type, data } = body

    // DEBUG: Log every webhook call
    console.log('='.repeat(60))
    console.log('[Mux Webhook] Received webhook call!')
    console.log('[Mux Webhook] Event type:', type)
    console.log('[Mux Webhook] Raw body:', JSON.stringify(body, null, 2))
    console.log('='.repeat(60))

    // Handle upload completion (upload ID -> asset ID)
    // NOTE: In this event, data.id = upload_id, data.asset_id = asset_id
    if (type === 'video.upload.asset_created') {
      const uploadId = data.id  // This is the upload ID
      const assetId = data.asset_id  // This is the asset ID

      console.log('[Mux] video.upload.asset_created event:')
      console.log('[Mux]   upload_id (data.id):', uploadId)
      console.log('[Mux]   asset_id (data.asset_id):', assetId)

      const lesson = await Lesson.findBy('mux_upload_id', uploadId)

      if (lesson) {
        lesson.muxAssetId = assetId // Store the actual asset ID
        await lesson.save()
        console.log(`[Mux] ✅ Asset created for lesson ${lesson.id}: asset_id=${assetId}`)
      } else {
        console.log(`[Mux] ❌ No lesson found with mux_upload_id: ${uploadId}`)
      }
    }

    // Handle processing completion (asset ready for playback)
    if (type === 'video.asset.ready') {
      console.log('[Mux] Looking for lesson with mux_asset_id:', data.id)
      const lesson = await Lesson.query()
        .where('mux_asset_id', data.id)
        .preload('chapter')
        .first()

      if (lesson) {
        lesson.muxPlaybackId = data.playback_ids?.[0]?.id || null
        lesson.muxStatus = 'ready'
        lesson.duration = Math.round(data.duration || 0)
        await lesson.save()
        console.log(`[Mux] ✅ Asset ready for lesson ${lesson.id}: playback_id=${lesson.muxPlaybackId}`)

        // Broadcast SSE update to connected clients
        const courseId = lesson.chapter?.courseId
        if (courseId && lesson.muxPlaybackId) {
          const thumbnailUrl = muxService.generateThumbnailUrl(lesson.muxPlaybackId, { width: 80 })
          broadcastLessonUpdate(courseId, lesson.id, {
            muxStatus: lesson.muxStatus,
            playbackId: lesson.muxPlaybackId,
            thumbnailUrl,
            duration: lesson.duration,
          })
        }
      } else {
        console.log(`[Mux] ❌ No lesson found with asset_id: ${data.id}`)
      }
    }

    // Handle processing errors
    if (type === 'video.asset.errored') {
      console.log('[Mux] Looking for lesson with mux_asset_id:', data.id)
      const lesson = await Lesson.findBy('mux_asset_id', data.id)

      if (lesson) {
        lesson.muxStatus = 'error'
        await lesson.save()
        console.log(`[Mux] ❌ Asset errored for lesson ${lesson.id}`)
      } else {
        console.log(`[Mux] ❌ No lesson found with asset_id: ${data.id}`)
      }
    }

    return response.ok({ received: true })
  }

  /**
   * Reorder lessons
   */
  async reorder({ params, request, response }: HttpContext) {
    const { lessons } = request.only(['lessons']) // Array of { id, sortOrder }

    for (const item of lessons) {
      await Lesson.query()
        .where('id', item.id)
        .where('chapter_id', params.chapterId)
        .update({ sort_order: item.sortOrder })
    }

    return response.ok({ message: 'Lessons reordered successfully' })
  }
}

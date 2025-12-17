import type { HttpContext } from '@adonisjs/core/http'
import Lesson from '#models/lesson'
import Chapter from '#models/chapter'
import Mux from '@mux/mux-node'
import env from '#start/env'
import { broadcastLessonUpdate } from '#controllers/sse_controller'

export default class LessonsController {
  /**
   * Create a new lesson for a chapter
   */
  async store({ params, request, response }: HttpContext) {
    const chapter = await Chapter.findOrFail(params.chapterId)

    const { title, type, content, pdfUrl, viewLimit, sortOrder } = request.only([
      'title',
      'type',
      'content',
      'pdfUrl',
      'viewLimit',
      'sortOrder',
    ])

    // Get max sort order if not provided
    let order = sortOrder
    if (order === undefined) {
      const maxOrder = await Lesson.query().where('chapter_id', chapter.id).max('sort_order as max')
      order = (maxOrder[0]?.$extras?.max || 0) + 1
    }

    const lesson = await Lesson.create({
      chapterId: chapter.id,
      title,
      type,
      content: type === 'text' ? content : null,
      pdfUrl: type === 'pdf' ? pdfUrl : null,
      viewLimit: viewLimit || 2,
      sortOrder: order,
      muxStatus: type === 'video' ? 'pending' : 'ready',
    })

    return response.created({ lesson })
  }

  /**
   * Update a lesson
   */
  async update({ params, request, response }: HttpContext) {
    const lesson = await Lesson.findOrFail(params.id)

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

    lesson.merge({
      title: title ?? lesson.title,
      type: type ?? lesson.type,
      content: content !== undefined ? content : lesson.content,
      pdfUrl: pdfUrl !== undefined ? pdfUrl : lesson.pdfUrl,
      viewLimit: viewLimit ?? lesson.viewLimit,
      sortOrder: sortOrder ?? lesson.sortOrder,
      description: description !== undefined ? description : lesson.description,
      attachments: attachments !== undefined ? attachments : lesson.attachments,
      isFree: isFree !== undefined ? isFree : lesson.isFree,
    })

    await lesson.save()

    return response.ok({ lesson })
  }

  /**
   * Delete a lesson
   */
  async destroy({ params, response }: HttpContext) {
    const lesson = await Lesson.findOrFail(params.id)
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
        if (courseId) {
          broadcastLessonUpdate(courseId, lesson.id, {
            muxStatus: lesson.muxStatus,
            playbackId: lesson.muxPlaybackId,
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
        console.error(`[Mux] ❌ Asset errored for lesson ${lesson.id}`)
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

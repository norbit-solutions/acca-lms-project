import type { HttpContext } from '@adonisjs/core/http'
import Lesson from '#models/lesson'
import Chapter from '#models/chapter'
import Mux from '@mux/mux-node'
import env from '#start/env'

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

    const { title, type, content, pdfUrl, viewLimit, sortOrder } = request.only([
      'title',
      'type',
      'content',
      'pdfUrl',
      'viewLimit',
      'sortOrder',
    ])

    lesson.merge({
      title,
      type,
      content: type === 'text' ? content : null,
      pdfUrl: type === 'pdf' ? pdfUrl : null,
      viewLimit,
      sortOrder,
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

    // Store the upload ID temporarily (we'll get asset ID from webhook)
    lesson.muxAssetId = upload.id // Store upload ID temporarily
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
    const { type, data } = request.body()

    if (type === 'video.asset.ready') {
      // Find lesson by upload ID stored in muxAssetId
      const lesson = await Lesson.findBy('mux_asset_id', data.upload_id)

      if (lesson) {
        lesson.muxAssetId = data.id
        lesson.muxPlaybackId = data.playback_ids?.[0]?.id || null
        lesson.muxStatus = 'ready'
        lesson.duration = Math.round(data.duration || 0)
        await lesson.save()
      }
    }

    if (type === 'video.asset.errored') {
      const lesson = await Lesson.findBy('mux_asset_id', data.upload_id)

      if (lesson) {
        lesson.muxStatus = 'error'
        await lesson.save()
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

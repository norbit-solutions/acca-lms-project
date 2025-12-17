import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import VideoView from '#models/video_view'

// Response interfaces
interface VideoViewItem {
  id: number
  lessonId: number
  lessonTitle: string
  courseTitle: string
  viewCount: number
  lastViewedAt: string
}

interface VideoViewsResponse {
  views: VideoViewItem[]
  total: number
}

export default class UsersController {
  /**
   * List all students
   */
  async index({ request, response }: HttpContext) {
    const { search, role } = request.qs()

    const query = User.query().withCount('enrollments').orderBy('created_at', 'desc')

    if (role) {
      query.where('role', role)
    } else {
      query.where('role', 'student') // Default to students only
    }

    if (search) {
      query.where((q) => {
        q.whereILike('full_name', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('phone', `%${search}%`)
      })
    }

    const users = await query

    return response.ok({ users })
  }

  /**
   * Get single user with enrollments and video views
   */
  async show({ params, response }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .preload('enrollments', (query) => {
        query.preload('course')
      })
      .preload('videoViews', (query) => {
        query.preload('lesson', (lessonQuery) => {
          lessonQuery.preload('chapter', (chapterQuery) => {
            chapterQuery.preload('course')
          })
        })
      })
      .firstOrFail()

    // Serialize user data with properly formatted video views
    const userData = user.serialize()

    // Transform video views to include lessonTitle and courseTitle
    userData.videoViews = user.videoViews.map((v) => ({
      id: v.id,
      lessonId: v.lessonId,
      lessonTitle: v.lesson?.title ?? 'Unknown Lesson',
      courseTitle: v.lesson?.chapter?.course?.title ?? 'Unknown Course',
      viewCount: v.viewCount,
      customViewLimit: v.customViewLimit,
      lastViewedAt: v.lastViewedAt?.toISO() ?? '',
    }))

    return response.ok({ user: userData })
  }

  /**
   * Search users (for enrollment form)
   */
  async search({ request, response }: HttpContext) {
    const { q } = request.qs()

    if (!q || q.length < 2) {
      return response.ok({ users: [] })
    }

    const users = await User.query()
      .where('role', 'student')
      .where((query) => {
        query
          .whereILike('full_name', `%${q}%`)
          .orWhereILike('email', `%${q}%`)
          .orWhereILike('phone', `%${q}%`)
      })
      .limit(10)
      .select(['id', 'full_name', 'email', 'phone'])

    return response.ok({ users })
  }

  /**
   * Get user's video view history
   */
  async views({ params, response }: HttpContext): Promise<void> {
    const userId = Number(params.id)

    // Verify user exists
    await User.findOrFail(userId)

    const views = await VideoView.query()
      .where('userId', userId)
      .preload('lesson', (lessonQuery) => {
        lessonQuery.preload('chapter', (chapterQuery) => {
          chapterQuery.preload('course')
        })
      })
      .orderBy('lastViewedAt', 'desc')

    const result: VideoViewItem[] = views.map((v) => ({
      id: v.id,
      lessonId: v.lessonId,
      lessonTitle: v.lesson?.title ?? 'Unknown',
      courseTitle: v.lesson?.chapter?.course?.title ?? 'Unknown',
      viewCount: v.viewCount,
      lastViewedAt: v.lastViewedAt?.toISO() ?? '',
    }))

    const viewsResponse: VideoViewsResponse = {
      views: result,
      total: result.length,
    }

    response.ok(viewsResponse)
  }

  /**
   * Set custom view limit for a user's lesson
   */
  async setCustomViewLimit({ params, request, response }: HttpContext) {
    const userId = Number(params.userId)
    const lessonId = Number(params.lessonId)
    const { customLimit } = request.only(['customLimit'])

    if (customLimit === undefined || customLimit < 0) {
      return response.badRequest({ message: 'Invalid custom limit' })
    }

    // Verify user exists
    await User.findOrFail(userId)

    // Get or create video view record
    let videoView = await VideoView.query()
      .where('user_id', userId)
      .where('lesson_id', lessonId)
      .first()

    if (!videoView) {
      videoView = await VideoView.create({
        userId,
        lessonId,
        viewCount: 0,
        customViewLimit: customLimit,
      })
    } else {
      videoView.customViewLimit = customLimit
      await videoView.save()
    }

    return response.ok({
      message: 'Custom view limit set successfully',
      videoView
    })
  }

  /**
   * Remove custom view limit (use default)
   */
  async removeCustomViewLimit({ params, response }: HttpContext) {
    const userId = Number(params.userId)
    const lessonId = Number(params.lessonId)

    const videoView = await VideoView.query()
      .where('user_id', userId)
      .where('lesson_id', lessonId)
      .first()

    if (videoView) {
      videoView.customViewLimit = null
      await videoView.save()
    }

    return response.ok({ message: 'Custom view limit removed' })
  }
}

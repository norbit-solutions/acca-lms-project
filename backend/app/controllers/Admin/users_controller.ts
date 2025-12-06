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
        query.preload('lesson')
      })
      .firstOrFail()

    return response.ok({ user })
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
}

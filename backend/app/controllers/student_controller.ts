import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import Enrollment from '#models/enrollment'
import Lesson from '#models/lesson'
import VideoView from '#models/video_view'
import User from '#models/user'
import MuxService from '#services/mux_service'

interface EnrolledCourse {
  id: number
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  chaptersCount: number
  lessonsCount: number
  completedLessons: number
  progress: number
  enrolledAt: string
}

interface CourseWithProgress {
  id: number
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  chapters: ChapterWithProgress[]
  progress: {
    completed: number
    total: number
    percentage: number
  }
}

interface ChapterWithProgress {
  id: number
  title: string
  sortOrder: number
  lessons: LessonWithProgress[]
}

interface LessonWithProgress {
  id: number
  title: string
  sortOrder: number
  duration: number | null
  isFree: boolean
  viewCount: number
  maxViews: number
  isCompleted: boolean
  canWatch: boolean
}

interface LessonDetail {
  id: number
  title: string
  duration: number | null
  isFree: boolean
  maxViews: number
  viewCount: number
  canWatch: boolean
  playbackId: string | null
  signedUrl: string | null
  watermark: WatermarkData
  chapter: {
    id: number
    title: string
  }
  course: {
    id: number
    title: string
    slug: string
  }
}

interface WatermarkData {
  text: string
  phone: string
  timestamp: string
}

interface ViewStatus {
  lessonId: number
  viewCount: number
  maxViews: number
  canWatch: boolean
  remainingViews: number
}

export default class StudentController {
  /**
   * Get all enrolled courses for current user
   */
  async myCourses({ auth, response }: HttpContext) {
    const user = auth.user as User

    const enrollments = await Enrollment.query()
      .where('user_id', user.id)
      .preload('course', (courseQuery) => {
        courseQuery.preload('chapters', (chapterQuery) => {
          chapterQuery.preload('lessons')
        })
      })
      .orderBy('enrolled_at', 'desc')

    // Get video views for this user
    const videoViews = await VideoView.query().where('user_id', user.id)
    const viewsByLesson = new Map<number, number>()
    videoViews.forEach((v) => viewsByLesson.set(v.lessonId, v.viewCount))

    const courses: EnrolledCourse[] = enrollments.map((enrollment) => {
      const course = enrollment.course
      let totalLessons = 0
      let completedLessons = 0

      course.chapters.forEach((chapter) => {
        chapter.lessons.forEach((lesson) => {
          totalLessons++
          const viewCount = viewsByLesson.get(lesson.id) || 0
          if (viewCount > 0) {
            completedLessons++
          }
        })
      })

      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail: course.thumbnail,
        chaptersCount: course.chapters.length,
        lessonsCount: totalLessons,
        completedLessons,
        progress,
        enrolledAt: enrollment.enrolledAt.toISO() || '',
      }
    })

    return response.ok({ courses })
  }

  /**
   * Get single enrolled course with progress
   */
  async myCourse({ auth, params, response }: HttpContext) {
    const user = auth.user as User

    // Find course and verify enrollment
    const course = await Course.query()
      .where('slug', params.slug)
      .preload('chapters', (chapterQuery) => {
        chapterQuery.orderBy('sort_order', 'asc')
        chapterQuery.preload('lessons', (lessonQuery) => {
          lessonQuery.orderBy('sort_order', 'asc')
        })
      })
      .first()

    if (!course) {
      return response.notFound({ message: 'Course not found' })
    }

    const enrollment = await Enrollment.query()
      .where('user_id', user.id)
      .where('course_id', course.id)
      .first()

    if (!enrollment) {
      return response.forbidden({ message: 'You are not enrolled in this course' })
    }

    // Get video views for this user
    const videoViews = await VideoView.query().where('user_id', user.id)
    const viewsByLesson = new Map<number, number>()
    videoViews.forEach((v) => viewsByLesson.set(v.lessonId, v.viewCount))

    let totalLessons = 0
    let completedLessons = 0

    const chapters: ChapterWithProgress[] = course.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      sortOrder: chapter.sortOrder,
      lessons: chapter.lessons.map((lesson) => {
        totalLessons++
        const viewCount = viewsByLesson.get(lesson.id) || 0
        const isCompleted = viewCount > 0
        if (isCompleted) completedLessons++

        return {
          id: lesson.id,
          title: lesson.title,
          sortOrder: lesson.sortOrder,
          duration: lesson.duration,
          isFree: lesson.isFree,
          viewCount,
          maxViews: lesson.viewLimit,
          isCompleted,
          canWatch: viewCount < lesson.viewLimit,
        }
      }),
    }))

    const result: CourseWithProgress = {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnail: course.thumbnail,
      chapters,
      progress: {
        completed: completedLessons,
        total: totalLessons,
        percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      },
    }

    return response.ok({ course: result })
  }

  /**
   * Get lesson for playback with signed URL
   */
  async lesson({ auth, params, response }: HttpContext) {
    const user = auth.user as User
    const lessonId = Number(params.id)

    const lesson = await Lesson.query()
      .where('id', lessonId)
      .preload('chapter', (chapterQuery) => {
        chapterQuery.preload('course')
      })
      .first()

    if (!lesson) {
      return response.notFound({ message: 'Lesson not found' })
    }

    const course = lesson.chapter.course

    // Check if lesson is free or user is enrolled
    if (!lesson.isFree) {
      const enrollment = await Enrollment.query()
        .where('user_id', user.id)
        .where('course_id', course.id)
        .first()

      if (!enrollment) {
        return response.forbidden({ message: 'You are not enrolled in this course' })
      }
    }

    // Get or create video view record
    let videoView = await VideoView.query()
      .where('user_id', user.id)
      .where('lesson_id', lessonId)
      .first()

    const viewCount = videoView?.viewCount || 0
    const canWatch = viewCount < lesson.viewLimit

    // Generate signed URL if user can watch and video exists
    let signedUrl: string | null = null
    if (canWatch && lesson.muxPlaybackId) {
      signedUrl = MuxService.generateSignedUrl(lesson.muxPlaybackId)
    }

    // Generate watermark data
    const now = new Date()
    const watermark: WatermarkData = {
      text: `${user.phone} | ${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`,
      phone: user.phone || '',
      timestamp: now.toISOString(),
    }

    const result: LessonDetail = {
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration,
      isFree: lesson.isFree,
      maxViews: lesson.viewLimit,
      viewCount,
      canWatch,
      playbackId: canWatch ? lesson.muxPlaybackId : null,
      signedUrl,
      watermark,
      chapter: {
        id: lesson.chapter.id,
        title: lesson.chapter.title,
      },
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
      },
    }

    return response.ok({ lesson: result })
  }

  /**
   * Start or increment a view for a lesson
   */
  async startView({ auth, params, response }: HttpContext) {
    const user = auth.user as User
    const lessonId = Number(params.id)

    const lesson = await Lesson.query()
      .where('id', lessonId)
      .preload('chapter', (chapterQuery) => {
        chapterQuery.preload('course')
      })
      .first()

    if (!lesson) {
      return response.notFound({ message: 'Lesson not found' })
    }

    // Check enrollment for non-free lessons
    if (!lesson.isFree) {
      const enrollment = await Enrollment.query()
        .where('user_id', user.id)
        .where('course_id', lesson.chapter.course.id)
        .first()

      if (!enrollment) {
        return response.forbidden({ message: 'You are not enrolled in this course' })
      }
    }

    // Get or create video view record
    let videoView = await VideoView.query()
      .where('user_id', user.id)
      .where('lesson_id', lessonId)
      .first()

    if (!videoView) {
      videoView = await VideoView.create({
        userId: user.id,
        lessonId,
        viewCount: 1,
      })
    } else {
      if (videoView.viewCount >= lesson.viewLimit) {
        return response.forbidden({
          message: 'View limit reached for this lesson',
          viewCount: videoView.viewCount,
          maxViews: lesson.viewLimit,
        })
      }
      videoView.viewCount++
      await videoView.save()
    }

    const result: ViewStatus = {
      lessonId,
      viewCount: videoView.viewCount,
      maxViews: lesson.viewLimit,
      canWatch: videoView.viewCount < lesson.viewLimit,
      remainingViews: Math.max(0, lesson.viewLimit - videoView.viewCount),
    }

    return response.ok(result)
  }

  /**
   * Get view status for a lesson
   */
  async viewStatus({ auth, params, response }: HttpContext) {
    const user = auth.user as User
    const lessonId = Number(params.id)

    const lesson = await Lesson.find(lessonId)
    if (!lesson) {
      return response.notFound({ message: 'Lesson not found' })
    }

    const videoView = await VideoView.query()
      .where('user_id', user.id)
      .where('lesson_id', lessonId)
      .first()

    const viewCount = videoView?.viewCount || 0

    const result: ViewStatus = {
      lessonId,
      viewCount,
      maxViews: lesson.viewLimit,
      canWatch: viewCount < lesson.viewLimit,
      remainingViews: Math.max(0, lesson.viewLimit - viewCount),
    }

    return response.ok(result)
  }
}

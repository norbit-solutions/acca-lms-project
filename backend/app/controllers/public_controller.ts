import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import CmsContent from '#models/cms_content'
import Testimonial from '#models/testimonial'
import Instructor from '#models/instructor'

interface CourseListItem {
  id: number
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  chaptersCount: number
  lessonsCount: number
  /** Price for display only - payments handled via WhatsApp */
  price: number | null
  currency: string
  isFree: boolean
  isPublished: boolean
  isUpcoming: boolean
}

interface CourseDetail {
  id: number
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  /** Price for display only - payments handled via WhatsApp */
  price: number | null
  currency: string
  isFree: boolean
  chapters: ChapterWithLessons[]
}

interface ChapterWithLessons {
  id: number
  title: string
  sortOrder: number
  lessons: LessonPreview[]
}

interface LessonPreview {
  id: number
  title: string
  sortOrder: number
  duration: number | null
  isFree: boolean
}

interface CmsSection {
  section: string
  content: Record<string, unknown>
}

interface TestimonialItem {
  id: number
  name: string
  designation: string | null
  content: string
  rating: number
  avatarUrl: string | null
}

interface InstructorItem {
  id: number
  name: string
  title: string | null
  bio: string | null
  avatarUrl: string | null
}

export default class PublicController {
  /**
   * List all published courses
   */
  async courses({ response }: HttpContext) {
    // Include published courses OR unpublished courses marked as upcoming
    const courses = await Course.query()
      .where((query) => {
        query.where('is_published', true).orWhere('is_upcoming', true)
      })
      .withCount('chapters')
      .orderBy('created_at', 'desc')

    // Get lesson counts per course
    const coursesWithCounts: CourseListItem[] = await Promise.all(
      courses.map(async (course) => {
        const lessonsCount = await course
          .related('chapters')
          .query()
          .withCount('lessons')
          .then((chapters) =>
            chapters.reduce((sum, ch) => sum + Number(ch.$extras.lessons_count || 0), 0)
          )

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          thumbnail: course.thumbnail,
          chaptersCount: Number(course.$extras.chapters_count || 0),
          lessonsCount,
          price: course.price,
          currency: course.currency,
          isFree: course.isFree,
          isPublished: course.isPublished,
          isUpcoming: course.isUpcoming,
        }
      })
    )

    return response.ok({ courses: coursesWithCounts })
  }

  /**
   * Get single course by slug (public preview)
   */
  async course({ params, response }: HttpContext) {
    const course = await Course.query()
      .where('slug', params.slug)
      .where('is_published', true)
      .preload('chapters', (chapterQuery) => {
        chapterQuery.orderBy('sort_order', 'asc')
        chapterQuery.preload('lessons', (lessonQuery) => {
          lessonQuery.orderBy('sort_order', 'asc')
          lessonQuery.select(['id', 'title', 'sort_order', 'duration', 'is_free', 'chapter_id'])
        })
      })
      .first()

    if (!course) {
      return response.notFound({ message: 'Course not found' })
    }

    const courseDetail: CourseDetail = {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnail: course.thumbnail,
      price: course.price,
      currency: course.currency,
      isFree: course.isFree,
      chapters: course.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        sortOrder: chapter.sortOrder,
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          sortOrder: lesson.sortOrder,
          duration: lesson.duration,
          isFree: lesson.isFree,
        })),
      })),
    }

    return response.ok({ course: courseDetail })
  }

  /**
   * Get CMS content by section
   */
  async cms({ params, response }: HttpContext) {
    const section = params.section as string

    const cmsContent = await CmsContent.findBy('sectionKey', section)

    if (!cmsContent) {
      return response.notFound({ message: 'Section not found' })
    }

    const result: CmsSection = {
      section: cmsContent.sectionKey,
      content: cmsContent.content as Record<string, unknown>,
    }

    return response.ok(result)
  }

  /**
   * Get all testimonials
   */
  async testimonials({ response }: HttpContext) {
    const testimonials = await Testimonial.query()
      .where('is_active', true)
      .orderBy('sort_order', 'asc')

    const result: TestimonialItem[] = testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      designation: null,
      content: t.content,
      rating: 5,
      avatarUrl: t.image,
    }))

    return response.ok({ testimonials: result })
  }

  /**
   * Get all instructors
   */
  async instructors({ response }: HttpContext) {
    const instructors = await Instructor.query()
      .where('is_active', true)
      .orderBy('sort_order', 'asc')

    const result: InstructorItem[] = instructors.map((i) => ({
      id: i.id,
      name: i.name,
      title: null,
      bio: i.bio,
      avatarUrl: i.image,
    }))

    return response.ok({ instructors: result })
  }
}

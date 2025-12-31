import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import { v4 as uuidv4 } from 'uuid'
import env from '#start/env'
import jwt from 'jsonwebtoken'

/**
 * Generate signed thumbnail URL for Mux
 */
function generateSignedThumbnailUrl(playbackId: string): string {
  const signingKeyId = env.get('MUX_SIGNING_KEY_ID')
  const signingKeySecret = env.get('MUX_SIGNING_PRIVATE_KEY')

  if (!signingKeyId || !signingKeySecret) {
    // Return unsigned URL if signing not configured
    return `https://image.mux.com/${playbackId}/thumbnail.png?width=80&height=45`
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: playbackId,
    aud: 't',
    exp: now + 3600,
    kid: signingKeyId,
  }

  const keySecret = Buffer.from(signingKeySecret, 'base64')
  const token = jwt.sign(payload, keySecret, {
    algorithm: 'RS256',
    keyid: signingKeyId,
  })

  return `https://image.mux.com/${playbackId}/thumbnail.png?width=80&height=45&token=${token}`
}

export default class CoursesController {
  /**
   * List all courses
   */
  async index({ response }: HttpContext) {
    const courses = await Course.query()
      .withCount('chapters')
      .withCount('enrollments')
      .orderBy('created_at', 'desc')

    // Get lesson counts per course
    const coursesWithCounts = await Promise.all(
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
          enrollmentsCount: Number(course.$extras.enrollments_count || 0),
          isPublished: course.isPublished,
          isUpcoming: course.isUpcoming,
          price: course.price,
          currency: course.currency,
          isFree: course.isFree,
          createdAt: course.createdAt?.toISO() || '',
          updatedAt: course.updatedAt?.toISO() || '',
        }
      })
    )

    return response.ok({ courses: coursesWithCounts })
  }

  /**
   * Get single course with chapters and lessons
   */
  async show({ params, response }: HttpContext) {
    const course = await Course.query()
      .where('id', params.id)
      .preload('chapters', (query) => {
        query.orderBy('sort_order', 'asc')
        query.preload('lessons', (lessonQuery) => {
          lessonQuery.orderBy('sort_order', 'asc')
        })
      })
      .firstOrFail()

    // Transform to include signed thumbnail URLs and ensure attachments are included
    const courseData = course.serialize()
    courseData.chapters = courseData.chapters.map((chapter: Record<string, unknown>) => ({
      ...chapter,
      lessons: (chapter.lessons as Array<Record<string, unknown>>).map((lesson) => ({
        ...lesson,
        thumbnailUrl: lesson.muxPlaybackId
          ? generateSignedThumbnailUrl(lesson.muxPlaybackId as string)
          : null,
        // Ensure attachments is always an array (parse if it's a string)
        attachments: typeof lesson.attachments === 'string'
          ? JSON.parse(lesson.attachments)
          : (lesson.attachments || []),
      })),
    }))

    return response.ok({ course: courseData })
  }

  /**
   * Create a new course
   */
  async store({ request, response }: HttpContext) {
    const { title, description, thumbnail, isPublished, isUpcoming, price, currency, isFree } = request.only([
      'title',
      'description',
      'thumbnail',
      'isPublished',
      'isUpcoming',
      'price',
      'currency',
      'isFree',
    ])

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug exists, append uuid if needed
    const existingCourse = await Course.findBy('slug', baseSlug)
    const slug = existingCourse ? `${baseSlug}-${uuidv4().slice(0, 8)}` : baseSlug

    const course = await Course.create({
      title,
      slug,
      description,
      thumbnail,
      isPublished: isPublished || false,
      isUpcoming: isUpcoming || false,
      price: price ?? null,
      currency: currency || 'INR',
      isFree: isFree || false,
    })

    return response.created({ course })
  }

  /**
   * Update a course
   */
  async update({ params, request, response }: HttpContext) {
    const course = await Course.findOrFail(params.id)

    const { title, description, thumbnail, isPublished, isUpcoming, price, currency, isFree } = request.only([
      'title',
      'description',
      'thumbnail',
      'isPublished',
      'isUpcoming',
      'price',
      'currency',
      'isFree',
    ])

    course.merge({
      title: title ?? course.title,
      description: description ?? course.description,
      thumbnail: thumbnail ?? course.thumbnail,
      isPublished: isPublished !== undefined ? isPublished : course.isPublished,
      isUpcoming: isUpcoming !== undefined ? isUpcoming : course.isUpcoming,
      price: price ?? course.price,
      currency: currency ?? course.currency,
      isFree: isFree ?? course.isFree,
    })

    await course.save()

    return response.ok({ course })
  }

  /**
   * Delete a course
   */
  async destroy({ params, response }: HttpContext) {
    const course = await Course.findOrFail(params.id)
    await course.delete()

    return response.ok({ message: 'Course deleted successfully' })
  }
}

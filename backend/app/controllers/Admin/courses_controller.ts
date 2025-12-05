import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import { v4 as uuidv4 } from 'uuid'

export default class CoursesController {
  /**
   * List all courses
   */
  async index({ response }: HttpContext) {
    const courses = await Course.query()
      .withCount('chapters')
      .withCount('enrollments')
      .orderBy('created_at', 'desc')

    return response.ok({ courses })
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

    return response.ok({ course })
  }

  /**
   * Create a new course
   */
  async store({ request, response }: HttpContext) {
    const { title, description, thumbnail, isPublished } = request.only([
      'title',
      'description',
      'thumbnail',
      'isPublished',
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
    })

    return response.created({ course })
  }

  /**
   * Update a course
   */
  async update({ params, request, response }: HttpContext) {
    const course = await Course.findOrFail(params.id)

    const { title, description, thumbnail, isPublished } = request.only([
      'title',
      'description',
      'thumbnail',
      'isPublished',
    ])

    course.merge({
      title,
      description,
      thumbnail,
      isPublished,
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

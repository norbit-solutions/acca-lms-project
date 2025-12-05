import type { HttpContext } from '@adonisjs/core/http'
import Chapter from '#models/chapter'
import Course from '#models/course'

export default class ChaptersController {
  /**
   * Create a new chapter for a course
   */
  async store({ params, request, response }: HttpContext) {
    const course = await Course.findOrFail(params.courseId)

    const { title, sortOrder } = request.only(['title', 'sortOrder'])

    // Get max sort order if not provided
    let order = sortOrder
    if (order === undefined) {
      const maxOrder = await Chapter.query()
        .where('course_id', course.id)
        .max('sort_order as max')
      order = (maxOrder[0]?.$extras?.max || 0) + 1
    }

    const chapter = await Chapter.create({
      courseId: course.id,
      title,
      sortOrder: order,
    })

    return response.created({ chapter })
  }

  /**
   * Update a chapter
   */
  async update({ params, request, response }: HttpContext) {
    const chapter = await Chapter.findOrFail(params.id)

    const { title, sortOrder } = request.only(['title', 'sortOrder'])

    chapter.merge({
      title,
      sortOrder,
    })

    await chapter.save()

    return response.ok({ chapter })
  }

  /**
   * Delete a chapter
   */
  async destroy({ params, response }: HttpContext) {
    const chapter = await Chapter.findOrFail(params.id)
    await chapter.delete()

    return response.ok({ message: 'Chapter deleted successfully' })
  }

  /**
   * Reorder chapters
   */
  async reorder({ params, request, response }: HttpContext) {
    const { chapters } = request.only(['chapters']) // Array of { id, sortOrder }

    for (const item of chapters) {
      await Chapter.query()
        .where('id', item.id)
        .where('course_id', params.courseId)
        .update({ sort_order: item.sortOrder })
    }

    return response.ok({ message: 'Chapters reordered successfully' })
  }
}
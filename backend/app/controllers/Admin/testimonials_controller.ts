import type { HttpContext } from '@adonisjs/core/http'
import Testimonial from '#models/testimonial'
import Course from '#models/course'

// Request/Response interfaces for strict typing
interface TestimonialData {
  id: number
  name: string
  image: string | null
  content: string
  courseId: number | null
  courseName: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CreateTestimonialRequest {
  name: string
  content: string
  image?: string | null
  courseId?: number | null
  sortOrder?: number
  isActive?: boolean
}

interface UpdateTestimonialRequest {
  name?: string
  content?: string
  image?: string | null
  courseId?: number | null
  sortOrder?: number
  isActive?: boolean
}

interface TestimonialListResponse {
  testimonials: TestimonialData[]
  total: number
}

interface TestimonialItemResponse {
  testimonial: TestimonialData
}

export default class TestimonialsController {
  /**
   * List all testimonials with optional filtering
   */
  async index({ request, response }: HttpContext): Promise<void> {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))
    const activeOnly = request.input('activeOnly') === 'true'

    const query = Testimonial.query()
      .preload('course')
      .orderBy('sortOrder', 'asc')
      .orderBy('createdAt', 'desc')

    if (activeOnly) {
      query.where('isActive', true)
    }

    const testimonials = await query.paginate(page, limit)

    const result: TestimonialData[] = testimonials.all().map((t) => ({
      id: t.id,
      name: t.name,
      image: t.image,
      content: t.content,
      courseId: t.courseId,
      courseName: t.course?.title ?? null,
      sortOrder: t.sortOrder,
      isActive: t.isActive,
      createdAt: t.createdAt.toISO() ?? '',
      updatedAt: t.updatedAt.toISO() ?? '',
    }))

    const responseData: TestimonialListResponse = {
      testimonials: result,
      total: testimonials.total,
    }
    response.ok(responseData)
  }

  /**
   * Get single testimonial by ID
   */
  async show({ params, response }: HttpContext): Promise<void> {
    const id = Number(params.id)
    const testimonial = await Testimonial.query().where('id', id).preload('course').first()

    if (!testimonial) {
      response.notFound({ error: 'Testimonial not found' })
      return
    }

    const result: TestimonialData = {
      id: testimonial.id,
      name: testimonial.name,
      image: testimonial.image,
      content: testimonial.content,
      courseId: testimonial.courseId,
      courseName: testimonial.course?.title ?? null,
      sortOrder: testimonial.sortOrder,
      isActive: testimonial.isActive,
      createdAt: testimonial.createdAt.toISO() ?? '',
      updatedAt: testimonial.updatedAt.toISO() ?? '',
    }

    const responseData: TestimonialItemResponse = { testimonial: result }
    response.ok(responseData)
  }

  /**
   * Create new testimonial
   */
  async store({ request, response }: HttpContext): Promise<void> {
    const body = request.body() as CreateTestimonialRequest
    const { name, content, image, courseId, sortOrder, isActive } = body

    if (!name || !content) {
      response.badRequest({ error: 'name and content are required' })
      return
    }

    // Validate courseId if provided
    if (courseId) {
      const course = await Course.find(courseId)
      if (!course) {
        response.badRequest({ error: 'Invalid courseId' })
        return
      }
    }

    // Get max sortOrder if not provided
    let order = sortOrder
    if (order === undefined) {
      const maxOrder = await Testimonial.query().max('sort_order as maxOrder')
      const maxOrderValue = maxOrder[0]?.$extras?.maxOrder as number | null
      order = (maxOrderValue ?? 0) + 1
    }

    const testimonial = await Testimonial.create({
      name,
      content,
      image: image ?? null,
      courseId: courseId ?? null,
      sortOrder: order,
      isActive: isActive ?? true,
    })

    // Load course relation
    await testimonial.load('course')

    const result: TestimonialData = {
      id: testimonial.id,
      name: testimonial.name,
      image: testimonial.image,
      content: testimonial.content,
      courseId: testimonial.courseId,
      courseName: testimonial.course?.title ?? null,
      sortOrder: testimonial.sortOrder,
      isActive: testimonial.isActive,
      createdAt: testimonial.createdAt.toISO() ?? '',
      updatedAt: testimonial.updatedAt.toISO() ?? '',
    }

    const responseData: TestimonialItemResponse = { testimonial: result }
    response.created(responseData)
  }

  /**
   * Update testimonial
   */
  async update({ params, request, response }: HttpContext): Promise<void> {
    const id = Number(params.id)
    const testimonial = await Testimonial.find(id)

    if (!testimonial) {
      response.notFound({ error: 'Testimonial not found' })
      return
    }

    const body = request.body() as UpdateTestimonialRequest
    const { name, content, image, courseId, sortOrder, isActive } = body

    // Validate courseId if provided
    if (courseId !== undefined && courseId !== null) {
      const course = await Course.find(courseId)
      if (!course) {
        response.badRequest({ error: 'Invalid courseId' })
        return
      }
    }

    // Update fields
    if (name !== undefined) testimonial.name = name
    if (content !== undefined) testimonial.content = content
    if (image !== undefined) testimonial.image = image
    if (courseId !== undefined) testimonial.courseId = courseId
    if (sortOrder !== undefined) testimonial.sortOrder = sortOrder
    if (isActive !== undefined) testimonial.isActive = isActive

    await testimonial.save()
    await testimonial.load('course')

    const result: TestimonialData = {
      id: testimonial.id,
      name: testimonial.name,
      image: testimonial.image,
      content: testimonial.content,
      courseId: testimonial.courseId,
      courseName: testimonial.course?.title ?? null,
      sortOrder: testimonial.sortOrder,
      isActive: testimonial.isActive,
      createdAt: testimonial.createdAt.toISO() ?? '',
      updatedAt: testimonial.updatedAt.toISO() ?? '',
    }

    const responseData: TestimonialItemResponse = { testimonial: result }
    response.ok(responseData)
  }

  /**
   * Delete testimonial
   */
  async destroy({ params, response }: HttpContext): Promise<void> {
    const id = Number(params.id)
    const testimonial = await Testimonial.find(id)

    if (!testimonial) {
      response.notFound({ error: 'Testimonial not found' })
      return
    }

    await testimonial.delete()
    response.ok({ message: 'Testimonial deleted' })
  }

  /**
   * Reorder testimonials
   */
  async reorder({ request, response }: HttpContext): Promise<void> {
    interface ReorderItem {
      id: number
      sortOrder: number
    }
    const body = request.body() as { items: ReorderItem[] }
    const { items } = body

    if (!items || !Array.isArray(items)) {
      response.badRequest({ error: 'items array is required' })
      return
    }

    for (const item of items) {
      await Testimonial.query().where('id', item.id).update({ sortOrder: item.sortOrder })
    }

    response.ok({ message: 'Testimonials reordered' })
  }
}

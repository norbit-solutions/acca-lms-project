import type { HttpContext } from '@adonisjs/core/http'
import Instructor from '#models/instructor'

// Request/Response interfaces for strict typing
interface InstructorData {
  id: number
  name: string
  title: string | null
  image: string | null
  bio: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CreateInstructorRequest {
  name: string
  title?: string | null
  image?: string | null
  bio?: string | null
  sortOrder?: number
  isActive?: boolean
}

interface UpdateInstructorRequest {
  name?: string
  title?: string | null
  image?: string | null
  bio?: string | null
  sortOrder?: number
  isActive?: boolean
}

interface InstructorListResponse {
  instructors: InstructorData[]
  total: number
}

interface InstructorItemResponse {
  instructor: InstructorData
}

export default class InstructorsController {
  /**
   * List all instructors with optional filtering
   */
  async index({ request, response }: HttpContext): Promise<void> {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))
    const activeOnly = request.input('activeOnly') === 'true'

    const query = Instructor.query().orderBy('sortOrder', 'asc').orderBy('name', 'asc')

    if (activeOnly) {
      query.where('isActive', true)
    }

    const instructors = await query.paginate(page, limit)

    const result: InstructorData[] = instructors.all().map((i) => ({
      id: i.id,
      name: i.name,
      title: i.title,
      image: i.image,
      bio: i.bio,
      sortOrder: i.sortOrder,
      isActive: i.isActive,
      createdAt: i.createdAt.toISO() ?? '',
      updatedAt: i.updatedAt.toISO() ?? '',
    }))

    const responseData: InstructorListResponse = {
      instructors: result,
      total: instructors.total,
    }
    response.ok(responseData)
  }

  /**
   * Get single instructor by ID
   */
  async show({ params, response }: HttpContext): Promise<void> {
    const id = Number(params.id)
    const instructor = await Instructor.find(id)

    if (!instructor) {
      response.notFound({ error: 'Instructor not found' })
      return
    }

    const result: InstructorData = {
      id: instructor.id,
      name: instructor.name,
      title: instructor.title,
      image: instructor.image,
      bio: instructor.bio,
      sortOrder: instructor.sortOrder,
      isActive: instructor.isActive,
      createdAt: instructor.createdAt.toISO() ?? '',
      updatedAt: instructor.updatedAt.toISO() ?? '',
    }

    const responseData: InstructorItemResponse = { instructor: result }
    response.ok(responseData)
  }

  /**
   * Create new instructor
   */
  async store({ request, response }: HttpContext): Promise<void> {
    const body = request.body() as CreateInstructorRequest
    const { name, title, image, bio, sortOrder, isActive } = body

    if (!name) {
      response.badRequest({ error: 'name is required' })
      return
    }

    // Get max sortOrder if not provided
    let order = sortOrder
    if (order === undefined) {
      const maxOrder = await Instructor.query().max('sort_order as maxOrder')
      const maxOrderValue = maxOrder[0]?.$extras?.maxOrder as number | null
      order = (maxOrderValue ?? 0) + 1
    }

    const instructor = await Instructor.create({
      name,
      title: title ?? null,
      image: image ?? null,
      bio: bio ?? null,
      sortOrder: order,
      isActive: isActive ?? true,
    })

    const result: InstructorData = {
      id: instructor.id,
      name: instructor.name,
      title: instructor.title,
      image: instructor.image,
      bio: instructor.bio,
      sortOrder: instructor.sortOrder,
      isActive: instructor.isActive,
      createdAt: instructor.createdAt.toISO() ?? '',
      updatedAt: instructor.updatedAt.toISO() ?? '',
    }

    const responseData: InstructorItemResponse = { instructor: result }
    response.created(responseData)
  }

  /**
   * Update instructor
   */
  async update({ params, request, response }: HttpContext): Promise<void> {
    const id = Number(params.id)
    const instructor = await Instructor.find(id)

    if (!instructor) {
      response.notFound({ error: 'Instructor not found' })
      return
    }

    const body = request.body() as UpdateInstructorRequest
    const { name, title, image, bio, sortOrder, isActive } = body

    // Update fields
    if (name !== undefined) instructor.name = name
    if (title !== undefined) instructor.title = title
    if (image !== undefined) instructor.image = image
    if (bio !== undefined) instructor.bio = bio
    if (sortOrder !== undefined) instructor.sortOrder = sortOrder
    if (isActive !== undefined) instructor.isActive = isActive

    await instructor.save()

    const result: InstructorData = {
      id: instructor.id,
      name: instructor.name,
      title: instructor.title,
      image: instructor.image,
      bio: instructor.bio,
      sortOrder: instructor.sortOrder,
      isActive: instructor.isActive,
      createdAt: instructor.createdAt.toISO() ?? '',
      updatedAt: instructor.updatedAt.toISO() ?? '',
    }

    const responseData: InstructorItemResponse = { instructor: result }
    response.ok(responseData)
  }

  /**
   * Delete instructor
   */
  async destroy({ params, response }: HttpContext): Promise<void> {
    const id = Number(params.id)
    const instructor = await Instructor.find(id)

    if (!instructor) {
      response.notFound({ error: 'Instructor not found' })
      return
    }

    await instructor.delete()
    response.ok({ message: 'Instructor deleted' })
  }

  /**
   * Reorder instructors
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
      await Instructor.query().where('id', item.id).update({ sortOrder: item.sortOrder })
    }

    response.ok({ message: 'Instructors reordered' })
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import Enrollment from '#models/enrollment'
import User from '#models/user'
import Course from '#models/course'
import { DateTime } from 'luxon'

export default class EnrollmentsController {
  /**
   * List all enrollments
   */
  async index({ request, response }: HttpContext) {
    const { courseId, userId } = request.qs()

    const query = Enrollment.query()
      .preload('user')
      .preload('course')
      .preload('enrolledByUser')
      .orderBy('enrolled_at', 'desc')

    if (courseId) {
      query.where('course_id', courseId)
    }

    if (userId) {
      query.where('user_id', userId)
    }

    const enrollments = await query

    return response.ok({ enrollments })
  }

  /**
   * Enroll a user to a course
   */
  async store({ auth, request, response }: HttpContext) {
    const { userId, courseId, email, phone } = request.only([
      'userId',
      'courseId',
      'email',
      'phone',
    ])

    // Find user by ID, email, or phone
    let user: User | null = null
    
    if (userId) {
      user = await User.find(userId)
    } else if (email) {
      user = await User.findBy('email', email)
    } else if (phone) {
      user = await User.findBy('phone', phone)
    }

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    // Check if course exists
    const course = await Course.find(courseId)
    if (!course) {
      return response.notFound({ message: 'Course not found' })
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.query()
      .where('user_id', user.id)
      .where('course_id', courseId)
      .first()

    if (existingEnrollment) {
      return response.conflict({ message: 'User is already enrolled in this course' })
    }

    const enrollment = await Enrollment.create({
      userId: user.id,
      courseId: courseId,
      enrolledBy: auth.user!.id,
      enrolledAt: DateTime.now(),
    })

    await enrollment.load('user')
    await enrollment.load('course')

    return response.created({ enrollment })
  }

  /**
   * Remove an enrollment
   */
  async destroy({ params, response }: HttpContext) {
    const enrollment = await Enrollment.findOrFail(params.id)
    await enrollment.delete()

    return response.ok({ message: 'Enrollment removed successfully' })
  }
}
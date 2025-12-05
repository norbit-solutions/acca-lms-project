import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import User from '#models/user'
import Enrollment from '#models/enrollment'

export default class DashboardController {
  async stats({ response }: HttpContext) {
    const [totalCourses, totalStudents, totalEnrollments, recentEnrollments] = await Promise.all([
      Course.query().count('* as total').first(),
      User.query().where('role', 'student').count('* as total').first(),
      Enrollment.query().count('* as total').first(),
      Enrollment.query()
        .preload('user', (q) => q.select('id', 'fullName', 'email'))
        .preload('course', (q) => q.select('id', 'title'))
        .orderBy('enrolledAt', 'desc')
        .limit(10),
    ])

    return response.json({
      totalCourses: Number(totalCourses?.$extras.total || 0),
      totalStudents: Number(totalStudents?.$extras.total || 0),
      totalEnrollments: Number(totalEnrollments?.$extras.total || 0),
      recentEnrollments: recentEnrollments.map((e) => ({
        id: e.id,
        user: {
          fullName: e.user.fullName,
          email: e.user.email,
        },
        course: {
          title: e.course.title,
        },
        createdAt: e.enrolledAt,
      })),
    })
  }
}

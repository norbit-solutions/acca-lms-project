import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Admin middleware ensures that only users with role 'admin'
 * can access the protected routes.
 */
export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Authentication required' })
    }

    if (user.role !== 'admin') {
      return response.forbidden({ message: 'Admin access required' })
    }

    const output = await next()
    return output
  }
}

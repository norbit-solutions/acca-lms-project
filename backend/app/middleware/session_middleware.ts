import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Session middleware enforces single active session per user.
 * Checks if the session token in the request header matches
 * the user's current session token in database.
 */
export default class SessionMiddleware {
  async handle({ auth, request, response }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Authentication required' })
    }

    // Get session token from request header
    const sessionToken = request.header('X-Session-Token')

    // Validate session token matches user's current session
    if (!sessionToken || sessionToken !== user.sessionToken) {
      return response.unauthorized({
        message: 'Session expired. You have been logged in from another device.',
        code: 'SESSION_INVALID',
      })
    }

    const output = await next()
    return output
  }
}

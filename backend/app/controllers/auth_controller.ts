import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { v4 as uuidv4 } from 'uuid'

export default class AuthController {
  /**
   * Register a new student account
   */
  async register({ request, response }: HttpContext) {
    const { fullName, email, phone, password } = request.only([
      'fullName',
      'email',
      'phone',
      'password',
    ])

    // Check if user already exists
    const existingUser = await User.query()
      .where('email', email)
      .orWhere('phone', phone)
      .first()

    if (existingUser) {
      return response.conflict({ message: 'User with this email or phone already exists' })
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: 'student',
    })

    // Generate session token and access token
    const sessionToken = uuidv4()
    user.sessionToken = sessionToken
    await user.save()

    const token = await User.accessTokens.create(user)

    return response.created({
      message: 'Registration successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: token.value!.release(),
      sessionToken,
    })
  }

  /**
   * Login user - invalidates previous session (single session enforcement)
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)

    // Invalidate all previous tokens (single session)
    await User.accessTokens.delete(user, user.id)

    // Generate new session token
    const sessionToken = uuidv4()
    user.sessionToken = sessionToken
    await user.save()

    const token = await User.accessTokens.create(user)

    return response.ok({
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: token.value!.release(),
      sessionToken,
    })
  }

  /**
   * Logout current user
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.user!

    // Clear session token
    user.sessionToken = null
    await user.save()

    // Delete current access token
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({ message: 'Logged out successfully' })
  }

  /**
   * Get current authenticated user
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.user!

    return response.ok({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  }
}
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

/**
 * Instructor Model
 *
 * PURPOSE: Display-only data for the public landing page "Meet Our Instructors" section.
 * These are NOT user accounts - instructors don't have login capabilities.
 *
 * For user roles, see the User model with role field ('admin' | 'student').
 *
 * Managed by admin via:
 * - GET/POST/PUT/DELETE /admin/instructors
 *
 * Displayed publicly via:
 * - GET /instructors
 */
export default class Instructor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare image: string | null

  @column()
  declare bio: string | null

  @column()
  declare sortOrder: number

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Chapter from './chapter.js'
import Enrollment from './enrollment.js'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare thumbnail: string | null

  /**
   * Price is for display purposes only.
   * Payments are handled manually via WhatsApp contact.
   * null means price not set/TBD
   */
  @column()
  declare price: number | null

  /**
   * Currency code for price display (e.g., 'INR', 'USD')
   */
  @column()
  declare currency: string

  /**
   * If true, course is free. If false, check price field.
   */
  @column()
  declare isFree: boolean

  @column()
  declare isPublished: boolean

  /**
   * If true, course appears in "Upcoming Courses" section
   */
  @column()
  declare isUpcoming: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Chapter)
  declare chapters: HasMany<typeof Chapter>

  @hasMany(() => Enrollment)
  declare enrollments: HasMany<typeof Enrollment>
}

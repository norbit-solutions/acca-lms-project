import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CmsContent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sectionKey: string

  @column()
  declare content: Record<string, unknown>

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

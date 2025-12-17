import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Lesson from './lesson.js'

export default class VideoView extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare lessonId: number

  @column()
  declare viewCount: number

  @column()
  declare customViewLimit: number | null

  @column.dateTime()
  declare lastViewedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Lesson)
  declare lesson: BelongsTo<typeof Lesson>
}

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Chapter from './chapter.js'
import VideoView from './video_view.js'

export default class Lesson extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare chapterId: number

  @column()
  declare title: string

  @column()
  declare type: 'video' | 'text' | 'pdf'

  @column()
  declare content: string | null

  @column()
  declare pdfUrl: string | null

  @column()
  declare muxAssetId: string | null

  @column()
  declare muxUploadId: string | null

  @column()
  declare muxPlaybackId: string | null

  @column()
  declare muxStatus: 'pending' | 'ready' | 'error'

  @column()
  declare duration: number | null

  @column()
  declare viewLimit: number

  @column()
  declare isFree: boolean

  @column()
  declare sortOrder: number

  @column()
  declare description: string | null

  @column()
  declare attachments: Array<{ url: string; name: string; type: string }> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Chapter)
  declare chapter: BelongsTo<typeof Chapter>

  @hasMany(() => VideoView)
  declare videoViews: HasMany<typeof VideoView>

  // Alias for consistency
  get maxViews(): number {
    return this.viewLimit
  }
}

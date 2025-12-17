import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, afterFind, afterFetch } from '@adonisjs/lucid/orm'

export default class CmsContent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sectionKey: string

  @column()
  declare content: Record<string, unknown> | string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Serialize content to JSON string before saving to database
   */
  @beforeSave()
  static async serializeContent(cms: CmsContent) {
    if (cms.$dirty.content && typeof cms.content === 'object') {
      cms.content = JSON.stringify(cms.content) as unknown as Record<string, unknown>
    }
  }

  /**
   * Parse content from JSON string after fetching from database
   */
  @afterFind()
  static async parseContentAfterFind(cms: CmsContent) {
    if (typeof cms.content === 'string') {
      try {
        cms.content = JSON.parse(cms.content)
      } catch {
        // Keep as-is if parsing fails
      }
    }
  }

  /**
   * Parse content for all records after fetch
   */
  @afterFetch()
  static async parseContentAfterFetch(instances: CmsContent[]) {
    for (const cms of instances) {
      if (typeof cms.content === 'string') {
        try {
          cms.content = JSON.parse(cms.content)
        } catch {
          // Keep as-is if parsing fails
        }
      }
    }
  }
}

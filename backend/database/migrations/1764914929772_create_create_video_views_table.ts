import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'video_views'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('lesson_id').unsigned().references('id').inTable('lessons').onDelete('CASCADE')
      table.integer('view_count').defaultTo(0)
      table.timestamp('last_viewed_at').nullable()
      table.unique(['user_id', 'lesson_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lessons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('chapter_id')
        .unsigned()
        .references('id')
        .inTable('chapters')
        .onDelete('CASCADE')
      table.string('title', 255).notNullable()
      table.enum('type', ['video', 'text', 'pdf']).notNullable()
      table.text('content').nullable() // for text lessons
      table.string('pdf_url', 500).nullable() // for PDF lessons
      table.string('mux_asset_id', 255).nullable() // for video lessons
      table.string('mux_playback_id', 255).nullable() // for video lessons
      table.enum('mux_status', ['pending', 'ready', 'error']).defaultTo('pending')
      table.integer('duration').nullable() // video duration in seconds
      table.integer('view_limit').defaultTo(2)
      table.integer('sort_order').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

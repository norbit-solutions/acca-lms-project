import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lessons'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('mux_upload_id', 255).nullable().after('mux_asset_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('mux_upload_id')
    })
  }
}
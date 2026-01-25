import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Check if admin already exists
    const existingAdmin = await User.findBy('email', 'contact@learnspirepro.in')
    if (existingAdmin) {
      console.log('Client admin user already exists')
      return
    }

    // Create admin user (password will be auto-hashed by the AuthFinder mixin)
    await User.create({
      fullName: 'Learnspire Admin',
      email: 'contact@learnspirepro.in',
      phone: '+91 92880 00707',
      password: 'Le@rnspire#123',
      role: 'admin',
    })
  }
}

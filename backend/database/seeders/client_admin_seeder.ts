import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Check if admin already exists
    const existingAdmin = await User.findBy('email', 'learnspire@gmail.com')
    if (existingAdmin) {
      console.log('Client admin user already exists')
      return
    }

    // Create admin user (password will be auto-hashed by the AuthFinder mixin)
    await User.create({
      fullName: 'Learnspire Pro Learning',
      email: 'learnspire@gmail.com',
      phone: '+919876543210',
      password: 'Le@rnspire#123',
      role: 'admin',
    })
  }
}

import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Course from '#models/course'

export default class extends BaseSeeder {
  public async run() {
    // Create demo courses if none exist
    const count = await Course.query().count('* as total').first()
    const total = Number(count?.$extras?.total ?? 0)
    if (total > 0) {
      console.log('Courses already seeded')
      return
    }

    const demoCourses = [
      {
        title: 'Foundations of Accounting',
        slug: 'foundations-of-accounting',
        description: 'Introductory course covering the basics of accounting.',
        thumbnail: null,
        isPublished: true,
        price: 2500.0,
        currency: 'INR',
        isFree: false,
      },
      {
        title: 'Advanced Financial Reporting',
        slug: 'advanced-financial-reporting',
        description: 'Advanced topics for financial reporting and analysis.',
        thumbnail: null,
        isPublished: true,
        price: 5000.0,
        currency: 'INR',
        isFree: false,
      },
      {
        title: 'Free Sample Course',
        slug: 'free-sample-course',
        description: 'A free sample to try the platform.',
        thumbnail: null,
        isPublished: true,
        price: null,
        currency: 'INR',
        isFree: true,
      },
    ]

    for (const c of demoCourses) {
      await Course.create(c)
    }

    console.log('Demo courses seeded')
  }
}

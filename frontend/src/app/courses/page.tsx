import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Sample courses (will come from API later)
const courses = [
  { 
    id: 1, 
    slug: 'fa-financial-accounting', 
    title: 'FA - Financial Accounting', 
    description: 'Foundation level financial accounting covering double entry bookkeeping, financial statements, and accounting principles.', 
    lessons: 24,
    chapters: 8,
    level: 'Foundation'
  },
  { 
    id: 2, 
    slug: 'ma-management-accounting', 
    title: 'MA - Management Accounting', 
    description: 'Foundation level management accounting including costing, budgeting, and performance measurement.', 
    lessons: 20,
    chapters: 7,
    level: 'Foundation'
  },
  { 
    id: 3, 
    slug: 'fr-financial-reporting', 
    title: 'FR - Financial Reporting', 
    description: 'Skills level financial reporting covering IFRS standards, group accounts, and complex transactions.', 
    lessons: 32,
    chapters: 12,
    level: 'Skills'
  },
  { 
    id: 4, 
    slug: 'pm-performance-management', 
    title: 'PM - Performance Management', 
    description: 'Skills level performance management including advanced costing, decision making, and risk.', 
    lessons: 28,
    chapters: 10,
    level: 'Skills'
  },
]

export default function CoursesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Our Courses</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Comprehensive ACCA courses designed by experienced professionals to help you pass your exams with confidence.
            </p>
          </div>
        </div>

        {/* Course Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      course.level === 'Foundation' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                  <h2 className="font-bold text-xl mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>📖 {course.chapters} chapters</span>
                    <span>🎬 {course.lessons} lessons</span>
                  </div>
                  <Link 
                    href={`/courses/${course.slug}`}
                    className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollment CTA */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Enroll?</h2>
            <p className="text-gray-600 mb-6">
              Create a free account and contact us via WhatsApp to request enrollment in your desired course.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Create Account
              </Link>
              <a 
                href="https://wa.me/94XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600"
              >
                Contact via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

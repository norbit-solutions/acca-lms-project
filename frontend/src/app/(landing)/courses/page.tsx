import Link from "next/link";
import Image from "next/image";
import CourseNavbar from "@/components/CourseNavbar";
import Footer from "@/components/Footer";

// Sample courses (will come from API later)
const courses = [
  {
    id: 1,
    slug: "fa-financial-accounting",
    title: "FA - Financial Accounting",
    description:
      "Foundation level financial accounting covering double entry bookkeeping, financial statements, and accounting principles.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    lessons: 24,
    chapters: 8,
    level: "Foundation",
    courseFee: 149,
    feeCurrency: "USD",
  },
  {
    id: 2,
    slug: "ma-management-accounting",
    title: "MA - Management Accounting",
    description:
      "Foundation level management accounting including costing, budgeting, and performance measurement.",
    image:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80",
    lessons: 20,
    chapters: 7,
    level: "Foundation",
    courseFee: 149,
    feeCurrency: "USD",
  },
  {
    id: 3,
    slug: "fr-financial-reporting",
    title: "FR - Financial Reporting",
    description:
      "Skills level financial reporting covering IFRS standards, group accounts, and complex transactions.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
    lessons: 32,
    chapters: 12,
    level: "Skills",
    courseFee: 199,
    feeCurrency: "USD",
  },
  {
    id: 4,
    slug: "sbl-strategic-business-leader",
    title: "Strategic Business Leader",
    description:
      "Professional level strategic leadership with case studies, governance, and professional skills.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    lessons: 28,
    chapters: 10,
    level: "Professional",
    courseFee: 299,
    feeCurrency: "USD",
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-off-white">
      <CourseNavbar />

      <main>
        {/* Header */}
        <div className="bg-black text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block bg-blue-600 text-xs font-bold px-3 py-1 rounded mb-4 uppercase tracking-wide">
              All Courses
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Explore Our ACCA Courses
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Comprehensive ACCA courses designed by experienced professionals
              to help you pass your exams with confidence.
            </p>
          </div>
        </div>

        {/* Course Grid */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {course.feeCurrency} {course.courseFee}
                  </div>
                  {/* Level Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        course.level === "Foundation"
                          ? "bg-green-500 text-white"
                          : course.level === "Skills"
                          ? "bg-blue-500 text-white"
                          : "bg-purple-500 text-white"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="font-bold text-xl mb-2 group-hover:text-gray-600 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      {course.chapters} chapters
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {course.lessons} lessons
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Enrollment CTA */}
        <div className="bg-black text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-gray-400 mb-8">
              Create a free account and contact us via WhatsApp to request
              enrollment in your desired course.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors"
              >
                Create Account
              </Link>
              <a
                href="https://wa.me/94XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Contact via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

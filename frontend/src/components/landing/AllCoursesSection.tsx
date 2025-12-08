import Image from "next/image";
import Link from "next/link";

interface Course {
  id: number;
  name: string;
  title: string;
  image: string;
  shortIntroduction: string;
  courseFee?: number;
  feeCurrency?: string;
  enableManualPayment?: boolean;
}

// Sample all courses data
const allCourses: Course[] = [
  {
    id: 1,
    name: "fa-financial-accounting",
    title: "FA - Financial Accounting",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    shortIntroduction: "Foundation level financial accounting fundamentals",
    courseFee: 149,
    feeCurrency: "USD",
    enableManualPayment: true,
  },
  {
    id: 2,
    name: "ma-management-accounting",
    title: "MA - Management Accounting",
    image:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80",
    shortIntroduction: "Master cost and management accounting principles",
    courseFee: 149,
    feeCurrency: "USD",
    enableManualPayment: true,
  },
  {
    id: 3,
    name: "fr-financial-reporting",
    title: "FR - Financial Reporting",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
    shortIntroduction: "Advanced financial reporting standards and practices",
    courseFee: 199,
    feeCurrency: "USD",
    enableManualPayment: true,
  },
  {
    id: 4,
    name: "aa-audit-assurance",
    title: "AA - Audit and Assurance",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    shortIntroduction: "Comprehensive audit procedures and professional ethics",
    courseFee: 199,
    feeCurrency: "USD",
    enableManualPayment: true,
  },
  {
    id: 5,
    name: "pm-performance-management",
    title: "PM - Performance Management",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    shortIntroduction: "Strategic performance analysis and decision making",
    courseFee: 199,
    feeCurrency: "USD",
    enableManualPayment: true,
  },
  {
    id: 6,
    name: "tx-taxation",
    title: "TX - Taxation",
    image:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80",
    shortIntroduction: "Tax principles, computation and planning strategies",
    courseFee: 199,
    feeCurrency: "USD",
    enableManualPayment: true,
  },
];

export default function AllCoursesSection() {
  if (allCourses.length === 0) return null;

  return (
    <section className="py-32 px-4 bg-white" id="all-courses">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4">
          <h2 className="text-4xl md:text-5xl max-w-xl leading-tight">
            Explore <br /> <span className="font-display">All Courses</span>
          </h2>
          <div className="flex flex-col items-end">
            <p className="text-gray-600 max-w-xs mt-6 md:mt-0 text-right mb-4">
              Browse our complete catalog of ACCA courses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.name}`}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-4 relative">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                />

                {/* Price Badge */}
                {course.enableManualPayment && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm z-10">
                    {course.feeCurrency} {course.courseFee}
                  </div>
                )}

                {/* Enroll Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-black/70 backdrop-blur-sm text-white px-8 py-3 rounded-full font-medium hover:bg-black/90 transition-colors z-10">
                    View Details
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-medium mb-3">{course.title}</h3>
              {/* Course Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <p className="text-gray-600 line-clamp-2">
                  {course.shortIntroduction}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

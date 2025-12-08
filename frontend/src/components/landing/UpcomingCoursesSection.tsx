import Image from "next/image";
import Link from "next/link";

interface Course {
  id: number;
  name: string;
  title: string;
  image: string;
  shortIntroduction: string;
  startDate?: string;
  courseFee?: number;
  feeCurrency?: string;
  enableManualPayment?: boolean;
}

// Sample upcoming courses data
const upcomingCourses: Course[] = [
  {
    id: 1,
    name: "sbl-strategic-business-leader",
    title: "Strategic Business Leader",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    shortIntroduction:
      "Master strategic leadership with comprehensive case studies",
    startDate: "Jan 15, 2025",
    courseFee: 299,
    feeCurrency: "USD",
    enableManualPayment: true,
  },
  {
    id: 2,
    name: "sbr-strategic-business-reporting",
    title: "Strategic Business Reporting",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    shortIntroduction: "Advanced financial reporting and analysis techniques",
    startDate: "Jan 20, 2025",
    courseFee: 299,
    feeCurrency: "USD",
    enableManualPayment: true,
  },
  {
    id: 3,
    name: "afm-advanced-financial-management",
    title: "Advanced Financial Management",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    shortIntroduction: "Deep dive into financial strategy and risk management",
    startDate: "Feb 1, 2025",
    courseFee: 349,
    feeCurrency: "USD",
    enableManualPayment: true,
  },
  {
    id: 4,
    name: "apm-advanced-performance-management",
    title: "Advanced Performance Management",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    shortIntroduction: "Strategic performance analysis and decision making",
    startDate: "Feb 10, 2025",
    courseFee: 349,
    feeCurrency: "USD",
    enableManualPayment: true,
  },
];

export default function UpcomingCoursesSection() {
  if (upcomingCourses.length === 0) return null;

  return (
    <section className="py-32 px-4 bg-off-white" id="upcoming-courses">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4">
          <h2 className="text-4xl md:text-5xl max-w-xl leading-tight">
            Upcoming <br /> <span className="font-display">Courses</span>
          </h2>
          <div className="flex flex-col items-end">
            <p className="text-gray-600 max-w-xs mt-6 md:mt-0 text-right mb-4">
              Fast-track your preparation with our intensive crash courses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {upcomingCourses.map((course) => (
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
                <div className="flex items-center gap-2">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Starts {course.startDate}</span>
                </div>
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

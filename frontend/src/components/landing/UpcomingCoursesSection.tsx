import Image from "next/image";
import Link from "next/link";
import type { CourseListItem } from "@/types";

interface UpcomingCoursesSectionProps {
  courses: CourseListItem[];
}

export default function UpcomingCoursesSection({ courses }: UpcomingCoursesSectionProps) {
  // Filter courses marked as upcoming
  const upcomingCourses = courses.filter(course => course.isUpcoming);

  if (!upcomingCourses || upcomingCourses.length === 0) return null;

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
              href={`/courses/${course.slug}`}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-4 relative">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                    <span className="text-4xl font-display text-gray-400">
                      {course.title.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Price Badge */}
                {!course.isFree && course.price && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm z-10">
                    {course.currency} {course.price}
                  </div>
                )}

                {course.isFree && (
                  <div className="absolute top-4 right-4 bg-green-500/90 text-white backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm z-10">
                    Free
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>{course.lessonsCount} lessons</span>
                </div>
                <p className="text-gray-600 line-clamp-2">
                  {course.description || "Professional course content"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

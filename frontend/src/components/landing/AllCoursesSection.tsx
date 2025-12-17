import Image from "next/image";
import Link from "next/link";
import type { CourseListItem } from "@/types";

interface AllCoursesSectionProps {
  courses: CourseListItem[];
}

export default function AllCoursesSection({ courses }: AllCoursesSectionProps) {
  if (!courses || courses.length === 0) return null;

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
          {courses.map((course) => (
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
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
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
                <p className="text-gray-600 line-clamp-2">
                  {course.description || "Professional ACCA course content"}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{course.chaptersCount} chapters</span>
                  <span>{course.lessonsCount} lessons</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

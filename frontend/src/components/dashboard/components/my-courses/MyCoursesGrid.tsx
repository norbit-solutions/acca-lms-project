/**
 * My Courses Grid Component
 * Displays enrolled courses in a card layout with large images
 */

import Link from "next/link";
import type { EnrolledCourse } from "@/types";
import { BookIcon } from "@/lib";

interface MyCoursesGridProps {
    courses: EnrolledCourse[];
}

export function MyCoursesGrid({ courses }: MyCoursesGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}

interface CourseCardProps {
    course: EnrolledCourse;
}

function CourseCard({ course }: CourseCardProps) {
    return (
        <Link
            href={`/dashboard/courses/${course.slug}`}
            className="group block bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
        >
            {/* Large Course Image */}
            <div className="aspect-video bg-gray-100 overflow-hidden">
                {course.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <BookIcon className="w-12 h-12" />
                    </div>
                )}
            </div>

            {/* Course Info */}
            <div className="p-5">
                <h3 className="text-lg font-semibold text-[#333c8a] mb-2 group-hover:text-black transition-colors">
                    {course.title}
                </h3>

                <p className="text-sm text-black mb-4 line-clamp-2">
                    {course.description || "Continue your learning journey with this course."}
                </p>

                {/* Progress and Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-black">
                            {course.completedLessons}/{course.lessonsCount} lessons
                        </span>
                    </div>
                    <span className="text-lg font-semibold text-[#333c8a]">
                        {Math.round(course.progress)}%
                    </span>
                </div>
            </div>
        </Link>
    );
}

import Link from "next/link";
import type { EnrolledCourse } from "@/types";
import { BookIcon } from "@/lib";

interface CoursesListProps {
    courses: EnrolledCourse[];
    maxItems?: number;
}

export function CoursesList({ courses, maxItems = 4 }: CoursesListProps) {
    if (courses.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-6">
                Your courses
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
                {courses.slice(0, maxItems).map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
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
            className="group flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-black transition-colors"
        >
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                {course.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                    <BookIcon />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-black truncate group-hover:underline">{course.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                        />
                    </div>
                    <span className="text-xs text-gray-500">{course.progress}%</span>
                </div>
            </div>
        </Link>
    );
}

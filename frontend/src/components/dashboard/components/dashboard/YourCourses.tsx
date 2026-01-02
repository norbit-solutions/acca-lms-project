import Link from "next/link";
import type { EnrolledCourse } from "@/types";
import { BookIcon } from "@/lib";

interface YourCoursesProps {
  courses: EnrolledCourse[];
  maxDisplay?: number;
}

export default function YourCourses({ courses, maxDisplay = 4 }: YourCoursesProps) {
  if (courses.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-neutral-100">
      <h2 className="text-sm font-normal text-neutral-500 uppercase tracking-wide mb-6">
        Your courses
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.slice(0, maxDisplay).map((course) => (
          <Link
            key={course.id}
            href={`/dashboard/courses/${course.slug}`}
            className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
              {course.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <BookIcon />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-normal text-neutral-700 truncate">{course.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-400 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-400">{course.progress}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

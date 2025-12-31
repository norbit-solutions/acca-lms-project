import Link from "next/link";
import { studentService } from "@/services";
import type { EnrolledCourse, RecentLesson } from "@/types";

// Minimal icons with thin strokes
const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
  </svg>
);

// Format date helper
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  // Fetch data server-side
  let courses: EnrolledCourse[] = [];
  let recentLessons: RecentLesson[] = [];

  try {
    [courses, recentLessons] = await Promise.all([
      studentService.getMyCourses().catch(() => []),
      studentService.getRecentLessons().catch(() => []),
    ]);
  } catch (err) {
    console.log("Failed to fetch dashboard data:", err);
  }

  const totalLessons = courses.reduce((acc, c) => acc + c.lessonsCount, 0);
  const completedLessons = courses.reduce((acc, c) => acc + c.completedLessons, 0);
  const avgProgress = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-normal text-neutral-800 mb-1">
          Welcome back
        </h1>
        <p className="text-neutral-400 text-sm font-light">
          Continue where you left off
        </p>
      </div>

      {/* Stats - Minimal inline */}
      <div className="flex flex-wrap gap-8 mb-12 pb-8 border-b border-neutral-100">
        <div>
          <p className="text-3xl font-light text-neutral-800">
            {courses.length}
          </p>
          <p className="text-xs text-neutral-400 mt-1">Courses</p>
        </div>
        <div>
          <p className="text-3xl font-light text-neutral-800">
            {completedLessons}/{totalLessons}
          </p>
          <p className="text-xs text-neutral-400 mt-1">Lessons completed</p>
        </div>
        <div>
          <p className="text-3xl font-light text-neutral-800">
            {avgProgress}%
          </p>
          <p className="text-xs text-neutral-400 mt-1">Average progress</p>
        </div>
      </div>

      {/* Recently Watched */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-normal text-neutral-500 uppercase tracking-wide">
            Recently watched
          </h2>
          <Link
            href="/dashboard/my-courses"
            className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors flex items-center gap-1"
          >
            All courses
            <ArrowIcon />
          </Link>
        </div>

        {recentLessons.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookIcon />
            </div>
            <p className="text-neutral-400 text-sm mb-4">No lessons watched yet</p>
            <Link
              href="/dashboard/my-courses"
              className="text-sm text-neutral-600 hover:text-neutral-800 underline underline-offset-4"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {recentLessons.map((lesson) => (
              <Link
                key={`${lesson.lessonId}-${lesson.lastViewedAt}`}
                href={`/dashboard/courses/${lesson.courseSlug}`}
                className="group flex items-center gap-4 py-3 px-3 -mx-3 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-20 h-14 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {lesson.courseThumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={lesson.courseThumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <BookIcon />
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      <PlayIcon />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-normal text-neutral-700 truncate group-hover:text-neutral-900 transition-colors">
                    {lesson.lessonTitle}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5 truncate">
                    {lesson.courseTitle} · {lesson.chapterTitle}
                  </p>
                </div>

                {/* Time */}
                <span className="text-xs text-neutral-300 flex-shrink-0">
                  {formatDate(lesson.lastViewedAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access - Courses */}
      {courses.length > 0 && (
        <div className="mt-12 pt-8 border-t border-neutral-100">
          <h2 className="text-sm font-normal text-neutral-500 uppercase tracking-wide mb-6">
            Your courses
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.slice(0, 4).map((course) => (
              <Link
                key={course.id}
                href={`/dashboard/courses/${course.slug}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
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
      )}
    </div>
  );
}

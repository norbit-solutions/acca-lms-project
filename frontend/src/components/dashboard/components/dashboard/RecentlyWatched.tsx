import Link from "next/link";
import type { RecentLesson } from "@/types";
import { ArrowIcon, BookIcon, PlayIcon } from "@/lib";

interface RecentlyWatchedProps {
  recentLessons: RecentLesson[];
}

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

export default function RecentlyWatched({ recentLessons }: RecentlyWatchedProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-normal text-[#333c8a] uppercase tracking-wide">
          Recently watched
        </h2>
        <Link
          href="/dashboard/my-courses"
          className="text-sm text-black hover:text-neutral-600 transition-colors flex items-center gap-1"
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
          <p className="text-black text-sm mb-4">No lessons watched yet</p>
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
              <div className="w-20 h-14 bg-neutral-100 rounded-lg overflow-hidden shrink-0 relative">
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
                <h3 className="text-sm font-normal text-[#333c8a] truncate group-hover:text-neutral-900 transition-colors">
                  {lesson.lessonTitle}
                </h3>
                <p className="text-xs text-black mt-0.5 truncate">
                  {lesson.courseTitle} · {lesson.chapterTitle}
                </p>
              </div>

              {/* Time */}
              <span className="text-xs text-black/80 shrink-0">
                {formatDate(lesson.lastViewedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

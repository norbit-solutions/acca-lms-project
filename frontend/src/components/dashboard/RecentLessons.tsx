import Link from "next/link";
import type { RecentLesson } from "@/types";
import { BookIcon, PlayIcon, ArrowIcon, formatDate } from "@/lib";

interface RecentLessonsProps {
    lessons: RecentLesson[];
}

export function RecentLessons({ lessons }: RecentLessonsProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Recently watched
                </h2>
                <Link
                    href="/dashboard/my-courses"
                    className="text-sm text-gray-400 hover:text-black transition-colors flex items-center gap-1"
                >
                    All courses
                    <ArrowIcon />
                </Link>
            </div>

            {lessons.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="space-y-1">
                    {lessons.map((lesson) => (
                        <LessonItem key={`${lesson.lessonId}-${lesson.lastViewedAt}`} lesson={lesson} />
                    ))}
                </div>
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookIcon />
            </div>
            <p className="text-gray-500 text-sm mb-4">No lessons watched yet</p>
            <Link
                href="/dashboard/my-courses"
                className="text-sm text-black hover:underline"
            >
                Browse courses
            </Link>
        </div>
    );
}

interface LessonItemProps {
    lesson: RecentLesson;
}

function LessonItem({ lesson }: LessonItemProps) {
    return (
        <Link
            href={`/dashboard/courses/${lesson.courseSlug}`}
            className="group flex items-center gap-4 py-3 px-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
            {/* Thumbnail */}
            <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                {lesson.courseThumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={lesson.courseThumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <BookIcon />
                    </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <PlayIcon />
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-black truncate group-hover:underline">
                    {lesson.lessonTitle}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {lesson.courseTitle} · {lesson.chapterTitle}
                </p>
            </div>

            {/* Time */}
            <span className="text-xs text-gray-400 shrink-0">
                {formatDate(lesson.lastViewedAt)}
            </span>
        </Link>
    );
}

import Link from "next/link";
import {
  PlayCircleIcon,
  LockIcon,
  CheckCircleIcon,
  formatDuration,
} from "@/lib";

interface LessonItemProps {
  lesson: {
    id: number;
    title: string;
    duration: number | null;
    isCompleted: boolean;
    canWatch: boolean;
    viewCount: number;
    maxViews: number;
  };
  lessonIndex: number;
  courseSlug: string;
}

export default function LessonItem({ lesson, lessonIndex, courseSlug }: LessonItemProps) {
  const formatLessonDuration = (seconds: number | null) => {
    if (!seconds) return "--:--";
    return formatDuration(seconds);
  };

  const isLimitReached = !lesson.canWatch;

  return (
    <div className="border-b border-gray-100 last:border-0">
      <Link
        href={`/dashboard/courses/${courseSlug}/lessons/${lesson.id}`}
        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors group ${
          isLimitReached ? 'opacity-60' : ''
        }`}
      >
        {/* Status Icon */}
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
          lesson.isCompleted
            ? 'bg-black text-white'
            : isLimitReached
              ? 'bg-gray-200'
              : 'border-2 border-gray-300 group-hover:border-black'
        }`}>
          {lesson.isCompleted ? (
            <CheckCircleIcon className="w-3.5 h-3.5" />
          ) : isLimitReached ? (
            <LockIcon className="w-3 h-3 text-gray-400" />
          ) : (
            <PlayCircleIcon className="w-3 h-3 text-gray-400 group-hover:text-black" />
          )}
        </div>

        {/* Lesson Info */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm truncate ${
            isLimitReached ? 'text-gray-500' : 'text-black group-hover:underline'
          }`}>
            {lessonIndex + 1}. {lesson.title}
          </p>
        </div>

        {/* Duration & Views */}
        <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
          <span>{formatLessonDuration(lesson.duration)}</span>
          <span className={`px-1.5 py-0.5 rounded ${
            isLimitReached 
              ? 'bg-red-100 text-red-600' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {lesson.viewCount}/{lesson.maxViews}
          </span>
        </div>
      </Link>
    </div>
  );
}


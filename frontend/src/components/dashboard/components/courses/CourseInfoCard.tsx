import { formatDuration } from "@/lib";

interface CourseInfoCardProps {
  title: string;
  description?: string;
  thumbnail?: string;
  chaptersCount: number;
  lessonsCount: number;
  totalDuration: number;
  completedLessons: number;
  progressPercentage: number;
}

export default function CourseInfoCard({
  title,
  description,
  thumbnail,
  chaptersCount,
  lessonsCount,
  totalDuration,
  completedLessons,
  progressPercentage,
}: CourseInfoCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        {/* Small Thumbnail */}
        {thumbnail && (
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-black mb-1 truncate">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {description}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {chaptersCount} chapters
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lessonsCount} lessons
            </span>
            {totalDuration > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDuration(totalDuration)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 pt-5 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-black">
            {completedLessons} of {lessonsCount} complete
          </span>
          <span className="text-sm font-bold text-black">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

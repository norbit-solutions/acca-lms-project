"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "@/lib";

interface LessonTopBarProps {
  courseSlug: string;
  courseTitle: string;
  viewCount: number;
  maxViews: number;
  hasVideo: boolean;
}

export default function LessonTopBar({
  courseSlug,
  courseTitle,
  viewCount,
  maxViews,
  hasVideo,
}: LessonTopBarProps) {
  const router = useRouter();
  const viewsPercentage = (viewCount / maxViews) * 100;

  return (
    <div className="flex items-center justify-between mb-5">
      <button
        onClick={() => router.push(`/dashboard/courses/${courseSlug}`)}
        className="group flex items-center gap-2 text-gray-500 hover:text-black text-sm transition-all"
      >
        <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
          <BackIcon className="w-4 h-4" />
        </span>
        <span className="font-medium hidden md:block">{courseTitle}</span>
      </button>

      {/* Progress Indicator */}
      {hasVideo && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <span>{viewCount} of {maxViews} views used</span>
          </div>
          <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                viewsPercentage >= 100 ? 'bg-red-500' :
                viewsPercentage >= 80 ? 'bg-amber-500' : 'bg-black'
              }`}
              style={{ width: `${Math.min(viewsPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

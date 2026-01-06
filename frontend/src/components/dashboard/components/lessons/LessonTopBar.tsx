"use client";

import Link from "next/link";
import { BackIcon } from "@/lib";

interface LessonTopBarProps {
  courseSlug: string;
  lessonTitle: string;
  viewCount: number;
  maxViews: number;
  hasVideo: boolean;
}

export default function LessonTopBar({
  courseSlug,
  lessonTitle,
  viewCount,
  maxViews,
  hasVideo,
}: LessonTopBarProps) {
  const viewsPercentage = (viewCount / maxViews) * 100;
  const viewsRemaining = maxViews - viewCount;

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Back Button + Lesson Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={`/dashboard/courses/${courseSlug}`}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
                  >
                    <BackIcon className="w-5 h-5 text-slate-600" />
                  </Link>
        <h1 className="text-base md:text-xl font-semibold text-black truncate">
          {lessonTitle}
        </h1>
      </div>

      {/* Views Indicator */}
      {hasVideo && (
        <div className="flex items-center gap-2 shrink-0">
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            viewsRemaining === 0 ? 'bg-red-100 text-red-700' :
            viewsRemaining === 1 ? 'bg-amber-100 text-amber-700' : 
            'bg-gray-100 text-gray-600'
          }`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{viewsRemaining} views left</span>
          </div>
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden sm:hidden">
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

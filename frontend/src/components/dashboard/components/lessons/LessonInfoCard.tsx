"use client";

import { useState } from "react";
import { formatDuration } from "@/lib";

interface LessonInfoCardProps {
  title: string;
  description?: string | null;
  chapterTitle: string;
  duration?: number | null;
  viewCount: number;
  maxViews: number;
  hasVideo: boolean;
}

export default function LessonInfoCard({
  title,
  description,
  chapterTitle,
  duration,
  viewCount,
  maxViews,
  hasVideo,
}: LessonInfoCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const viewsRemaining = maxViews - viewCount;
  const hasLongDescription = description && description.length > 150;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Chapter Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 mb-3">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            {chapterTitle}
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-black mb-3 leading-tight">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <div className="relative">
              <p className={`text-sm text-gray-600 leading-relaxed ${
                !showFullDescription && hasLongDescription ? 'line-clamp-3' : ''
              }`}>
                {description}
              </p>
              {hasLongDescription && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-sm font-medium text-black hover:underline mt-1"
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {hasVideo && (
        <div className="flex items-center gap-5 mt-5 pt-5 border-t border-gray-100">
          {duration && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-black">{formatDuration(duration)}</p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
              viewsRemaining === 0 ? 'bg-red-100' :
              viewsRemaining === 1 ? 'bg-amber-100' : 'bg-gray-100'
            }`}>
              <svg className={`w-4 h-4 ${
                viewsRemaining === 0 ? 'text-red-600' :
                viewsRemaining === 1 ? 'text-amber-600' : 'text-gray-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">{viewsRemaining} remaining</p>
              <p className="text-xs text-gray-500">{viewCount}/{maxViews} used</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

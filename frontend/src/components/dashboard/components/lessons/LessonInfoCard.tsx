"use client";

import { useState } from "react";
import { formatDuration } from "@/lib";

interface LessonInfoCardProps {
  description?: string | null;
  chapterTitle: string;
  duration?: number | null;
  viewCount: number;
  maxViews: number;
  hasVideo: boolean;
}

export default function LessonInfoCard({
  description,
  chapterTitle,
  duration,
  viewCount,
  maxViews,
  hasVideo,
}: LessonInfoCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const viewsRemaining = maxViews - viewCount;
  const hasLongDescription = description && description.length > 200;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden w-full">
      {/* Header with Chapter */}
      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-black">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium">{chapterTitle}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Description */}
        {description ? (
          <div className="mb-5">
            <h3 className="text-sm font-medium text-[#333c8a] uppercase tracking-wide mb-2">
              About this lesson
            </h3>
            <p className={`text-sm text-black leading-relaxed ${
              !showFullDescription && hasLongDescription ? 'line-clamp-3' : ''
            }`}>
              {description}
            </p>
            {hasLongDescription && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-sm font-medium text-[#333c8a] hover:underline mt-2"
              >
                {showFullDescription ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic mb-5">No description available</p>
        )}

        {/* Stats Grid */}
        {hasVideo && (
          <div className="grid grid-cols-2 gap-3">
            {/* Duration */}
            {duration && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#333c8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#333c8a]">{formatDuration(duration)}</p>
                    <p className="text-xs text-black">Duration</p>
                  </div>
                </div>
              </div>
            )}

            {/* Views */}
            <div className={`rounded-xl p-4 ${
              viewsRemaining === 0 ? 'bg-red-50' :
              viewsRemaining === 1 ? 'bg-amber-50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  viewsRemaining === 0 ? 'bg-red-100' :
                  viewsRemaining === 1 ? 'bg-amber-100' : 'bg-black/5'
                }`}>
                  <svg className={`w-5 h-5 ${
                    viewsRemaining === 0 ? 'text-red-600' :
                    viewsRemaining === 1 ? 'text-amber-600' : 'text-[#333c8a]'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-lg font-semibold ${
                    viewsRemaining === 0 ? 'text-red-700' :
                    viewsRemaining === 1 ? 'text-amber-700' : 'text-[#333c8a]'
                  }`}>
                    {viewsRemaining} left
                  </p>
                  <p className="text-xs text-black">{viewCount}/{maxViews} views</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import VideoPlayer from "@/components/dashboard/VideoPlayer";
import Image from "next/image";

interface LessonVideoSectionProps {
  playbackId: string;
  playbackToken: string | null;
  watermarkPhone: string;
  title: string;
  canWatch: boolean;
  viewCount: number;
  maxViews: number;
  onViewStart: (watchPercentage: number) => Promise<void>;
}

export default function LessonVideoSection({
  playbackId,
  playbackToken,
  watermarkPhone,
  title,
  canWatch,
  viewCount,
  maxViews,
  onViewStart,
}: LessonVideoSectionProps) {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Generate Mux thumbnail URL for background
  const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1280&height=720&fit_mode=smartcrop&time=0`;

  return (
    <div className="relative mb-6">
      <div className="bg-black rounded-2xl overflow-hidden shadow-xl aspect-video w-full xl:w-[700px] relative">
        {canWatch ? (
          <>
            {/* Loading Skeleton - shows until player is ready */}
            {!isPlayerReady && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-white/70 text-sm">Loading video...</span>
                </div>
              </div>
            )}

            {/* Video Player */}
            <div className={`w-full h-full transition-opacity duration-300 ${isPlayerReady ? 'opacity-100' : 'opacity-0'}`}>
              <VideoPlayer
                playbackId={playbackId}
                playbackToken={playbackToken}
                watermarkPhone={watermarkPhone}
                title={title}
                onViewStart={onViewStart}
                onReady={() => setIsPlayerReady(true)}
              />
            </div>
          </>
        ) : (
          <>
            {/* Thumbnail Background */}
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover opacity-40"
              priority
            />

            {/* View Limit Reached Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              {/* Lock Icon */}
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  />
                </svg>
              </div>

              {/* Message */}
              <h3 className="text-white text-xl font-semibold mb-2">
                View Limit Reached
              </h3>
              <p className="text-gray-300 text-sm text-center max-w-md px-4">
                You have used all {maxViews} views for this lesson ({viewCount}/{maxViews}).
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Contact support if you need additional access.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

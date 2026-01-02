"use client";

import { AdminUser } from "@/types";
import { EyeIcon, PlayCircleIcon, ChevronRightIcon } from "@/lib/icons";
import { useState } from "react";
import ViewLimitModal from "./ViewLimitModal";

interface UserVideoViewsProps {
  user: AdminUser;
  onSetViewLimit: (lessonId: number, limit: number) => Promise<void>;
  onRemoveViewLimit: (lessonId: number) => Promise<void>;
}

interface VideoView {
  id: number;
  lessonId: number;
  lessonTitle?: string;
  courseTitle?: string;
  viewCount: number;
  customViewLimit?: number;
}

export default function UserVideoViews({
  user,
  onSetViewLimit,
  onRemoveViewLimit,
}: UserVideoViewsProps) {
  const [selectedView, setSelectedView] = useState<VideoView | null>(null);

  // Backend already returns flattened structure, just map to local VideoView type
  const videoViews: VideoView[] = (user?.videoViews || []).map((v) => ({
    id: v.id,
    lessonId: v.lessonId,
    lessonTitle: v.lessonTitle,
    courseTitle: v.courseTitle,
    viewCount: v.viewCount,
    customViewLimit: v.customViewLimit ?? undefined,
  }));
  const totalViews = videoViews.reduce((sum, v) => sum + v.viewCount, 0);

  const getUsageColor = (viewCount: number, limit?: number) => {
    if (!limit) return "bg-slate-300";
    const percentage = (viewCount / limit) * 100;
    if (percentage >= 90) return "bg-slate-900";
    if (percentage >= 70) return "bg-slate-600";
    return "bg-slate-400";
  };

  const getUsageWidth = (viewCount: number, limit?: number) => {
    if (!limit) return 30; // Default width when no limit
    return Math.min((viewCount / limit) * 100, 100);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-fit">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <PlayCircleIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Video Views
                </h2>
                <p className="text-sm text-slate-500">
                  {videoViews.length} lessons • {totalViews} total views
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {videoViews.length > 0 ? (
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {videoViews.map((view) => (
              <div
                key={view.id}
                className="px-6 py-4 hover:bg-slate-50 cursor-pointer transition-all group"
                onClick={() => setSelectedView(view)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate mb-1">
                      {view.lessonTitle || "Unknown Lesson"}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {view.courseTitle || "Unknown Course"}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Stats */}
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <EyeIcon className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-900">
                          {view.viewCount}
                        </span>
                        {view.customViewLimit && (
                          <span className="text-slate-400">
                            / {view.customViewLimit}
                          </span>
                        )}
                      </div>
                      {view.customViewLimit ? (
                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                          Custom limit
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Default limit
                        </span>
                      )}
                    </div>
                    
                    {/* Progress & Arrow */}
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getUsageColor(view.viewCount, view.customViewLimit)}`}
                          style={{ width: `${getUsageWidth(view.viewCount, view.customViewLimit)}%` }}
                        />
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <PlayCircleIcon className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No video views recorded</p>
            <p className="text-sm text-slate-400 mt-1">
              This user hasn&apos;t watched any videos yet
            </p>
          </div>
        )}
      </div>

      {/* View Limit Modal */}
      <ViewLimitModal
        isOpen={!!selectedView}
        onClose={() => setSelectedView(null)}
        lessonTitle={selectedView?.lessonTitle || "Unknown Lesson"}
        currentLimit={selectedView?.customViewLimit || null}
        currentViews={selectedView?.viewCount || 0}
        onSave={(limit) => onSetViewLimit(selectedView!.lessonId, limit)}
        onRemove={() => onRemoveViewLimit(selectedView!.lessonId)}
      />
    </>
  );
}

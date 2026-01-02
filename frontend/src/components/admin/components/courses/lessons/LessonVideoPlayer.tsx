"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useVideoUpload } from "@/hooks";
import { UploadIcon, CheckIcon, WarningIcon } from "@/lib/icons";

interface LessonVideoPlayerProps {
  lessonId: number;
  playbackId: string | null;
  playbackToken: string | null;
  muxStatus: "pending" | "ready" | "error" | null;
  muxUploadId: string | null;
}

export default function LessonVideoPlayer({
  lessonId,
  playbackId,
  playbackToken,
  muxStatus,
  muxUploadId,
}: LessonVideoPlayerProps) {
  // Use shared video upload hook
  const { isUploading, uploadProgress, isSyncing, handleUploadVideo, handleSyncMux } =
    useVideoUpload({ lessonId });

  const isProcessing = muxStatus === "pending" && muxUploadId;
  const isReady = playbackId && muxStatus === "ready";
  const isError = muxStatus === "error";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      {isReady ? (
        <div className="aspect-video bg-black">
          <MuxPlayer
            playbackId={playbackId}
            tokens={{ playback: playbackToken || undefined }}
            streamType="on-demand"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : (
        <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center text-center p-8">
          {isProcessing ? (
            <>
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                <WarningIcon className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Video Processing
              </h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">
                Your video is being processed by Mux. This usually takes 1-2
                minutes.
              </p>
              <button
                onClick={handleSyncMux}
                disabled={isSyncing}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                {isSyncing ? "Checking..." : "Check Status"}
              </button>
            </>
          ) : isError ? (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <WarningIcon className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Processing Failed
              </h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">
                There was an error processing your video. Please try uploading
                again.
              </p>
              <button
                onClick={handleUploadVideo}
                disabled={isUploading}
                className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium hover:bg-violet-600 transition-colors disabled:opacity-50"
              >
                <UploadIcon className="w-4 h-4 inline-block mr-2" />
                Upload New Video
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <UploadIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                No Video Yet
              </h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">
                Upload a video file to add content to this lesson.
              </p>
              {uploadProgress !== null ? (
                <div className="w-48 mb-4">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-slate-400 text-xs mt-2">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleUploadVideo}
                  disabled={isUploading}
                  className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium hover:bg-violet-600 transition-colors disabled:opacity-50"
                >
                  <UploadIcon className="w-4 h-4 inline-block mr-2" />
                  Upload Video
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Video Controls Bar */}
      {isReady && (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600 text-sm">
            <CheckIcon className="w-4 h-4" />
            <span>Video ready</span>
          </div>
          <button
            onClick={handleUploadVideo}
            disabled={isUploading}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <UploadIcon className="w-3.5 h-3.5 inline-block mr-1.5" />
            Replace Video
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/services";
import { showError, showSuccess } from "@/lib/toast";

interface UseVideoUploadOptions {
  lessonId: number;
  onProcessingChange?: (lessonId: number, isProcessing: boolean) => void;
}

interface UseVideoUploadReturn {
  isUploading: boolean;
  uploadProgress: number | null;
  isSyncing: boolean;
  handleUploadVideo: () => void;
  handleSyncMux: () => Promise<void>;
}

/**
 * Custom hook for video upload and Mux sync operations.
 * Shared between LessonItem and LessonVideoPlayer components.
 */
export function useVideoUpload({
  lessonId,
  onProcessingChange,
}: UseVideoUploadOptions): UseVideoUploadReturn {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleUploadVideo = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const data = await adminService.getLessonUploadUrl(lessonId);

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setUploadProgress(Math.round((event.loaded / event.total) * 100));
            }
          };
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error("Upload failed"));
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.open("PUT", data.uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });

        // Mark as processing if callback provided
        onProcessingChange?.(lessonId, true);
        showSuccess("Video uploaded! Processing in background...");
        router.refresh();
      } catch (error) {
        console.log("Failed to upload video:", error);
        showError("Failed to upload video. Please try again.");
      } finally {
        setIsUploading(false);
        setUploadProgress(null);
      }
    };
    input.click();
  };

  const handleSyncMux = async () => {
    setIsSyncing(true);
    try {
      const result = await adminService.syncLessonMux(lessonId);
      if (result.status === "ready") {
        showSuccess(result.message);
        onProcessingChange?.(lessonId, false);
        router.refresh();
      } else if (result.status === "error") {
        showError(result.message);
        router.refresh();
      } else {
        showSuccess(result.message);
      }
    } catch (error) {
      console.log("Failed to sync:", error);
      showError("Failed to sync with Mux");
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isUploading,
    uploadProgress,
    isSyncing,
    handleUploadVideo,
    handleSyncMux,
  };
}

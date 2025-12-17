"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminChapter, AdminCourseDetail, AdminLesson } from "@/types";
import { adminService } from "@/services";
import { useModal } from "./ModalProvider";
import MuxPlayer from "@mux/mux-player-react";



// Icons
const BackIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const PlayIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const UploadIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

export default function CourseDetailClient({ initialCourse }: { initialCourse: AdminCourseDetail }) {
  const router = useRouter();
  const { showError, showSuccess, showConfirm } = useModal();

  // Local course state for live updates
  const [course, setCourse] = useState<AdminCourseDetail>(initialCourse);

  // Track lessons that are currently processing (after upload)
  const [processingLessons, setProcessingLessons] = useState<Set<number>>(new Set());

  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    new Set(initialCourse.chapters.map((c) => c.id))
  );
  const [uploading, setUploading] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ lessonId: number; progress: number } | null>(null);

  // Modal states
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoPlaybackId, setVideoPlaybackId] = useState<string | null>(null);
  const [videoPlaybackToken, setVideoPlaybackToken] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [editingChapter, setEditingChapter] = useState<AdminChapter | null>(null);
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );

  const [chapterForm, setChapterForm] = useState({ title: "" });
  const [lessonForm, setLessonForm] = useState({
    title: "",
    isFree: false,
    maxViews: 2,
    description: "",
    attachments: [] as Array<{ url: string; name: string; type: string }>,
  });
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  // Sync with initialCourse when it changes (e.g., after router.refresh())
  useEffect(() => {
    setCourse(initialCourse);
  }, [initialCourse]);

  // Subscribe to SSE for real-time lesson updates
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
    const eventSource = new EventSource(`${apiUrl}/sse/course/${course.id}`);

    eventSource.onopen = () => {
      console.log('[SSE] Connected to course updates');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[SSE] Received:', data);

        if (data.type === 'lesson:updated') {
          // Update the lesson in local state
          setCourse((prev) => {
            const updated = { ...prev };
            updated.chapters = prev.chapters.map((chapter) => ({
              ...chapter,
              lessons: chapter.lessons.map((lesson) =>
                lesson.id === data.lessonId
                  ? {
                    ...lesson,
                    muxStatus: data.data.muxStatus,
                    muxPlaybackId: data.data.playbackId,
                    duration: data.data.duration,
                  }
                  : lesson
              ),
            }));
            return updated;
          });

          // Remove from processing set and show success
          setProcessingLessons((prev) => {
            const newSet = new Set(prev);
            newSet.delete(data.lessonId);
            return newSet;
          });

          // Find lesson title for notification
          const lesson = course.chapters
            .flatMap((c) => c.lessons)
            .find((l) => l.id === data.lessonId);
          if (lesson && data.data.playbackId) {
            showSuccess(`Video "${lesson.title}" is now ready!`);
          }
        }
      } catch (error) {
        console.error('[SSE] Failed to parse message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('[SSE] Error:', error);
      // EventSource will auto-reconnect
    };

    return () => {
      console.log('[SSE] Disconnecting');
      eventSource.close();
    };
  }, [course.id, showSuccess]);





  const toggleChapter = (id: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedChapters(newExpanded);
  };

  // Chapter handlers
  const openNewChapterModal = () => {
    setEditingChapter(null);
    setChapterForm({ title: "" });
    setShowChapterModal(true);
  };

  const openEditChapterModal = (chapter: AdminChapter) => {
    setEditingChapter(chapter);
    setChapterForm({ title: chapter.title });
    setShowChapterModal(true);
  };

  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChapter) {
        await adminService.updateChapter(editingChapter.id, chapterForm);
      } else {
        await adminService.createChapter(course.id, chapterForm);
      }
      setShowChapterModal(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to save chapter:", error);
      showError("Failed to save chapter");
    }
  };

  const handleDeleteChapter = async (chapter: AdminChapter) => {
    const confirmed = await showConfirm({
      title: "Delete Chapter",
      message: `Delete "${chapter.title}" and all its lessons?`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await adminService.deleteChapter(chapter.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete chapter:", error);
      showError("Failed to delete chapter");
    }
  };

  // Lesson handlers
  const openNewLessonModal = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    setEditingLesson(null);
    setLessonForm({ title: "", isFree: false, maxViews: 2, description: "", attachments: [] });
    setShowLessonModal(true);
  };

  const openEditLessonModal = (lesson: AdminLesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      isFree: lesson.isFree,
      maxViews: lesson.maxViews ?? 2,
      description: lesson.description || "",
      attachments: lesson.attachments || [],
    });
    setShowLessonModal(true);
  };

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAttachment(true);
    try {
      // Upload file using admin service (PDF endpoint works for docs too)
      const result = await adminService.uploadPdf(file);

      // Add to attachments
      const newAttachment = {
        url: result.url,
        name: file.name,
        type: file.type,
      };
      setLessonForm({
        ...lessonForm,
        attachments: [...lessonForm.attachments, newAttachment],
      });
    } catch (error) {
      console.error("Failed to upload attachment:", error);
      showError("Failed to upload file");
    } finally {
      setUploadingAttachment(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setLessonForm({
      ...lessonForm,
      attachments: lessonForm.attachments.filter((_, i) => i !== index),
    });
  };

  const handlePlayVideo = async (lesson: AdminLesson) => {
    if (!lesson.muxPlaybackId) return;

    try {
      const { playbackId, playbackToken } = await adminService.getLessonSignedUrls(lesson.id);
      setVideoPlaybackId(playbackId);
      setVideoPlaybackToken(playbackToken);
      setVideoTitle(lesson.title);
      setShowVideoPlayer(true);
    } catch (error) {
      console.error("Failed to get playback URL:", error);
      showError("Failed to load video");
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await adminService.updateLesson(editingLesson.id, lessonForm);
      } else if (selectedChapterId) {
        await adminService.createLesson(selectedChapterId, {
          ...lessonForm,
          type: 'video',
        });
      }
      setShowLessonModal(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to save lesson:", error);
      showError("Failed to save lesson");
    }
  };

  const handleDeleteLesson = async (lesson: AdminLesson) => {
    const confirmed = await showConfirm({
      title: "Delete Lesson",
      message: `Delete "${lesson.title}"?`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await adminService.deleteLesson(lesson.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      showError("Failed to delete lesson");
    }
  };

  const handleUploadVideo = async (lessonId: number, file: File) => {
    setUploading(lessonId);
    setUploadProgress({ lessonId, progress: 0 });

    try {
      // Get upload URL from backend (this stores the upload ID in the database)
      const data = await adminService.getLessonUploadUrl(lessonId);
      const uploadUrl = data.uploadUrl;

      // Upload to Mux with progress tracking using XMLHttpRequest
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress({ lessonId, progress });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      setProcessingLessons(prev => new Set(prev).add(lessonId));

      setCourse((prev) => ({
        ...prev,
        chapters: prev.chapters.map((chapter) => ({
          ...chapter,
          lessons: chapter.lessons.map((lesson) =>
            lesson.id === lessonId
              ? {
                ...lesson,
                muxStatus: 'pending' as const,
                muxUploadId: data.uploadId, // Mark that upload has started
                muxPlaybackId: null, // Ensure no broken image
                duration: null,
              }
              : lesson
          ),
        })),
      }));

      showSuccess("Video uploaded! Processing in background...");
    } catch (error) {
      console.error("Failed to upload video:", error);
      showError("Failed to upload video. Please try again.");
    } finally {
      setUploading(null);
      setUploadProgress(null);
    }
  };

  const handleFileSelect = (lessonId: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleUploadVideo(lessonId, file);
      }
    };
    input.click();
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <button
            onClick={() => router.push("/admin/courses")}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <BackIcon />
            </div>
            <span className="font-medium">Back to Courses</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            {course.title}
          </h1>
          <p className="text-slate-500 mt-1">
            {course.description || "No description provided"}
          </p>
        </div>
        <span
          className={`inline-flex items-center self-start px-3 py-1 rounded-full text-sm font-medium ${course.isPublished
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-600"
            }`}
        >
          {course.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      {/* Course Content */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-slate-900">
              Course Content
            </h2>
            <p className="text-sm text-slate-500">
              {course.chapters.length} chapters,{" "}
              {course.chapters.reduce((acc, c) => acc + c.lessons.length, 0)}{" "}
              lessons
            </p>
          </div>
          <button
            onClick={openNewChapterModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 transition-all"
          >
            <PlusIcon />
            Add Chapter
          </button>
        </div>

        {course.chapters.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {course.chapters
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((chapter, chapterIndex) => (
                <div key={chapter.id}>
                  {/* Chapter Header */}
                  <div
                    className="px-6 py-4 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-colors"
                    onClick={() => toggleChapter(chapter.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">
                        {expandedChapters.has(chapter.id) ? (
                          <ChevronDownIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </span>
                      <div>
                        <span className="font-medium text-slate-900">
                          Chapter {chapterIndex + 1}: {chapter.title}
                        </span>
                        <span className="ml-3 text-sm text-slate-500">
                          ({chapter.lessons.length} lessons)
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openNewLessonModal(chapter.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                      >
                        <PlusIcon />
                        Lesson
                      </button>
                      <button
                        onClick={() => openEditChapterModal(chapter)}
                        className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteChapter(chapter)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  {/* Lessons */}
                  {expandedChapters.has(chapter.id) && (
                    <div className="bg-white">
                      {chapter.lessons.length > 0 ? (
                        chapter.lessons
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="px-6 py-3 pl-14 flex items-center justify-between border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
                            >

                              <div className="flex items-center gap-3">
                                {/* Video thumbnail or status indicator */}
                                {lesson.thumbnailUrl ? (
                                  <img
                                    src={lesson.thumbnailUrl}
                                    alt="Video thumbnail"
                                    className="w-14 h-8 object-cover rounded border border-slate-200"
                                  />
                                ) : lesson.muxStatus === 'error' ? (
                                  <div className="w-14 h-8 bg-red-50 rounded border border-red-200 flex items-center justify-center">
                                    <span className="text-[10px] text-red-600 font-medium">Error</span>
                                  </div>
                                ) : lesson.type === 'video' && (processingLessons.has(lesson.id) || (lesson.muxStatus === 'pending' && lesson.muxUploadId)) ? (
                                  <div className="w-14 h-8 bg-amber-50 rounded border border-amber-200 flex items-center justify-center">
                                    <span className="text-[10px] text-amber-600 font-medium">Processing</span>
                                  </div>
                                ) : lesson.type === 'video' ? (
                                  <div className="w-14 h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                                    <span className="text-[10px] text-slate-400">No video</span>
                                  </div>
                                ) : lesson.type === 'pdf' ? (
                                  <div className="w-14 h-8 bg-blue-50 rounded border border-blue-200 flex items-center justify-center">
                                    <span className="text-[10px] text-blue-600 font-medium">PDF</span>
                                  </div>
                                ) : (
                                  <div className="w-14 h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                                    <span className="text-[10px] text-slate-400">Text</span>
                                  </div>
                                )}

                                <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500 font-medium">
                                  {lessonIndex + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                  <PlayIcon />
                                  <span className="text-slate-900">
                                    {lesson.title}
                                  </span>
                                </div>
                                {lesson.isFree && (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                                    Free
                                  </span>
                                )}
                                <span className="text-sm text-slate-400">
                                  {formatDuration(lesson.duration)}
                                </span>
                                {lesson.muxPlaybackId ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                                    <CheckIcon /> Ready
                                  </span>
                                ) : lesson.type === 'video' && (processingLessons.has(lesson.id) || (lesson.muxStatus === 'pending' && lesson.muxUploadId)) ? (
                                  <span className="inline-flex items-center gap-1 text-amber-500 text-xs">
                                    <WarningIcon /> Processing
                                  </span>
                                ) : null}
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Upload progress bar */}
                                {uploadProgress?.lessonId === lesson.id && (
                                  <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-violet-500 transition-all duration-300"
                                      style={{ width: `${uploadProgress.progress}%` }}
                                    />
                                  </div>
                                )}
                                <button
                                  onClick={() => handleFileSelect(lesson.id)}
                                  disabled={uploading === lesson.id}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-violet-50 text-violet-600 rounded-lg text-xs font-medium hover:bg-violet-100 transition-colors disabled:opacity-50 min-w-[70px] justify-center"
                                >
                                  <UploadIcon />
                                  {uploadProgress?.lessonId === lesson.id
                                    ? `${uploadProgress.progress}%`
                                    : lesson.muxPlaybackId
                                      ? "Replace"
                                      : "Upload"}
                                </button>
                                {lesson.muxPlaybackId && lesson.muxStatus === 'ready' && (
                                  <button
                                    onClick={() => handlePlayVideo(lesson)}
                                    className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                    title="Play video"
                                  >
                                    <PlayIcon />
                                  </button>
                                )}
                                <button
                                  onClick={() => openEditLessonModal(lesson)}
                                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(lesson)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="px-6 py-4 pl-14 text-slate-400 text-sm">
                          No lessons yet.{" "}
                          <button
                            onClick={() => openNewLessonModal(chapter.id)}
                            className="text-slate-900 hover:underline font-medium"
                          >
                            Add one
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
              No chapters yet
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Start building your course by adding chapters and lessons.
            </p>
            <button
              onClick={openNewChapterModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium shadow-sm hover:bg-slate-800 transition-all"
            >
              <PlusIcon />
              Add First Chapter
            </button>
          </div>
        )}
      </div>

      {/* Chapter Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-display font-bold text-slate-900">
                {editingChapter ? "Edit Chapter" : "New Chapter"}
              </h2>
              <button
                onClick={() => setShowChapterModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleChapterSubmit}>
              <div className="p-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({ title: e.target.value })}
                  className="w-full px-0 py-2 border-b border-slate-300 focus:border-slate-800 outline-none bg-transparent transition-colors rounded-none placeholder:text-slate-400"
                  placeholder="e.g., Introduction to Financial Reporting"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowChapterModal(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg shadow-sm hover:bg-slate-800 transition-all"
                >
                  {editingChapter ? "Save Changes" : "Create Chapter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-display font-bold text-slate-900">
                {editingLesson ? "Edit Lesson" : "New Lesson"}
              </h2>
              <button
                onClick={() => setShowLessonModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleLessonSubmit}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, title: e.target.value })
                    }
                    className="w-full px-0 py-2 border-b border-slate-300 focus:border-slate-800 outline-none bg-transparent transition-colors rounded-none placeholder:text-slate-400"
                    placeholder="e.g., Understanding Balance Sheets"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Max Views
                  </label>
                  <input
                    type="number"
                    value={lessonForm.maxViews ?? 2}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        maxViews: Number(e.target.value),
                      })
                    }
                    className="w-full px-0 py-2 border-b border-slate-300 focus:border-slate-800 outline-none bg-transparent transition-colors rounded-none placeholder:text-slate-400"
                    min={1}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Number of times a student can view this lesson
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={lessonForm.description}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-0 py-2 border-b border-slate-300 focus:border-slate-800 outline-none bg-transparent transition-colors rounded-none placeholder:text-slate-400 resize-none"
                    rows={3}
                    placeholder="Add notes, instructions, or description for this lesson..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={lessonForm.isFree}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, isFree: e.target.checked })
                    }
                    className="w-5 h-5 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                  />
                  <label htmlFor="isFree" className="text-sm text-slate-700">
                    Free preview (visible without enrollment)
                  </label>
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Study Materials
                  </label>

                  {/* Attachments list */}
                  {lessonForm.attachments.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {lessonForm.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">📎</span>
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline truncate max-w-[200px]"
                            >
                              {attachment.name}
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      onChange={handleAttachmentUpload}
                      className="hidden"
                      disabled={uploadingAttachment}
                    />
                    {uploadingAttachment ? (
                      <span className="text-sm text-slate-500">Uploading...</span>
                    ) : (
                      <>
                        <span className="text-slate-400">📁</span>
                        <span className="text-sm text-slate-600">Add PDF, Word, Excel, or other files</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg shadow-sm hover:bg-slate-800 transition-all"
                >
                  {editingLesson ? "Save Changes" : "Create Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Player Modal - Secure Mux Player */}
      {showVideoPlayer && videoPlaybackId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">{videoTitle}</h3>
              <button
                onClick={() => {
                  setShowVideoPlayer(false);
                  setVideoPlaybackId(null);
                  setVideoPlaybackToken(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-video bg-black">
              <MuxPlayer
                playbackId={videoPlaybackId}
                tokens={{ playback: videoPlaybackToken || undefined }}
                streamType="on-demand"
                autoPlay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

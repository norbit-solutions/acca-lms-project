"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminChapter, AdminCourseDetail, AdminLesson } from "@/types";
import { adminService } from "@/services";
import { useModal } from "./ModalProvider";
import MuxPlayer from "@mux/mux-player-react";
import {
  BackIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  PlayCircleIcon,
  UploadIcon,
  EditIcon,
  TrashIcon,
  CloseIcon,
  CheckIcon,
  WarningIcon,
  BookIcon,
} from "@/lib/icons";

interface CourseDetailClientProps {
  initialCourse: AdminCourseDetail;
}

export default function CourseDetailClient({ initialCourse }: CourseDetailClientProps) {
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
  const [savingLesson, setSavingLesson] = useState(false);

  // Sync with initialCourse when it changes (e.g., after router.refresh())
  useEffect(() => {
    setCourse(initialCourse);
  }, [initialCourse]);

  // Subscribe to SSE for real-time lesson updates
  useEffect(() => {

    console.log('[SSE] Subscribing to course updates for course:', course);
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
                    thumbnailUrl: data.data.thumbnailUrl,
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
        console.log('[SSE] Failed to parse message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.log('[SSE] Error:', error);
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
      console.log("Failed to save chapter:", error);
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
      console.log("Failed to delete chapter:", error);
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
      console.log("[handleAttachmentUpload] Upload result:", result);

      // Add to attachments using functional update to avoid closure issues
      const newAttachment = {
        url: result.url,
        name: file.name,
        type: file.type,
      };
      console.log("[handleAttachmentUpload] Adding attachment:", newAttachment);

      setLessonForm((prev) => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment],
      }));
    } catch (error) {
      console.log("Failed to upload attachment:", error);
      showError("Failed to upload file");
    } finally {
      setUploadingAttachment(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setLessonForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
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
      console.log("Failed to get playback URL:", error);
      showError("Failed to load video");
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[handleLessonSubmit] lessonForm:", lessonForm);
    console.log("[handleLessonSubmit] attachments:", lessonForm.attachments);
    setSavingLesson(true);
    try {
      if (editingLesson) {
        // Map form fields to API field names
        const updateData = {
          title: lessonForm.title,
          isFree: lessonForm.isFree,
          viewLimit: lessonForm.maxViews,
          description: lessonForm.description,
          attachments: lessonForm.attachments,
        };
        console.log("[handleLessonSubmit] Sending update data:", updateData);
        await adminService.updateLesson(editingLesson.id, updateData);
      } else if (selectedChapterId) {
        await adminService.createLesson(selectedChapterId, {
          title: lessonForm.title,
          isFree: lessonForm.isFree,
          viewLimit: lessonForm.maxViews,
          type: 'video',
        });
      }
      setShowLessonModal(false);
      router.refresh();
    } catch (error) {
      console.log("Failed to save lesson:", error);
      showError("Failed to save lesson");
    } finally {
      setSavingLesson(false);
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
      console.log("Failed to delete lesson:", error);
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
      console.log("Failed to upload video:", error);
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
              <BackIcon className="w-4 h-4" />
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
            <PlusIcon className="w-4 h-4" />
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
                          <ChevronDownIcon className="w-4 h-4" />
                        ) : (
                          <ChevronRightIcon className="w-4 h-4" />
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
                        <PlusIcon className="w-4 h-4" />
                        Lesson
                      </button>
                      <button
                        onClick={() => openEditChapterModal(chapter)}
                        className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteChapter(chapter)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
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
                                  <PlayCircleIcon className="w-4 h-4" />
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
                                    <CheckIcon className="w-4 h-4" /> Ready
                                  </span>
                                ) : lesson.type === 'video' && (processingLessons.has(lesson.id) || (lesson.muxStatus === 'pending' && lesson.muxUploadId)) ? (
                                  <span className="inline-flex items-center gap-1 text-amber-500 text-xs">
                                    <WarningIcon className="w-4 h-4" /> Processing
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
                                  <UploadIcon className="w-4 h-4" />
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
                                    <PlayCircleIcon className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => openEditLessonModal(lesson)}
                                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                  <EditIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(lesson)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <TrashIcon className="w-4 h-4" />
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
              <BookIcon className="w-8 h-8" />
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
              <PlusIcon className="w-4 h-4" />
              Add First Chapter
            </button>
          </div>
        )}
      </div>

      {/* Chapter Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-medium text-slate-900">
                {editingChapter ? "Edit Chapter" : "New Chapter"}
              </h2>
              <button
                onClick={() => setShowChapterModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleChapterSubmit}>
              <div className="p-5">
                <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({ title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-slate-400 focus:ring-0 outline-none"
                  placeholder="e.g., Introduction to Financial Reporting"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setShowChapterModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  {editingChapter ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-medium text-slate-900">
                {editingLesson ? "Edit Lesson" : "New Lesson"}
              </h2>
              <button
                onClick={() => setShowLessonModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleLessonSubmit}>
              <div className="p-5 space-y-4 overflow-y-auto max-h-[60vh]">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
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
                            <CloseIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-slate-400 hover:bg-blue-50/50 transition-colors">
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
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLesson}
                  className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {savingLesson && (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {savingLesson ? "Saving..." : (editingLesson ? "Save" : "Create")}
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
                <CloseIcon className="w-5 h-5 text-slate-500" />
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

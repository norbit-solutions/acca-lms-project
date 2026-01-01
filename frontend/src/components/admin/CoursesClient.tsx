"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import type { AdminCourse } from "@/types";
import { adminService } from "@/services";
import { useRouter } from "next/navigation";
import { useModal } from "./ModalProvider";

// Icons - minimal with thin strokes
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
);

const BookIcon = () => (
  <svg
    className="w-12 h-12"
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
);

const ChapterIcon = () => (
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
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

const LessonIcon = () => (
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

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function CoursesClient({
  initialCourses = [],
}: {
  initialCourses?: AdminCourse[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    isPublished: false,
    isUpcoming: false,
  });

  const router = useRouter();
  const { showError, showConfirm } = useModal();




  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      showError("Please select a valid image file (JPG, PNG, WebP, or GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const result = await adminService.uploadImage(file, "thumbnails");
      setFormData({ ...formData, thumbnail: result.url });
    } catch (error) {
      console.log("Failed to upload thumbnail:", error);
      showError("Failed to upload thumbnail. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeThumbnail = async () => {
    // Delete from bucket if there's an existing thumbnail
    if (formData.thumbnail) {
      try {
        await adminService.deleteFile(formData.thumbnail);
      } catch (error) {
        console.log("Failed to delete thumbnail from bucket:", error);
      }
    }
    setFormData({ ...formData, thumbnail: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await adminService.updateCourse(editingCourse.id, {
          ...formData,
          thumbnail: formData.thumbnail || undefined,
        });
      } else {
        await adminService.createCourse({
          ...formData,
          thumbnail: formData.thumbnail || undefined,
        });
      }
      setShowModal(false);
      setEditingCourse(null);
      setFormData({ title: "", description: "", thumbnail: "", isPublished: false, isUpcoming: false });
      router.refresh();
    } catch (error) {
      console.log("Failed to save course:", error);
      showError("Failed to save course");
    }
  };

  const handleEdit = (course: AdminCourse) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || "",
      thumbnail: course.thumbnail || "",
      isPublished: course.isPublished,
      isUpcoming: course.isUpcoming || false,
    });
    setShowModal(true);
    router.refresh();
  };

  const handleDelete = async (course: AdminCourse) => {
    const confirmed = await showConfirm({
      title: "Delete Course",
      message: `Are you sure you want to delete "${course.title}"?`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await adminService.deleteCourse(course.id);
      router.refresh();
    } catch (error) {
      console.log("Failed to delete course:", error);
      showError("Failed to delete course");
    }
  };

  const openNewModal = () => {
    setEditingCourse(null);
    setFormData({ title: "", description: "", thumbnail: "", isPublished: false, isUpcoming: false });
    setShowModal(true);
  };


  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Courses
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your educational content and curriculum
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-900 text-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition-colors"
        >
          <PlusIcon />
          New Course
        </button>
      </div>

      {/* Courses Grid */}
      {initialCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {initialCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Course Image */}
              <div className="relative h-44 bg-slate-50 flex items-center justify-center overflow-hidden">
                {course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-slate-400 group-hover:scale-110 transition-transform duration-300">
                    <BookIcon />
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0"></div>
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${course.isPublished
                      ? "bg-emerald-500/90 text-white"
                      : "bg-slate-900/70 text-slate-200"
                      }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-5">
                <h3 className="font-display font-bold text-slate-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-10">
                  {course.description || "No description provided"}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-5 py-3 border-y border-slate-100">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <ChapterIcon />
                    <span className="font-semibold">
                      {course.chaptersCount || 0}
                    </span>
                    <span className="text-slate-400">chapters</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <LessonIcon />
                    <span className="font-semibold">
                      {course.lessonsCount || 0}
                    </span>
                    <span className="text-slate-400">lessons</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Manage Content
                  </Link>
                  <button
                    onClick={() => handleEdit(course)}
                    className="p-2.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(course)}
                    className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
            <BookIcon />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
            No courses yet
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Get started by creating your first course. Build engaging content
            for your students.
          </p>
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium shadow-sm hover:bg-slate-800 transition-all"
          >
            <PlusIcon />
            Create Your First Course
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="font-medium text-slate-900">
                {editingCourse ? "Edit Course" : "New Course"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="p-5 space-y-4 overflow-y-auto max-h-[60vh]">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-0 py-2 border-b border-slate-300 focus:border-slate-800 outline-none bg-transparent transition-colors rounded-none placeholder:text-slate-400"
                    placeholder="Enter course title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-0 py-2 border-b border-slate-300 focus:border-slate-800 outline-none bg-transparent transition-colors rounded-none placeholder:text-slate-400 resize-none"
                    rows={4}
                    placeholder="Describe what students will learn..."
                  />
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
                    Thumbnail
                  </label>

                  {formData.thumbnail ? (
                    <div className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-40 object-cover rounded-xl border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-slate-400 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        id="thumbnail-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {uploading ? (
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-sm text-slate-500">Uploading...</span>
                          </div>
                        ) : (
                          <>
                            <svg className="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-slate-600 font-medium">Click to upload thumbnail</span>
                            <span className="text-xs text-slate-400 block mt-1">JPG, PNG, WebP, GIF (max 5MB)</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPublished: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-slate-900 border-slate-300 rounded focus:ring-slate-900 cursor-pointer"
                  />
                  <label
                    htmlFor="isPublished"
                    className="flex-1 cursor-pointer"
                  >
                    <span className="block font-semibold text-slate-700">
                      Publish course
                    </span>
                    <span className="text-sm text-slate-500">
                      Make this course visible to students
                    </span>
                  </label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isUpcoming"
                    checked={formData.isUpcoming}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isUpcoming: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <label
                    htmlFor="isUpcoming"
                    className="flex-1 cursor-pointer"
                  >
                    <span className="block font-semibold text-slate-700">
                      Show as Upcoming
                    </span>
                    <span className="text-sm text-slate-500">
                      Feature this course in the Upcoming Courses section
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingCourse ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

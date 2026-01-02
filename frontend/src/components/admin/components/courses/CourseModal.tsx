"use client";

import { useState, useRef, useEffect } from "react";
import type { AdminCourse } from "@/types";
import { adminService } from "@/services";
import { CloseIcon, ImageUploadIcon } from "@/lib/icons";
import { showError } from "@/lib/toast";
import { Modal } from "@/components/modals";

interface CourseFormData {
  title: string;
  description: string;
  thumbnail: string;
  isPublished: boolean;
  isUpcoming: boolean;
  price: string;
  currency: string;
  isFree: boolean;
}

interface CourseModalProps {
  isOpen: boolean;
  editingCourse: AdminCourse | null;
  formData: CourseFormData;
  onFormChange: (data: CourseFormData) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent, finalThumbnail?: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function CourseModal({
  isOpen,
  editingCourse,
  formData,
  onFormChange,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CourseModalProps) {
  const [uploading, setUploading] = useState(false);
  const [pendingThumbnail, setPendingThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URL on unmount or when modal closes
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  // Reset pending state when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      setPendingThumbnail(null);
      setThumbnailPreview("");
    }
  }, [isOpen, thumbnailPreview]);

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Clean up previous blob URL if exists
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    // Store file for later upload and create local preview
    setPendingThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    // Clean up blob URL if exists
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setPendingThumbnail(null);
    setThumbnailPreview("");
    onFormChange({ ...formData, thumbnail: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitWithUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalThumbnail = formData.thumbnail;

      // Upload pending thumbnail if exists
      if (pendingThumbnail) {
        const result = await adminService.uploadImage(pendingThumbnail, "thumbnails");
        finalThumbnail = result.url;
      }

      // Call parent submit with final thumbnail URL
      await onSubmit(e, finalThumbnail);

      // Clear pending state on success
      setPendingThumbnail(null);
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      setThumbnailPreview("");
    } catch (error) {
      console.log("Failed to save course:", error);
      showError("Failed to save course. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Determine what thumbnail to show: pending preview, or existing URL
  const displayThumbnail = thumbnailPreview || formData.thumbnail;

  const isLoading = uploading || isSubmitting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCourse ? "Edit Course" : "Create New Course"}
      subtitle={editingCourse ? "Update course details and settings" : "Add a new course to your platform"}
      size="lg"
      onSubmit={handleSubmitWithUpload}
      buttons={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "ghost",
          disabled: isLoading,
        },
        {
          label: editingCourse ? "Save Changes" : "Create Course",
          type: "submit",
          variant: "primary",
          isLoading: isSubmitting,
          loadingText: editingCourse ? "Saving..." : "Creating...",
          disabled: uploading,
        },
      ]}
    >
      <div className="space-y-6">
        {/* Course Title */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Course Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none bg-white transition-all placeholder:text-slate-400"
            placeholder="Enter course title..."
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none bg-white transition-all placeholder:text-slate-400 resize-none"
            rows={4}
            placeholder="Describe what students will learn..."
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Course Thumbnail
          </label>

          {displayThumbnail ? (
            <div className="relative group rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayThumbnail}
                alt="Thumbnail preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="p-3 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-slate-400 transition-all duration-300 bg-slate-50/50 hover:bg-slate-100/50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleThumbnailSelect}
                className="hidden"
                id="thumbnail-upload"
                disabled={uploading}
              />
              <label
                htmlFor="thumbnail-upload"
                className={`cursor-pointer block ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center py-4">
                    <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mb-4"></div>
                    <span className="text-sm text-slate-600 font-medium">Uploading image...</span>
                  </div>
                ) : (
                  <>
                    <ImageUploadIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <span className="text-sm text-slate-700 font-semibold block">Click to upload thumbnail</span>
                    <span className="text-xs text-slate-400 block mt-1">JPG, PNG, WebP, GIF (max 5MB)</span>
                  </>
                )}
              </label>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Price
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => onFormChange({ ...formData, price: e.target.value })}
              placeholder="0"
              disabled={formData.isFree}
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                formData.isFree 
                  ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed' 
                  : 'border-slate-200 bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100'
              }`}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => onFormChange({ ...formData, currency: e.target.value })}
              disabled={formData.isFree}
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                formData.isFree 
                  ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed' 
                  : 'border-slate-200 bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100'
              }`}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="AED">AED</option>
            </select>
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-3">
          {/* Free Course Toggle */}
          <label className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl cursor-pointer hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 border border-emerald-100">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.isFree}
                onChange={(e) => {
                  const isFree = e.target.checked;
                  onFormChange({
                    ...formData,
                    isFree,
                    price: isFree ? "0" : formData.price,
                  });
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors"></div>
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
            </div>
            <div className="flex-1">
              <span className="block font-semibold text-slate-800">Free Course</span>
              <span className="text-sm text-slate-500">Make this course free for everyone</span>
            </div>
            <span className="text-2xl">🎁</span>
          </label>

          {/* Published Toggle */}
          <label className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl cursor-pointer hover:from-slate-100 hover:to-slate-150 transition-all duration-300 border border-slate-100">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => onFormChange({ ...formData, isPublished: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-slate-900 transition-colors"></div>
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
            </div>
            <div className="flex-1">
              <span className="block font-semibold text-slate-800">Publish Course</span>
              <span className="text-sm text-slate-500">Make visible to students</span>
            </div>
            <span className="text-2xl">🚀</span>
          </label>

          {/* Upcoming Toggle */}
          <label className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl cursor-pointer hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-100">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.isUpcoming}
                onChange={(e) => onFormChange({ ...formData, isUpcoming: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-amber-500 transition-colors"></div>
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
            </div>
            <div className="flex-1">
              <span className="block font-semibold text-slate-800">Show as Upcoming</span>
              <span className="text-sm text-slate-500">Feature in Upcoming section</span>
            </div>
            <span className="text-2xl">⏰</span>
          </label>
        </div>
      </div>
    </Modal>
  );
}

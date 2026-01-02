"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLesson } from "@/types";
import { adminService } from "@/services";
import { showError } from "@/lib/toast";
import { CloseIcon } from "@/lib/icons";
import { Modal } from "@/components/modals";

// Existing attachment from backend
interface ExistingAttachment {
  url: string;
  name: string;
  type: string;
}

// Pending attachment awaiting upload
interface PendingAttachment {
  file: File;
  name: string;
  previewUrl?: string; // For local preview if needed
}

interface LessonFormData {
  title: string;
  isFree: boolean;
  viewLimit: number;
  description: string;
  existingAttachments: ExistingAttachment[];
  pendingAttachments: PendingAttachment[];
}

interface LessonModalProps {
  isOpen: boolean;
  editingLesson: AdminLesson | null;
  chapterId: number | null;
  onClose: () => void;
}

const initialFormData: LessonFormData = {
  title: "",
  isFree: false,
  viewLimit: 2,
  description: "",
  existingAttachments: [],
  pendingAttachments: [],
};

export default function LessonModal({
  isOpen,
  editingLesson,
  chapterId,
  onClose,
}: LessonModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<LessonFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);

  // Reset/populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingLesson) {
        setFormData({
          title: editingLesson.title,
          isFree: editingLesson.isFree,
          viewLimit: editingLesson.viewLimit ?? 2,
          description: editingLesson.description || "",
          existingAttachments: editingLesson.attachments || [],
          pendingAttachments: [],
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isOpen, editingLesson]);

  // Cleanup pending attachment blob URLs when modal closes
  useEffect(() => {
    if (!isOpen) {
      formData.pendingAttachments.forEach((p) => {
        if (p.previewUrl) {
          URL.revokeObjectURL(p.previewUrl);
        }
      });
    }
  }, [isOpen, formData.pendingAttachments]);

  const handleClose = () => {
    // Cleanup blob URLs
    formData.pendingAttachments.forEach((p) => {
      if (p.previewUrl) {
        URL.revokeObjectURL(p.previewUrl);
      }
    });
    setFormData(initialFormData);
    onClose();
  };

  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Add to pending attachments (will upload on save)
    setFormData((prev) => ({
      ...prev,
      pendingAttachments: [
        ...prev.pendingAttachments,
        { file, name: file.name },
      ],
    }));

    // Reset file input
    e.target.value = "";
  };

  const handleRemoveExistingAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      existingAttachments: prev.existingAttachments.filter((_, i) => i !== index),
    }));
  };

  const handleRemovePendingAttachment = (index: number) => {
    const attachment = formData.pendingAttachments[index];
    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
    setFormData((prev) => ({
      ...prev,
      pendingAttachments: prev.pendingAttachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadingAttachments(formData.pendingAttachments.length > 0);

    try {
      // Upload all pending attachments
      const uploadedAttachments: ExistingAttachment[] = await Promise.all(
        formData.pendingAttachments.map(async (pending) => {
          const result = await adminService.uploadPdf(pending.file);
          return { url: result.url, name: pending.name, type: pending.file.type };
        })
      );

      // Merge existing and newly uploaded attachments
      const allAttachments = [...formData.existingAttachments, ...uploadedAttachments];

      const payload = {
        title: formData.title,
        isFree: formData.isFree,
        viewLimit: formData.viewLimit,
        description: formData.description,
        attachments: allAttachments,
      };

      if (editingLesson) {
        await adminService.updateLesson(editingLesson.id, payload);
      } else if (chapterId) {
        await adminService.createLesson(chapterId, { ...payload, type: 'video' as const });
      }

      handleClose();
      router.refresh();
    } catch (error) {
      console.log("Failed to save lesson:", error);
      showError("Failed to save lesson");
    } finally {
      setIsSubmitting(false);
      setUploadingAttachments(false);
    }
  };

  const isLoading = isSubmitting || uploadingAttachments;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingLesson ? "Edit Lesson" : "New Lesson"}
      subtitle={editingLesson ? "Update lesson details" : "Add a new lesson to this chapter"}
      size="md"
      onSubmit={handleSubmit}
      buttons={[
        {
          label: "Cancel",
          onClick: handleClose,
          variant: "ghost",
          disabled: isLoading,
        },
        {
          label: editingLesson ? "Save" : "Create",
          type: "submit",
          variant: "primary",
          isLoading: isSubmitting,
          loadingText: "Saving...",
          disabled: uploadingAttachments,
        },
      ]}
    >
      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Lesson Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none bg-white transition-all placeholder:text-slate-400"
            placeholder="e.g., Understanding Balance Sheets"
            required
          />
        </div>

        {/* View Limit */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Max Views
          </label>
          <input
            type="number"
            value={formData.viewLimit}
            onChange={(e) => setFormData({ ...formData, viewLimit: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none bg-white transition-all"
            min={1}
          />
          <p className="text-xs text-slate-500">Number of times a student can view this lesson</p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none bg-white transition-all placeholder:text-slate-400 resize-none"
            rows={3}
            placeholder="Add notes, instructions, or description for this lesson..."
          />
        </div>

        {/* Free Preview Toggle */}
        <label className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl cursor-pointer hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 border border-emerald-100">
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.isFree}
              onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
          </div>
          <div className="flex-1">
            <span className="block font-semibold text-slate-800">Free Preview</span>
            <span className="text-sm text-slate-500">Visible without enrollment</span>
          </div>
          <span className="text-2xl">🎁</span>
        </label>

        {/* Attachments */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Study Materials
          </label>

          {/* Existing attachments (already uploaded) */}
          {formData.existingAttachments.length > 0 && (
            <div className="mb-3 space-y-2">
              {formData.existingAttachments.map((attachment, index) => (
                <div
                  key={`existing-${index}`}
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
                    onClick={() => handleRemoveExistingAttachment(index)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pending attachments (not yet uploaded) */}
          {formData.pendingAttachments.length > 0 && (
            <div className="mb-3 space-y-2">
              {formData.pendingAttachments.map((pending, index) => (
                <div
                  key={`pending-${index}`}
                  className="flex items-center justify-between px-3 py-2 bg-amber-50 rounded-lg border border-amber-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600">📄</span>
                    <span className="text-sm text-amber-700 truncate max-w-[200px]">
                      {pending.name}
                    </span>
                    <span className="text-xs text-amber-500">(pending)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePendingAttachment(index)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-slate-400 hover:bg-blue-50/50 transition-colors">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              onChange={handleAttachmentSelect}
              className="hidden"
              disabled={isLoading}
            />
            <span className="text-slate-400">📁</span>
            <span className="text-sm text-slate-600">Add PDF, Word, Excel, or other files</span>
          </label>
        </div>
      </div>
    </Modal>
  );
}

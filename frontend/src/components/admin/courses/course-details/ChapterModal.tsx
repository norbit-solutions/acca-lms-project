"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminChapter } from "@/types";
import { adminService } from "@/services";
import { showError } from "@/lib/toast";
import { CloseIcon } from "@/lib/icons";
import { Modal } from "@/components/modals";

interface ChapterModalProps {
  isOpen: boolean;
  editingChapter: AdminChapter | null;
  courseId: number;
  onClose: () => void;
}

export default function ChapterModal({
  isOpen,
  editingChapter,
  courseId,
  onClose,
}: ChapterModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(editingChapter?.title || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or editing chapter changes
  const handleClose = () => {
    setTitle("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingChapter) {
        await adminService.updateChapter(editingChapter.id, { title });
      } else {
        await adminService.createChapter(courseId, { title });
      }
      handleClose();
      router.refresh();
    } catch (error) {
      console.log("Failed to save chapter:", error);
      showError("Failed to save chapter");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update title when editing chapter changes
  if (isOpen && editingChapter && title !== editingChapter.title && title === "") {
    setTitle(editingChapter.title);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingChapter ? "Edit Chapter" : "New Chapter"}
      size="sm"
      onSubmit={handleSubmit}
      buttons={[
        {
          label: "Cancel",
          onClick: handleClose,
          variant: "ghost",
          disabled: isSubmitting,
        },
        {
          label: editingChapter ? "Save" : "Create",
          type: "submit",
          variant: "primary",
          isLoading: isSubmitting,
          loadingText: "Saving...",
        },
      ]}
    >
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Chapter Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none bg-white transition-all placeholder:text-slate-400"
          placeholder="e.g., Introduction to Financial Reporting"
          required
        />
      </div>
    </Modal>
  );
}

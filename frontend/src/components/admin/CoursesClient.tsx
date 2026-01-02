"use client";

import { useState } from "react";
import type { AdminCourse } from "@/types";
import { adminService } from "@/services";
import { useRouter } from "next/navigation";
import { showError } from "@/lib/toast";
import { useConfirm } from "@/components/ConfirmProvider";
import {
  CoursesHeader,
  CourseCard,
  CoursesEmptyState,
  CourseModal,
} from "./courses";

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

const initialFormData: CourseFormData = {
  title: "",
  description: "",
  thumbnail: "",
  isPublished: false,
  isUpcoming: false,
  price: "",
  currency: "USD",
  isFree: false,
};

export default function CoursesClient({
  initialCourses = [],
}: {
  initialCourses?: AdminCourse[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { showConfirm } = useConfirm();

  const handleSubmit = async (e: React.FormEvent, finalThumbnail?: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Use finalThumbnail if provided (from CourseModal upload), otherwise use formData.thumbnail
    const thumbnailUrl = finalThumbnail ?? formData.thumbnail;
    
    try {
      if (editingCourse) {
        await adminService.updateCourse(editingCourse.id, {
          ...formData,
          price: formData.price ? Number(formData.price) : undefined,
          isFree: formData.isFree,
          thumbnail: thumbnailUrl || undefined,
        });
      } else {
        await adminService.createCourse({
          ...formData,
          price: formData.price ? Number(formData.price) : undefined,
          isFree: formData.isFree,
          thumbnail: thumbnailUrl || undefined,
        });
      }
      setShowModal(false);
      setEditingCourse(null);
      setFormData(initialFormData);
      router.refresh();
    } catch (error) {
      console.log("Failed to save course:", error);
      showError("Failed to save course");
    } finally {
      setIsSubmitting(false);
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
      price: course.price?.toString() || "",
      currency: course.currency || "USD",
      isFree: course.isFree,
    });
    setShowModal(true);
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
    setFormData(initialFormData);
    setShowModal(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setShowModal(false);
    setEditingCourse(null);
    setFormData(initialFormData);
  };

  return (
    <div className="space-y-8">
      <CoursesHeader onAddCourse={openNewModal} />

      {initialCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {initialCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <CoursesEmptyState onAddCourse={openNewModal} />
      )}

      <CourseModal
        isOpen={showModal}
        editingCourse={editingCourse}
        formData={formData}
        onFormChange={setFormData}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}


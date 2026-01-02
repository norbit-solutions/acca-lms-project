"use client";

import { useState } from "react";
import { adminService } from "@/services";
import type { AdminUser, UserEnrollment } from "@/types";
import { showError, showSuccess } from "@/lib/toast";
import { useConfirm } from "@/components/ConfirmProvider";
import UserHeader from "./user-detail/UserHeader";
import UserEnrollments from "./user-detail/UserEnrollments";
import UserVideoViews from "./user-detail/UserVideoViews";
import UserAccountInfo from "./user-detail/UserAccountInfo";

interface UserDetailClientProps {
  initialUser: AdminUser;
}

export default function UserDetailClient({
  initialUser,
}: UserDetailClientProps) {
  const { showConfirm } = useConfirm();
  const [user, setUser] = useState<AdminUser>(initialUser);

  const loadUser = async () => {
    try {
      const data = await adminService.getUser(user.id);
      setUser(data || null);
    } catch (error) {
      console.log("Failed to load user:", error);
      showError("Failed to load user details");
    }
  };

  const handleRemoveEnrollment = async (enrollment: UserEnrollment) => {
    const confirmed = await showConfirm({
      title: "Remove Enrollment",
      message: `Remove enrollment from ${enrollment.course.title}?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await adminService.deleteEnrollment(enrollment.id);
      loadUser();
    } catch (error) {
      console.log("Failed to remove enrollment:", error);
      showError("Failed to remove enrollment");
    }
  };

  const handleSetViewLimit = async (lessonId: number, limit: number) => {
    try {
      await adminService.setUserViewLimit(user.id, lessonId, limit);
      showSuccess("View limit updated successfully");
      loadUser();
    } catch (error) {
      console.log("Failed to set view limit:", error);
      showError("Failed to set view limit");
    }
  };

  const handleRemoveViewLimit = async (lessonId: number) => {
    try {
      await adminService.removeUserViewLimit(user.id, lessonId);
      showSuccess("Custom view limit removed");
      loadUser();
    } catch (error) {
      console.log("Failed to remove view limit:", error);
      showError("Failed to remove view limit");
    }
  };

  return (
    <div>
      <UserHeader user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserEnrollments user={user} onRemoveEnrollment={handleRemoveEnrollment} />

        <UserVideoViews
          user={user}
          onSetViewLimit={handleSetViewLimit}
          onRemoveViewLimit={handleRemoveViewLimit}
        />
      </div>

      <UserAccountInfo user={user} />
    </div>
  );
}

"use client";
import { useState } from "react";
import type { Enrollment, AdminCourse, User } from "@/types";
import { adminService } from "@/services";
import { showError, showSuccess } from "@/lib/toast";
import { useConfirm } from "@/components/ConfirmProvider";
import { useRouter } from "next/navigation";
import EnrollmentsHeader from "./enrollment/EnrollmentsHeader";
import EnrollmentsFilter from "./enrollment/EnrollmentsFilter";
import EnrollmentsTable from "./enrollment/EnrollmentsTable";
import NewEnrollmentModal from "./enrollment/NewEnrollmentModal";

export default function EnrollmentsClient({
  initialEnrollments = [],
  initialCourses = [],
}: {
  initialEnrollments?: Enrollment[];
  initialCourses?: AdminCourse[];
}) {
  const { showConfirm } = useConfirm();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  const [filterCourse, setFilterCourse] = useState<number | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const courses = Array.isArray(initialCourses) ? initialCourses : [];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setHasSearched(true);
    try {
      const data = await adminService.searchUsers(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.log("Failed to search users:", error);
      showError("Failed to search users");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user: User | null) => {
    if (user) {
      setSelectedUser(user);
      setSearchResults([]);
      setSearchQuery(user.email);
    } else {
      setSelectedUser(null);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const toggleCourse = (courseId: number) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const handleEnroll = async () => {
    if (!selectedUser || selectedCourses.size === 0) {
      showError("Please select a user and at least one course");
      return;
    }

    setEnrolling(true);
    let successCount = 0;
    let errorCount = 0;

    for (const courseId of selectedCourses) {
      try {
        await adminService.createEnrollment({
          userId: selectedUser.id,
          courseId,
        });
        successCount++;
      } catch (error) {
        console.log("Failed to enroll in course:", courseId, error);
        errorCount++;
      }
    }

    setEnrolling(false);

    if (successCount > 0) {
      showSuccess(`Enrolled in ${successCount} course${successCount > 1 ? 's' : ''}`);
    }
    if (errorCount > 0) {
      showError(`Failed to enroll in ${errorCount} course${errorCount > 1 ? 's' : ''}`);
    }

    setShowModal(false);
    setSelectedUser(null);
    setSelectedCourses(new Set());
    setSearchQuery("");
    router.refresh();
  };

  const handleDelete = async (enrollment: Enrollment) => {
    const confirmed = await showConfirm({
      title: "Remove Enrollment",
      message: `Remove ${enrollment.user?.fullName} from ${enrollment.course?.title}?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await adminService.deleteEnrollment(enrollment.id);
      showSuccess("Enrollment removed");
      router.refresh();
    } catch (error) {
      console.log("Failed to delete enrollment:", error);
      showError("Failed to remove enrollment");
    }
  };

  const filteredEnrollments = initialEnrollments.filter(enrollment => {
    if (!filterCourse) return true;
    return enrollment.course?.id === filterCourse;
  });

  return (
    <div className="space-y-6">
      <EnrollmentsHeader onNewEnrollment={() => setShowModal(true)} />

      <EnrollmentsFilter
        courses={courses}
        filterCourse={filterCourse}
        onFilterChange={setFilterCourse}
      />

      <EnrollmentsTable
        enrollments={filteredEnrollments}
        onDelete={handleDelete}
        onSelectNew={() => setShowModal(true)}
      />

      <NewEnrollmentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
          setSelectedCourses(new Set());
          setSearchQuery("");
          setSearchResults([]);
          setHasSearched(false);
        }}
        searchQuery={searchQuery}
        onSearchQueryChange={(query) => {
          setSearchQuery(query);
          if (!query) setHasSearched(false);
        }}
        onSearch={handleSearch}
        searching={searching}
        hasSearched={hasSearched}
        searchResults={searchResults}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        courses={courses}
        selectedCourses={selectedCourses}
        onToggleCourse={toggleCourse}
        onEnroll={handleEnroll}
        enrolling={enrolling}
      />
    </div>
  );
}

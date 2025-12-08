/**
 * Admin Types
 */

import type { User } from "./auth.types";

// Dashboard stats
export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  recentEnrollments: RecentEnrollment[];
}

// Recent enrollment
export interface RecentEnrollment {
  id: number;
  user: {
    fullName: string;
    email: string;
  };
  course: {
    title: string;
  };
  createdAt: string;
}

// Admin course list item
export interface AdminCourse {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  isPublished: boolean;
  price: number | null;
  currency: string;
  chaptersCount: number;
  lessonsCount: number;
  enrollmentsCount: number;
  createdAt: string;
  updatedAt: string;
}

// Admin course detail
export interface AdminCourseDetail extends AdminCourse {
  chapters: AdminChapter[];
}

// Admin chapter
export interface AdminChapter {
  id: number;
  title: string;
  sortOrder: number;
  lessons: AdminLesson[];
}

// Admin lesson
export interface AdminLesson {
  id: number;
  title: string;
  sortOrder: number;
  duration: number | null;
  isFree: boolean;
  maxViews: number;
  playbackId: string | null;
  assetId: string | null;
}

// Enrollment
export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  user?: User;
  course?: {
    id: number;
    title: string;
    slug: string;
  };
}

// User with details for admin
export interface AdminUser extends User {
  enrollmentsCount?: number;
  createdAt: string;
}

// Video view
export interface VideoView {
  id: number;
  lessonId: number;
  userId: number;
  viewCount: number;
  lastViewedAt: string;
  lesson?: {
    id: number;
    title: string;
    chapter?: {
      id: number;
      title: string;
      course?: {
        id: number;
        title: string;
      };
    };
  };
}

// Create course request
export interface CreateCourseRequest {
  title: string;
  description?: string;
  thumbnail?: string;
  isPublished?: boolean;
  price?: number;
  currency?: string;
}

// Update course request
export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  thumbnail?: string;
  isPublished?: boolean;
  price?: number;
  currency?: string;
}

// Create chapter request
export interface CreateChapterRequest {
  title: string;
  sortOrder?: number;
}

// Update chapter request
export interface UpdateChapterRequest {
  title?: string;
  sortOrder?: number;
}

// Create lesson request
export interface CreateLessonRequest {
  title: string;
  sortOrder?: number;
  isFree?: boolean;
  maxViews?: number;
}

// Update lesson request
export interface UpdateLessonRequest {
  title?: string;
  sortOrder?: number;
  isFree?: boolean;
  maxViews?: number;
}

// Create enrollment request
export interface CreateEnrollmentRequest {
  courseId: number;
  userId?: number;
  email?: string;
  phone?: string;
}

// Upload URL response
export interface UploadUrlResponse {
  uploadUrl: string;
  assetId: string;
}

// File upload response
export interface FileUploadResponse {
  url: string;
  key: string;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Admin Service
 * Handles all admin-related API calls (requires admin authentication)
 */

import api from "@/lib/fetchConfig";
import type {
  DashboardStats,
  AdminCourse,
  AdminCourseDetail,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateChapterRequest,
  UpdateChapterRequest,
  CreateLessonRequest,
  UpdateLessonRequest,
  CreateEnrollmentRequest,
  Enrollment,
  AdminUser,
  VideoView,
  UploadUrlResponse,
  FileUploadResponse,
  PaginationParams,
  PaginatedResponse,
} from "@/types";

const ADMIN_ENDPOINTS = {
  // Dashboard
  STATS: "/admin/stats",

  // Courses
  COURSES: "/admin/courses",
  COURSE: (id: number) => `/admin/courses/${id}`,

  // Chapters
  CHAPTERS: (courseId: number) => `/admin/courses/${courseId}/chapters`,
  CHAPTER: (id: number) => `/admin/chapters/${id}`,
  REORDER_CHAPTERS: (courseId: number) =>
    `/admin/courses/${courseId}/chapters/reorder`,

  // Lessons
  LESSONS: (chapterId: number) => `/admin/chapters/${chapterId}/lessons`,
  LESSON: (id: number) => `/admin/lessons/${id}`,
  REORDER_LESSONS: (chapterId: number) =>
    `/admin/chapters/${chapterId}/lessons/reorder`,
  LESSON_UPLOAD_URL: (id: number) => `/admin/lessons/${id}/upload-url`,

  // Enrollments
  ENROLLMENTS: "/admin/enrollments",
  ENROLLMENT: (id: number) => `/admin/enrollments/${id}`,

  // Users
  USERS: "/admin/users",
  USER: (id: number) => `/admin/users/${id}`,
  USER_SEARCH: "/admin/users/search",
  USER_VIEWS: (id: number) => `/admin/users/${id}/views`,
  USER_VIEW_LIMIT: (userId: number, lessonId: number) => `/admin/users/${userId}/lessons/${lessonId}/view-limit`,

  // CMS
  CMS: "/admin/cms",
  CMS_KEY: (key: string) => `/admin/cms/${key}`,

  // Testimonials
  TESTIMONIALS: "/admin/testimonials",
  TESTIMONIAL: (id: number) => `/admin/testimonials/${id}`,
  REORDER_TESTIMONIALS: "/admin/testimonials/reorder",

  // Instructors
  INSTRUCTORS: "/admin/instructors",
  INSTRUCTOR: (id: number) => `/admin/instructors/${id}`,
  REORDER_INSTRUCTORS: "/admin/instructors/reorder",

  // File Uploads
  UPLOAD_IMAGE: "/admin/upload/image",
  UPLOAD_PDF: "/admin/upload/pdf",
  DELETE_UPLOAD: "/admin/upload",
} as const;

export const adminService = {
  // Dashboard
  async getStats(): Promise<DashboardStats> {
    return api.get<DashboardStats>(ADMIN_ENDPOINTS.STATS);
  },

  // Courses
  async getCourses(): Promise<AdminCourse[]> {
    const response = await api.get<{ courses: AdminCourse[] }>(
      ADMIN_ENDPOINTS.COURSES
    );
    return response.courses;
  },

  async getCourse(id: number): Promise<AdminCourseDetail> {
    const response = await api.get<{ course: AdminCourseDetail }>(
      ADMIN_ENDPOINTS.COURSE(id)
    );
    return response.course;
  },

  async createCourse(data: CreateCourseRequest): Promise<AdminCourse> {
    const response = await api.post<{ course: AdminCourse }>(
      ADMIN_ENDPOINTS.COURSES,
      data
    );
    return response.course;
  },

  async updateCourse(
    id: number,
    data: UpdateCourseRequest
  ): Promise<AdminCourse> {
    const response = await api.put<{ course: AdminCourse }>(
      ADMIN_ENDPOINTS.COURSE(id),
      data
    );
    return response.course;
  },

  async deleteCourse(id: number): Promise<void> {
    await api.delete(ADMIN_ENDPOINTS.COURSE(id));
  },

  // Chapters
  async createChapter(
    courseId: number,
    data: CreateChapterRequest
  ): Promise<{ id: number; title: string; sortOrder: number }> {
    const response = await api.post<{
      chapter: { id: number; title: string; sortOrder: number };
    }>(ADMIN_ENDPOINTS.CHAPTERS(courseId), data);
    return response.chapter;
  },

  async updateChapter(
    id: number,
    data: UpdateChapterRequest
  ): Promise<{ id: number; title: string; sortOrder: number }> {
    const response = await api.put<{
      chapter: { id: number; title: string; sortOrder: number };
    }>(ADMIN_ENDPOINTS.CHAPTER(id), data);
    return response.chapter;
  },

  async deleteChapter(id: number): Promise<void> {
    await api.delete(ADMIN_ENDPOINTS.CHAPTER(id));
  },

  async reorderChapters(courseId: number, order: number[]): Promise<void> {
    await api.put(ADMIN_ENDPOINTS.REORDER_CHAPTERS(courseId), { order });
  },

  // Lessons
  async createLesson(
    chapterId: number,
    data: CreateLessonRequest
  ): Promise<{ id: number; title: string }> {
    const response = await api.post<{ lesson: { id: number; title: string } }>(
      ADMIN_ENDPOINTS.LESSONS(chapterId),
      data
    );
    return response.lesson;
  },

  async updateLesson(
    id: number,
    data: UpdateLessonRequest
  ): Promise<{ id: number; title: string }> {
    const response = await api.put<{ lesson: { id: number; title: string } }>(
      ADMIN_ENDPOINTS.LESSON(id),
      data
    );
    return response.lesson;
  },

  async deleteLesson(id: number): Promise<void> {
    await api.delete(ADMIN_ENDPOINTS.LESSON(id));
  },

  async reorderLessons(chapterId: number, order: number[]): Promise<void> {
    await api.put(ADMIN_ENDPOINTS.REORDER_LESSONS(chapterId), { order });
  },

  async getLessonUploadUrl(id: number): Promise<UploadUrlResponse> {
    return api.post<UploadUrlResponse>(ADMIN_ENDPOINTS.LESSON_UPLOAD_URL(id));
  },

  async getLessonStatus(id: number): Promise<{
    id: number;
    muxStatus: string | null;
    muxUploadId: string | null;
    playbackId: string | null;
    duration: number | null;
  }> {
    return api.get(`/admin/lessons/${id}/status`);
  },

  async getLessonSignedUrls(id: number): Promise<{
    playbackId: string;
    playbackToken: string;
    thumbnailUrl: string;
    playbackUrl: string;
  }> {
    return api.get(`/admin/lessons/${id}/signed-urls`);
  },

  // Enrollments
  async getEnrollments(params?: {
    courseId?: number;
    userId?: number;
  }): Promise<Enrollment[]> {
    const response = await api.get<{ enrollments: Enrollment[] }>(
      ADMIN_ENDPOINTS.ENROLLMENTS,
      params
    );
    return response.enrollments;
  },

  async createEnrollment(data: CreateEnrollmentRequest): Promise<Enrollment> {
    const response = await api.post<{ enrollment: Enrollment }>(
      ADMIN_ENDPOINTS.ENROLLMENTS,
      data
    );
    return response.enrollment;
  },

  async deleteEnrollment(id: number): Promise<void> {
    await api.delete(ADMIN_ENDPOINTS.ENROLLMENT(id));
  },

  // Users
  async getUsers(params?: PaginationParams): Promise<{
    users: AdminUser[];
    meta?: PaginatedResponse<AdminUser>["meta"];
  }> {
    const response = await api.get<
      PaginatedResponse<AdminUser> & { users?: AdminUser[] }
    >(
      ADMIN_ENDPOINTS.USERS,
      params as Record<string, string | number | boolean | undefined>
    );
    return {
      users: response.data || response.users || [],
      meta: response.meta,
    };
  },

  async getUser(id: number): Promise<AdminUser> {
    const response = await api.get<{ user: AdminUser }>(
      ADMIN_ENDPOINTS.USER(id)
    );
    return response.user;
  },

  async searchUsers(query: string): Promise<AdminUser[]> {
    const response = await api.get<{ users: AdminUser[] }>(
      ADMIN_ENDPOINTS.USER_SEARCH,
      { q: query }
    );
    return response.users;
  },

  async getUserViews(id: number): Promise<VideoView[]> {
    const response = await api.get<{ views: VideoView[] }>(
      ADMIN_ENDPOINTS.USER_VIEWS(id)
    );
    return response.views;
  },

  async setUserViewLimit(userId: number, lessonId: number, customLimit: number): Promise<void> {
    await api.post(ADMIN_ENDPOINTS.USER_VIEW_LIMIT(userId, lessonId), { customLimit });
  },

  async removeUserViewLimit(userId: number, lessonId: number): Promise<void> {
    await api.delete(ADMIN_ENDPOINTS.USER_VIEW_LIMIT(userId, lessonId));
  },

  // CMS
  async getCmsItems(): Promise<
    Array<{ key: string; content: Record<string, unknown> }>
  > {
    const response = await api.get<{
      items: Array<{ key: string; content: Record<string, unknown> }>;
    }>(ADMIN_ENDPOINTS.CMS);
    return response.items;
  },

  async getCmsItem(
    key: string
  ): Promise<{ key: string; content: Record<string, unknown> }> {
    const response = await api.get<{
      cms: { sectionKey: string; content: Record<string, unknown>; updatedAt: string };
    }>(ADMIN_ENDPOINTS.CMS_KEY(key));
    return {
      key: response.cms.sectionKey,
      content: response.cms.content,
    };
  },

  async createCmsItem(
    key: string,
    content: Record<string, unknown>
  ): Promise<void> {
    await api.post(ADMIN_ENDPOINTS.CMS, { sectionKey: key, content });
  },

  async updateCmsItem(
    key: string,
    content: Record<string, unknown>
  ): Promise<void> {
    await api.put(ADMIN_ENDPOINTS.CMS_KEY(key), { content });
  },

  async deleteCmsItem(key: string): Promise<void> {
    await api.delete(ADMIN_ENDPOINTS.CMS_KEY(key));
  },

  // Testimonials
  async getTestimonials(): Promise<
    Array<{
      id: number;
      name: string;
      designation: string | null;
      content: string;
      rating: number;
      image: string | null;
      sortOrder: number;
    }>
  > {
    const response = await api.get<{
      testimonials: Array<{
        id: number;
        name: string;
        designation: string | null;
        content: string;
        rating: number;
        image: string | null;
        sortOrder: number;
      }>;
    }>(ADMIN_ENDPOINTS.TESTIMONIALS);
    return response.testimonials;
  },

  async createTestimonial(data: {
    name: string;
    designation?: string;
    content: string;
    rating: number;
    image?: string;
  }): Promise<{ id: number }> {
    const response = await api.post<{ testimonial: { id: number } }>(
      ADMIN_ENDPOINTS.TESTIMONIALS,
      data
    );
    return response.testimonial;
  },

  async updateTestimonial(
    id: number,
    data: {
      name?: string;
      designation?: string;
      content?: string;
      rating?: number;
      image?: string;
    }
  ): Promise<void> {
    await api.put(ADMIN_ENDPOINTS.TESTIMONIAL(id), data);
  },

  async deleteTestimonial(id: number): Promise<void> {
    await api.delete(ADMIN_ENDPOINTS.TESTIMONIAL(id));
  },

  async reorderTestimonials(order: number[]): Promise<void> {
    await api.put(ADMIN_ENDPOINTS.REORDER_TESTIMONIALS, { order });
  },

  // Instructors
  async getInstructors(): Promise<
    Array<{
      id: number;
      name: string;
      title: string | null;
      bio: string | null;
      image: string | null;
      sortOrder: number;
    }>
  > {
    const response = await api.get<{
      instructors: Array<{
        id: number;
        name: string;
        title: string | null;
        bio: string | null;
        image: string | null;
        sortOrder: number;
      }>;
    }>(ADMIN_ENDPOINTS.INSTRUCTORS);
    return response.instructors;
  },

  async createInstructor(data: {
    name: string;
    title?: string;
    bio?: string;
    image?: string;
  }): Promise<{ id: number }> {
    const response = await api.post<{ instructor: { id: number } }>(
      ADMIN_ENDPOINTS.INSTRUCTORS,
      data
    );
    return response.instructor;
  },

  async updateInstructor(
    id: number,
    data: {
      name?: string;
      title?: string;
      bio?: string;
      image?: string;
    }
  ): Promise<void> {
    await api.put(ADMIN_ENDPOINTS.INSTRUCTOR(id), data);
  },

  async deleteInstructor(id: number): Promise<void> {
    await api.delete(ADMIN_ENDPOINTS.INSTRUCTOR(id));
  },

  async reorderInstructors(order: number[]): Promise<void> {
    await api.put(ADMIN_ENDPOINTS.REORDER_INSTRUCTORS, { order });
  },

  // File Uploads
  async uploadImage(
    file: File,
    folder: "thumbnails" | "avatars" | "images" = "images"
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"}${ADMIN_ENDPOINTS.UPLOAD_IMAGE}?folder=${folder}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    return response.json();
  },

  async uploadPdf(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("pdf", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"}${ADMIN_ENDPOINTS.UPLOAD_PDF}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload PDF");
    }

    return response.json();
  },

  async deleteFile(key: string): Promise<void> {
    await api.delete(`${ADMIN_ENDPOINTS.DELETE_UPLOAD}?key=${encodeURIComponent(key)}`);
  },
};

export default adminService;

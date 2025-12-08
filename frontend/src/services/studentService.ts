/**
 * Student Service
 * Handles all student-related API calls (requires authentication)
 */

import api from "@/lib/fetchConfig";
import type {
  MyCoursesResponse,
  MyCourseResponse,
  LessonResponse,
  ViewStatusResponse,
  EnrolledCourse,
  CourseWithProgress,
  LessonDetail,
  ViewStatus,
} from "@/types";

const STUDENT_ENDPOINTS = {
  MY_COURSES: "/my-courses",
  MY_COURSE: (slug: string) => `/my-courses/${slug}`,
  LESSON: (id: number) => `/lessons/${id}`,
  START_VIEW: (id: number) => `/lessons/${id}/view`,
  VIEW_STATUS: (id: number) => `/lessons/${id}/view-status`,
} as const;

export const studentService = {
  /**
   * Get all enrolled courses for current user
   */
  async getMyCourses(): Promise<EnrolledCourse[]> {
    const response = await api.get<MyCoursesResponse>(
      STUDENT_ENDPOINTS.MY_COURSES
    );
    return response.courses;
  },

  /**
   * Get a single enrolled course with progress
   */
  async getMyCourse(slug: string): Promise<CourseWithProgress> {
    const response = await api.get<MyCourseResponse>(
      STUDENT_ENDPOINTS.MY_COURSE(slug)
    );
    return response.course;
  },

  /**
   * Get lesson details with video access
   */
  async getLesson(id: number): Promise<LessonDetail> {
    const response = await api.get<LessonResponse>(
      STUDENT_ENDPOINTS.LESSON(id)
    );
    return response.lesson;
  },

  /**
   * Start watching a lesson (increment view count)
   */
  async startView(id: number): Promise<ViewStatus> {
    return api.post<ViewStatusResponse>(STUDENT_ENDPOINTS.START_VIEW(id));
  },

  /**
   * Get view status for a lesson
   */
  async getViewStatus(id: number): Promise<ViewStatus> {
    return api.get<ViewStatusResponse>(STUDENT_ENDPOINTS.VIEW_STATUS(id));
  },
};

export default studentService;

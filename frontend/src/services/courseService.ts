/**
 * Course Service
 * Handles all public course-related API calls
 */

import api from "@/lib/fetchConfig";
import type {
  CoursesResponse,
  CourseDetailResponse,
  CourseListItem,
  CourseDetail,
} from "@/types";

const COURSE_ENDPOINTS = {
  COURSES: "/courses",
  PUBLISHED_COURSES: "/courses/published",
  UPCOMING_COURSES: "/courses/upcoming",
  COURSE: (slug: string) => `/courses/${slug}`,
} as const;

export const courseService = {
  /**
   * Get all courses (published + upcoming)
   */
  async getCourses(): Promise<CourseListItem[]> {
    const response = await api.get<CoursesResponse>(COURSE_ENDPOINTS.COURSES);
    return response.courses;
  },

  /**
   * Get only published courses (not upcoming)
   */
  async getPublishedCourses(): Promise<CourseListItem[]> {
    const response = await api.get<CoursesResponse>(COURSE_ENDPOINTS.PUBLISHED_COURSES);
    return response.courses;
  },

  /**
   * Get only upcoming courses
   */
  async getUpcomingCourses(): Promise<CourseListItem[]> {
    const response = await api.get<CoursesResponse>(COURSE_ENDPOINTS.UPCOMING_COURSES);
    return response.courses;
  },

  /**
   * Get a single course by slug
   */
  async getCourse(slug: string): Promise<CourseDetail> {
    const response = await api.get<CourseDetailResponse>(
      COURSE_ENDPOINTS.COURSE(slug)
    );
    return response.course;
  },
};

export default courseService;


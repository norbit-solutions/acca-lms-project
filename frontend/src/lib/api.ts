import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const sessionToken = localStorage.getItem("sessionToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (sessionToken) {
      config.headers["X-Session-Token"] = sessionToken;
    }
  }
  return config;
});

// Handle session expired errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.code === "SESSION_INVALID") {
      // Clear auth and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("sessionToken");
        window.location.href = "/login?session_expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),
};

// Public API
export const publicApi = {
  getCourses: () => api.get("/courses"),
  getCourse: (slug: string) => api.get(`/courses/${slug}`),
  getCms: (section: string) => api.get(`/cms/${section}`),
};

// Student API
export const studentApi = {
  getMyCourses: () => api.get("/my-courses"),
  getMyCourse: (slug: string) => api.get(`/my-courses/${slug}`),
  getLesson: (id: number) => api.get(`/lessons/${id}`),
  startView: (id: number) => api.post(`/lessons/${id}/view`),
  getViewStatus: (id: number) => api.get(`/lessons/${id}/view-status`),
};

// Admin API
export const adminApi = {
  // Dashboard
  getStats: () => api.get("/admin/stats"),

  // Courses
  getCourses: () => api.get("/admin/courses"),
  getCourse: (id: number) => api.get(`/admin/courses/${id}`),
  createCourse: (data: {
    title: string;
    description?: string;
    thumbnail?: string;
    isPublished?: boolean;
  }) => api.post("/admin/courses", data),
  updateCourse: (
    id: number,
    data: {
      title?: string;
      description?: string;
      thumbnail?: string;
      isPublished?: boolean;
    }
  ) => api.put(`/admin/courses/${id}`, data),
  deleteCourse: (id: number) => api.delete(`/admin/courses/${id}`),

  // Chapters
  createChapter: (
    courseId: number,
    data: { title: string; sortOrder?: number }
  ) => api.post(`/admin/courses/${courseId}/chapters`, data),
  updateChapter: (id: number, data: { title?: string; sortOrder?: number }) =>
    api.put(`/admin/chapters/${id}`, data),
  deleteChapter: (id: number) => api.delete(`/admin/chapters/${id}`),
  reorderChapters: (courseId: number, order: number[]) =>
    api.post(`/admin/courses/${courseId}/chapters/reorder`, { order }),

  // Lessons
  createLesson: (
    chapterId: number,
    data: {
      title: string;
      sortOrder?: number;
      isFree?: boolean;
      maxViews?: number;
    }
  ) => api.post(`/admin/chapters/${chapterId}/lessons`, data),
  updateLesson: (
    id: number,
    data: {
      title?: string;
      sortOrder?: number;
      isFree?: boolean;
      maxViews?: number;
    }
  ) => api.put(`/admin/lessons/${id}`, data),
  deleteLesson: (id: number) => api.delete(`/admin/lessons/${id}`),
  getLessonUploadUrl: (id: number) =>
    api.post(`/admin/lessons/${id}/upload-url`),

  // Enrollments
  getEnrollments: (params?: { courseId?: number; userId?: number }) =>
    api.get("/admin/enrollments", { params }),
  createEnrollment: (data: {
    courseId: number;
    userId?: number;
    email?: string;
    phone?: string;
  }) => api.post("/admin/enrollments", data),
  deleteEnrollment: (id: number) => api.delete(`/admin/enrollments/${id}`),

  // Users
  getUsers: (params?: { page?: number; limit?: number }) =>
    api.get("/admin/users", { params }),
  searchUsers: (query: string) =>
    api.get("/admin/users/search", { params: { q: query } }),
  getUser: (id: number) => api.get(`/admin/users/${id}`),
};

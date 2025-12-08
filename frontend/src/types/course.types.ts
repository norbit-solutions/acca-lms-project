/**
 * Course Types
 */

// Course list item for public view
export interface CourseListItem {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  chaptersCount: number;
  lessonsCount: number;
  price: number | null;
  currency: string;
  isFree: boolean;
}

// Course detail for public view
export interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  price: number | null;
  currency: string;
  isFree: boolean;
  chapters: ChapterWithLessons[];
}

// Chapter with lessons
export interface ChapterWithLessons {
  id: number;
  title: string;
  sortOrder: number;
  lessons: LessonPreview[];
}

// Lesson preview (without video details)
export interface LessonPreview {
  id: number;
  title: string;
  sortOrder: number;
  duration: number | null;
  isFree: boolean;
}

// Enrolled course for student
export interface EnrolledCourse {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  chaptersCount: number;
  lessonsCount: number;
  completedLessons: number;
  progress: number;
  enrolledAt: string;
}

// Course with progress for student
export interface CourseWithProgress {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  chapters: ChapterWithProgress[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
}

// Chapter with progress
export interface ChapterWithProgress {
  id: number;
  title: string;
  sortOrder: number;
  lessons: LessonWithProgress[];
}

// Lesson with progress
export interface LessonWithProgress {
  id: number;
  title: string;
  sortOrder: number;
  duration: number | null;
  isFree: boolean;
  viewCount: number;
  maxViews: number;
  isCompleted: boolean;
  canWatch: boolean;
}

// Lesson detail with video access
export interface LessonDetail {
  id: number;
  title: string;
  duration: number | null;
  isFree: boolean;
  maxViews: number;
  viewCount: number;
  canWatch: boolean;
  playbackId: string | null;
  signedUrl: string | null;
  watermark: WatermarkData;
  chapter: {
    id: number;
    title: string;
  };
  course: {
    id: number;
    title: string;
    slug: string;
  };
}

// Watermark data
export interface WatermarkData {
  text: string;
  phone: string;
  timestamp: string;
}

// View status
export interface ViewStatus {
  lessonId: number;
  viewCount: number;
  maxViews: number;
  canWatch: boolean;
  remainingViews: number;
}

// Public courses response
export interface CoursesResponse {
  courses: CourseListItem[];
}

// Public course detail response
export interface CourseDetailResponse {
  course: CourseDetail;
}

// My courses response
export interface MyCoursesResponse {
  courses: EnrolledCourse[];
}

// My course detail response
export interface MyCourseResponse {
  course: CourseWithProgress;
}

// Lesson response
export interface LessonResponse {
  lesson: LessonDetail;
}

// View status response
export type ViewStatusResponse = ViewStatus;

/**
 * Dashboard Components - Barrel Export
 */

// Components
export { DashboardStats } from "../admin/components/dashboard/DashboardStats";
export { RecentLessons } from "./RecentLessons";
export { CoursesList } from "./CoursesList";
export { MyCoursesGrid } from "./components/my-courses/MyCoursesGrid";
export { EmptyCoursesState } from "./components/my-courses/EmptyCoursesState";

// Lesson Components
export { LessonLoadingSkeleton } from "./LessonLoadingSkeleton";
export { LessonError } from "./LessonError";
export { LessonAccessDenied } from "./LessonAccessDenied";
export { VideoUnavailable } from "./VideoUnavailable";
export { LessonInfo } from "./LessonInfo";
export { default as LessonPlayerClient } from "./LessonPlayerClient";

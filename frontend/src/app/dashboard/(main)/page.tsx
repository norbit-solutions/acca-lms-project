import { studentService } from "@/services";
import type { EnrolledCourse, RecentLesson } from "@/types";
import {
  DashboardHeader,
  DashboardStats,
  RecentlyWatched,
  YourCourses,
} from "@/components/dashboard/components/dashboard";

export default async function DashboardPage() {
  // Fetch data server-side
  let courses: EnrolledCourse[] = [];
  let recentLessons: RecentLesson[] = [];

  try {
    [courses, recentLessons] = await Promise.all([
      studentService.getMyCourses().catch(() => []),
      studentService.getRecentLessons().catch(() => []),
    ]);
  } catch (err) {
    console.log("Failed to fetch dashboard data:", err);
  }

  const totalLessons = courses.reduce((acc, c) => acc + c.lessonsCount, 0);
  const completedLessons = courses.reduce((acc, c) => acc + c.completedLessons, 0);
  const avgProgress = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
    : 0;

  return (
    <div className="w-full">
      <DashboardHeader />
      
      <DashboardStats
        coursesCount={courses.length}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
        avgProgress={avgProgress}
      />

      <RecentlyWatched recentLessons={recentLessons} />

      <YourCourses courses={courses} />
    </div>
  );
}

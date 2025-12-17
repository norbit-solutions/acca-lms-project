"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { studentService } from "@/services";
import type { EnrolledCourse, RecentLesson } from "@/types";

// Icons
const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

// Skeleton Loader Component
const LessonSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="h-40 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
    </div>
  </div>
);

// Format date helper
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [recentLessons, setRecentLessons] = useState<RecentLesson[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses for stats
        setIsLoadingCourses(true);
        const coursesData = await studentService.getMyCourses();
        setCourses(coursesData);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setIsLoadingCourses(false);
      }

      try {
        // Fetch recent lessons
        setIsLoadingLessons(true);
        const lessonsData = await studentService.getRecentLessons();
        setRecentLessons(lessonsData);
      } catch (err) {
        console.error("Failed to fetch recent lessons:", err);
        setError("Failed to load recent lessons");
      } finally {
        setIsLoadingLessons(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-slate-600 text-lg">
          Continue your learning journey where you left off.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
              <BookIcon />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Enrolled Courses</p>
          <p className="text-3xl font-bold text-slate-900">
            {isLoadingCourses ? "..." : courses.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
              <CheckCircleIcon />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Completed Lessons</p>
          <p className="text-3xl font-bold text-slate-900">
            {isLoadingCourses
              ? "..."
              : courses.reduce((acc, course) => acc + course.completedLessons, 0)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
              <ClockIcon />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Avg. Progress</p>
          <p className="text-3xl font-bold text-slate-900">
            {isLoadingCourses
              ? "..."
              : courses.length > 0
                ? Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)
                : 0}
            %
          </p>
        </div>
      </div>

      {/* Recently Watched Lessons Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-slate-900">Recently Watched</h2>
          <Link
            href="/dashboard/my-courses"
            className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            View all courses →
          </Link>
        </div>

        {isLoadingLessons ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LessonSkeleton />
            <LessonSkeleton />
            <LessonSkeleton />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : recentLessons.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PlayIcon />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Recently Watched Lessons</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Start watching lessons to see your recent activity here.
            </p>
            <Link
              href="/dashboard/my-courses"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              Browse My Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLessons.map((lesson) => (
              <Link
                key={`${lesson.lessonId}-${lesson.lastViewedAt}`}
                href={`/dashboard/courses/${lesson.courseSlug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
              >
                {/* Course Thumbnail Background */}
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  {lesson.courseThumbnail ? (
                    <img
                      src={lesson.courseThumbnail}
                      alt={lesson.courseTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <BookIcon />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Course Title on Image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-medium line-clamp-1">
                      {lesson.courseTitle}
                    </p>
                  </div>
                </div>

                {/* Lesson Info */}
                <div className="p-5">
                  <h3 className="font-bold text-base text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700 transition-colors">
                    {lesson.lessonTitle}
                  </h3>

                  <p className="text-sm text-slate-600 mb-3">
                    {lesson.chapterTitle}
                  </p>

                  {/* Watch Info */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <ClockIcon />
                      {formatDate(lesson.lastViewedAt)}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-slate-600">
                      <PlayIcon />
                      Continue
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { AdminCourseDetail } from "@/types";
import { BackIcon } from "@/lib/icons";

interface CourseDetailHeaderProps {
  course: AdminCourseDetail;
}

export default function CourseDetailHeader({ course }: CourseDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
      <div>
        <button
          onClick={() => router.push("/admin/courses")}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
            <BackIcon className="w-4 h-4" />
          </div>
          <span className="font-medium">Back to Courses</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          {course.title}
        </h1>
        <p className="text-slate-500 mt-1">
          {course.description || "No description provided"}
        </p>
      </div>
      <span
        className={`inline-flex items-center self-start px-3 py-1 rounded-full text-sm font-medium ${
          course.isPublished
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {course.isPublished ? "Published" : "Draft"}
      </span>
    </div>
  );
}

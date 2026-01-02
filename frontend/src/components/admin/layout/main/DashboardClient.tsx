import { CoursesIcon, EnrollmentsIcon, UsersIcon } from "@/lib";
import type { DashboardStats } from "@/types";
import Link from "next/link";


export default function DashboardClient({
  initialStats = null,
}: {
  initialStats?: DashboardStats | null;
}) {

  const statCards = [
    {
      title: "Total Courses",
      value: initialStats?.totalCourses || 0,
      icon: CoursesIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Students",
      value: initialStats?.totalStudents || 0,
      icon: UsersIcon,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Total Enrollments",
      value: initialStats?.totalEnrollments || 0,
      icon: EnrollmentsIcon,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-display font-bold text-slate-900 mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
                  <Icon />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-slate-900">
              Recent Enrollments
            </h2>
            <p className="text-sm text-slate-500">Latest student activity</p>
          </div>
          <Link
            href="/admin/enrollments"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            View all →
          </Link>
        </div>

        <div className="p-5">
          {initialStats?.recentEnrollments && initialStats.recentEnrollments.length > 0 ? (
            <div className="space-y-3">
              {initialStats.recentEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm shrink-0">
                    {enrollment.user.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {enrollment.user.fullName}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {enrollment.course.title}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-slate-500">
                      {new Date(enrollment.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                <EnrollmentsIcon />
              </div>
              <p className="text-slate-500 text-sm">No enrollments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

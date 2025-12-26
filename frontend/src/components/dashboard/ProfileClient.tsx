"use client";

import { useAuthStore } from "@/lib/store";
import type { EnrolledCourse } from "@/types";

// Icons
const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const BookIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

interface ProfileClientProps {
    courses: EnrolledCourse[];
}

export default function ProfileClient({ courses }: ProfileClientProps) {
    const { user } = useAuthStore();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const completedLessons = courses.reduce((acc, c) => acc + c.completedLessons, 0);
    const avgProgress = courses.length > 0
        ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
        : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
                    My Profile
                </h1>
                <p className="text-slate-600">
                    Manage your account information and view your learning progress
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {/* Header with Gradient */}
                <div className="h-32 bg-slate-100" />

                <div className="px-8 pb-8">
                    {/* Profile Picture */}
                    <div className="flex items-end gap-6 -mt-16 mb-6">
                        <div className="w-32 h-32 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white text-white">
                            <UserIcon />
                        </div>
                        <div className="pb-2">
                            <h2 className="text-2xl font-bold text-slate-900">{user?.fullName}</h2>
                            <p className="text-slate-600">Student</p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-600">
                                <EmailIcon />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Email Address</p>
                                <p className="font-medium text-slate-900">{user?.email}</p>
                            </div>
                        </div>

                        {user?.phone && (
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-600">
                                    <PhoneIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Phone Number</p>
                                    <p className="font-medium text-slate-900">{user.phone}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 rounded-xl">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 text-slate-600 border border-slate-200">
                                <BookIcon />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                {courses.length}
                            </p>
                            <p className="text-sm text-slate-600">Enrolled Courses</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 text-slate-600 border border-slate-200">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                {completedLessons}
                            </p>
                            <p className="text-sm text-slate-600">Lessons Completed</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 text-slate-600 border border-slate-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                {avgProgress}%
                            </p>
                            <p className="text-sm text-slate-600">Avg. Progress</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Enrollments */}
            {courses.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Enrollments</h3>
                    <div className="space-y-4">
                        {courses
                            .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
                            .slice(0, 5)
                            .map((course) => (
                                <div
                                    key={course.id}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 border border-slate-200">
                                            <BookIcon />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{course.title}</p>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                <CalendarIcon />
                                                <span>Enrolled {formatDate(course.enrolledAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-slate-900">{Math.round(course.progress)}%</p>
                                        <p className="text-xs text-slate-500">Progress</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Need Help?</h3>
                <p className="text-slate-600 mb-6">
                    If you have any questions or need support, feel free to reach out to us via WhatsApp.
                </p>
                <a
                    href="https://wa.me/94XXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Contact Support
                </a>
            </div>
        </div>
    );
}

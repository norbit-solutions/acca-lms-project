"use client";

import { useSocialSafe } from "@/context/SocialContext";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { formatDateString, getInitials } from "@/lib";
import type { EnrolledCourse } from "@/types";

interface ProfileClientProps {
    courses: EnrolledCourse[];
}

export default function ProfileClient({ courses }: ProfileClientProps) {
    const { user } = useAuthStore();
    const { whatsappNumber } = useSocialSafe();

    const completedLessons = courses.reduce((acc, c) => acc + c.completedLessons, 0);
    const totalLessons = courses.reduce((acc, c) => acc + c.lessonsCount, 0);
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Profile Card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-8">
                {/* Header Background */}
                <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-700" />
                
                {/* Profile Info */}
                <div className="px-6 pb-6">
                    {/* Avatar - Overlapping header */}
                    <div className="-mt-12 mb-4">
                        <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white text-3xl font-medium border-4 border-white shadow-lg">
                            {user?.fullName ? getInitials(user.fullName) : "?"}
                        </div>
                    </div>
                    
                    {/* Name & Email */}
                    <div className="mb-6">
                        <h1 className="text-xl md:text-2xl font-semibold text-black">
                            {user?.fullName}
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base">{user?.email}</p>
                        {user?.phone && (
                            <p className="text-gray-400 text-sm mt-1">{user.phone}</p>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                        <div className="bg-gray-50 rounded-xl p-3 md:p-4 text-center">
                            <p className="text-2xl md:text-3xl font-light text-black">{courses.length}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Courses</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 md:p-4 text-center">
                            <p className="text-2xl md:text-3xl font-light text-black">{completedLessons}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Completed</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 md:p-4 text-center">
                            <p className="text-2xl md:text-3xl font-light text-black">{overallProgress}%</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Progress</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrolled Courses */}
            {courses.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4 px-1">
                        Your Courses
                    </h2>
                    <div className="space-y-3">
                        {courses
                            .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
                            .map((course) => {
                                const isCompleted = course.progress === 100;
                                return (
                                    <Link
                                        key={course.id}
                                        href={`/dashboard/courses/${course.slug}`}
                                        className="block bg-white border border-gray-200 rounded-xl p-4 md:p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-black group-hover:underline truncate">
                                                    {course.title}
                                                </h3>
                                                <p className="text-xs md:text-sm text-gray-400 mt-1">
                                                    Enrolled {formatDateString(course.enrolledAt, { month: "short", day: "numeric", year: "numeric" })}
                                                </p>
                                            </div>
                                            <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                                                isCompleted 
                                                    ? "bg-green-100 text-green-700" 
                                                    : "bg-gray-100 text-gray-700"
                                            }`}>
                                                {isCompleted ? "Completed" : `${Math.round(course.progress)}%`}
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${
                                                    isCompleted ? "bg-green-500" : "bg-black"
                                                }`}
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {courses.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-black mb-2">No courses yet</h3>
                    <p className="text-gray-500 text-sm mb-4">Start learning by enrolling in a course</p>
                    <Link
                        href="/courses"
                        className="inline-block bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Browse Courses
                    </Link>
                </div>
            )}

            {/* Help Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="font-medium text-black mb-1">Need help?</h3>
                        <p className="text-sm text-gray-500">
                            Contact us via WhatsApp for support
                        </p>
                    </div>
                    <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shrink-0"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp Support
                    </a>
                </div>
            </div>
        </div>
    );
}

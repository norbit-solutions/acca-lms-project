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

    return (
        <div className="w-full">
            {/* Profile Header */}
            <div className="mb-12">
                <div className="flex items-center gap-6 mb-8">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-2xl font-medium">
                        {user?.fullName ? getInitials(user.fullName) : "?"}
                    </div>
                    <div>
                        <h1 className="text-2xl font-medium text-black mb-1">
                            {user?.fullName}
                        </h1>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex gap-12 py-6 border-t border-b border-gray-200">
                    <div>
                        <p className="text-3xl font-light text-black">{courses.length}</p>
                        <p className="text-sm text-gray-500 mt-1">Courses</p>
                    </div>
                    <div>
                        <p className="text-3xl font-light text-black">{completedLessons}/{totalLessons}</p>
                        <p className="text-sm text-gray-500 mt-1">Lessons</p>
                    </div>
                    {user?.phone && (
                        <div>
                            <p className="text-lg font-light text-black">{user.phone}</p>
                            <p className="text-sm text-gray-500 mt-1">Phone</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Enrolled Courses */}
            {courses.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-6">
                        Your Courses
                    </h2>
                    <div className="space-y-4">
                        {courses
                            .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
                            .map((course) => (
                                <Link
                                    key={course.id}
                                    href={`/dashboard/courses/${course.slug}`}
                                    className="block p-5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-black group-hover:underline">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Enrolled {formatDateString(course.enrolledAt, { month: "short", day: "numeric", year: "numeric" })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-light text-black">
                                                {Math.round(course.progress)}%
                                            </p>
                                            <p className="text-xs text-gray-400">progress</p>
                                        </div>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-black rounded-full transition-all"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                    Need help? Contact us via WhatsApp for support.
                </p>
                <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    Contact Support
                </a>
            </div>
        </div>
    );
}

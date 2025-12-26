import Link from "next/link";
import { studentService } from "@/services";
import type { EnrolledCourse } from "@/types";

// Icons
const BookIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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

export default async function MyCoursesPage() {
    // Fetch courses server-side
    let courses: EnrolledCourse[] = [];
    let error: string | null = null;

    try {
        courses = await studentService.getMyCourses();
    } catch (err) {
        console.error("Failed to fetch courses:", err);
        error = "Failed to load courses";
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-2">
                    My Courses
                </h1>
                <p className="text-slate-600 text-lg">
                    All your enrolled courses in one place.
                </p>
            </div>

            {/* Courses Grid */}
            {error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookIcon />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Courses Yet</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        You haven&apos;t been enrolled in any courses yet. Contact us via WhatsApp to request enrollment.
                    </p>
                    <a
                        href="https://wa.me/94XXXXXXXXX"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                    >
                        Contact via WhatsApp
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/dashboard/courses/${course.slug}`}
                            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                        >
                            {/* Course Thumbnail */}
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                {course.thumbnail ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <BookIcon />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                                    {Math.round(course.progress)}% Complete
                                </div>
                            </div>

                            {/* Course Info */}
                            <div className="p-6">
                                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                    {course.description || "No description available"}
                                </p>

                                {/* Progress */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                                        <span>
                                            {course.completedLessons} / {course.lessonsCount} lessons
                                        </span>
                                        <span className="font-medium text-slate-900">{Math.round(course.progress)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-slate-900 rounded-full transition-all duration-500"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Continue Button */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="flex items-center gap-2 text-sm text-slate-500">
                                        <PlayIcon />
                                        Continue Learning
                                    </span>
                                    <ArrowRightIcon />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

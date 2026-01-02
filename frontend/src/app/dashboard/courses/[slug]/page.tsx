import Link from "next/link";
import { studentService } from "@/services";
import CourseDetailClient from "@/components/dashboard/components/courses/CourseDetailClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch course server-side
    let course = null;
    let error: string | null = null;

    try {
        course = await studentService.getMyCourse(slug);
    } catch (err) {
        console.log("Failed to fetch course:", err);
        error = "Failed to load course";
    }

    if (error || !course) {
        return (
            <div className="w-full">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                    <p className="text-red-600 font-medium">{error || "Course not found"}</p>
                    <Link
                        href="/dashboard"
                        className="inline-block mt-4 text-violet-600 hover:text-violet-700 font-medium"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return <CourseDetailClient course={course} slug={slug} />;
}

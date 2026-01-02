import { studentService } from "@/services";
import type { EnrolledCourse } from "@/types";
import { MyCoursesGrid, EmptyCoursesState } from "@/components/dashboard";

export default async function MyCoursesPage() {
    // Fetch courses server-side
    let courses: EnrolledCourse[] = [];
    let error: string | null = null;

    try {
        courses = await studentService.getMyCourses();
    } catch (err) {
        console.log("Failed to fetch courses:", err);
        error = "Failed to load courses";
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-black mb-2">
                    Courses
                </h1>
                <p className="text-gray-500 max-w-2xl">
                    Unlock your learning potential with our comprehensive courses. Elevate your skills,
                    track your progress, and achieve your certification goals.
                </p>
            </div>

            {error ? (
                <div className="border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-600">{error}</p>
                </div>
            ) : courses.length === 0 ? (
                <EmptyCoursesState />
            ) : (
                <MyCoursesGrid courses={courses} />
            )}
        </div>
    );
}

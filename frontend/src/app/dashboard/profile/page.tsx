import { studentService } from "@/services";
import type { EnrolledCourse } from "@/types";
import ProfileClient from "@/components/dashboard/ProfileClient";

export default async function ProfilePage() {
    // Fetch courses server-side
    let courses: EnrolledCourse[] = [];

    try {
        courses = await studentService.getMyCourses();
    } catch (err) {
        console.error("Failed to fetch courses:", err);
    }

    return <ProfileClient courses={courses} />;
}

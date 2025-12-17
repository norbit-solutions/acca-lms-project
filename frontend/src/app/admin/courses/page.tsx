import CoursesClient from "@/components/admin/CoursesClient";
import { adminService } from "@/services/adminService";
export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await adminService.getCourses();

  return <CoursesClient initialCourses={courses} />
}

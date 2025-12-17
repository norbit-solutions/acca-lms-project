import EnrollmentsClient from "@/components/admin/EnrollmentsClient";
import { adminService } from "@/services/adminService";

export const dynamic = "force-dynamic";

export default async function EnrollmentsPage() {
  const [enrollments, courses] = await Promise.all([
    adminService.getEnrollments(),
    adminService.getCourses(),
  ]);

  return (
    <EnrollmentsClient
      initialEnrollments={enrollments}
      initialCourses={courses}
    />
  );
}

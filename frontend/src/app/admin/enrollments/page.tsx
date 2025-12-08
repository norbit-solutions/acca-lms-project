import EnrollmentsClient from "@/components/admin/EnrollmentsClient";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export default async function EnrollmentsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const [enrollmentsRes, coursesRes] = await Promise.all([
      fetch(`${API_URL}/admin/enrollments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
      }),
      fetch(`${API_URL}/admin/courses`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
      }),
    ]);

    const enrollmentsData = await enrollmentsRes.json();
    const coursesData = await coursesRes.json();

    const enrollments = enrollmentsData?.enrollments || enrollmentsData || [];
    const courses = coursesData?.courses || [];

    return (
      <EnrollmentsClient
        initialEnrollments={enrollments}
        initialCourses={courses}
      />
    );
  } catch {
    return <EnrollmentsClient initialEnrollments={[]} initialCourses={[]} />;
  }
}

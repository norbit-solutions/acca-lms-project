import CoursesClient from "@/components/admin/CoursesClient";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export default async function CoursesPage() {
  // Read token from cookie (set by backend during login)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Fetch initial courses server-side and pass as prop to client component
  try {
    const res = await fetch(`${API_URL}/admin/courses`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });
    const data = await res.json();
    const courses = data?.courses || [];
    return <CoursesClient initialCourses={courses} />;
  } catch {
    // Fallback: render client component without initial data
    return <CoursesClient initialCourses={[]} />;
  }
}

import { notFound } from "next/navigation";
import CourseDetailClient from "@/components/admin/CourseDetailClient";
import { adminService } from "@/services";

export const dynamic = "force-dynamic";



interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const courseId = parseInt(id, 10);

  if (isNaN(courseId)) {
    notFound();
  }

  const course = await adminService.getCourse(courseId);

  // console.log(course);,

  if (!course) {
    notFound();
  }

  return <CourseDetailClient initialCourse={course} />;
}

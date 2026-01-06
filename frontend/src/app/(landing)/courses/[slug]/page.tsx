import CourseNavbar from "@/components/landing/course/CourseNavbar";
import {
  CourseCurriculum,
  CourseHero,
} from "@/components/landing/course";
import CTASection from "@/components/landing/CTASection";
import { courseService } from "@/services";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const course = await courseService.getCourse(slug);
    return {
      title: `${course.title} - Learnspire`,
      description: course.description || undefined,
    };
  } catch {
    return {
      title: "Course Not Found - Learnspire",
    };
  }
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  let course;
  try {
    course = await courseService.getCourse(slug);
  } catch (error) {
    console.log("Failed to fetch course:", error);
    notFound();
  }

  if (!course) {
    notFound();
  }

  const chapters = course.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration || 0,
      isFree: lesson.isFree || false,
    })),
  }));

  return (
    <div className="min-h-screen bg-off-white">
      <CourseNavbar />

      <CourseHero
        title={course.title}
        image={course.thumbnail || ""}
        courseFee={course.price || 0}
        feeCurrency={course.currency}
        courseSlug={course.slug}
      />

      {/* Curriculum Section */}
      <div className="max-w-7xl mx-auto w-full py-12 px-6">
        <CourseCurriculum
          chapters={chapters}
          description={course.description || ""}
        />
      </div>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

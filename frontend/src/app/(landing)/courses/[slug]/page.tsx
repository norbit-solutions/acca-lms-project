import CourseNavbar from "@/components/CourseNavbar";
import {
  CourseCurriculum,
  CourseHero,
  CourseSidebar,
} from "@/components/course";
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

  // Transform chapters to match component expectations
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

  // This would come from auth state in a real app
  const enrolled = false;

  return (
    <div className="min-h-screen bg-off-white">
      <CourseNavbar />

      <CourseHero
        title={course.title}
        shortIntroduction={course.description || ""}
        image={course.thumbnail || ""}
        courseFee={course.price || 0}
        feeCurrency={course.currency || "USD"}
        enableManualPayment={true}
        whatsappNumber=""
        enrolled={enrolled}
        courseSlug={course.slug}
      />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <CourseCurriculum
          chapters={chapters}
          description={course.description || ""}
          shortIntroduction={course.description || ""}
        />

        <CourseSidebar
          enrolled={enrolled}
          enableManualPayment={true}
          whatsappNumber=""
          title={course.title}
        />
      </div>
    </div>
  );
}

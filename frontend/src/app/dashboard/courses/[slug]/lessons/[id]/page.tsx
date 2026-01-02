import { studentService } from "@/services";
import {
    LessonError,
} from "@/components/dashboard";
import LessonPlayerClient from "@/components/dashboard/LessonPlayerClient";

interface PageProps {
    params: Promise<{ slug: string; id: string }>;
}

export default async function LessonPlayerPage({ params }: PageProps) {
    const { slug, id } = await params;
    const lessonId = parseInt(id);

    // Fetch lesson server-side
    let lesson = null;
    let error: string | null = null;

    try {
        lesson = await studentService.getLesson(lessonId);
    } catch (err) {
        console.log("Failed to fetch lesson:", err);
        error = "Failed to load lesson";
    }

    // Error state
    if (error || !lesson) {
        return <LessonError error={error} slug={slug} />;
    }

    return <LessonPlayerClient lesson={lesson} slug={slug} />;
}


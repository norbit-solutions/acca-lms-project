import InstructorsClient from "@/components/admin/layout/contents/InstructorsClient";
import { adminService } from "@/services";

export const dynamic = "force-dynamic";

interface Instructor {
    id: number;
    name: string;
    title: string | null;
    bio: string | null;
    image: string | null;
    sortOrder: number;
}

export default async function InstructorsPage() {
    let instructors: Instructor[] = [];

    try {
        instructors = await adminService.getInstructors();
    } catch {
        // Failed to load instructors
    }

    return <InstructorsClient initialInstructors={instructors} />;
}

import TestimonialsClient from "@/components/admin/layout/contents/TestimonialsClient";
import { adminService } from "@/services";

export const dynamic = "force-dynamic";

interface Testimonial {
    id: number;
    name: string;
    designation: string | null;
    content: string;
    rating: number;
    image: string | null;
    sortOrder: number;
}

export default async function TestimonialsPage() {
    let testimonials: Testimonial[] = [];

    try {
        testimonials = await adminService.getTestimonials();
    } catch {
    }

    return <TestimonialsClient initialTestimonials={testimonials} />;
}

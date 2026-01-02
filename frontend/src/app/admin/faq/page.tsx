import FAQClient from "@/components/admin/layout/contents/FAQClient";
import { adminService } from "@/services";

export const dynamic = "force-dynamic";

interface FAQItem {
    question: string;
    answer: string;
}

export default async function FAQPage() {
    let faqs: FAQItem[] = [];

    try {
        const data = await adminService.getCmsItem("faq");
        if (data && data.content && Array.isArray(data.content.items)) {
            faqs = data.content.items as FAQItem[];
        }
    } catch {
        // CMS item doesn't exist yet
    }

    return <FAQClient initialFaqs={faqs} />;
}

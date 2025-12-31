import WhyAccaClient from "@/components/admin/WhyAccaClient";
import { adminService } from "@/services";

export const dynamic = "force-dynamic";

interface WhyItem {
    title: string;
    description: string;
    icon: string;
}

interface WhyContent {
    headline: string;
    subheadline: string;
    items: WhyItem[];
}

const defaultContent: WhyContent = {
    headline: "Why Choose Learnspire?",
    subheadline: "The benefits of learning with us",
    items: [],
};

export default async function WhyAccaPage() {
    let content: WhyContent = defaultContent;

    try {
        const data = await adminService.getCmsItem("why-acca");
        if (data && data.content) {
            content = {
                ...defaultContent,
                ...(data.content as unknown as Partial<WhyContent>),
            };
        }
    } catch {
    }

    return <WhyAccaClient initialContent={content} />;
}

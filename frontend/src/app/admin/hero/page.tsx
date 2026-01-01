import HeroCmsClient from "@/components/admin/HeroCmsClient";
import { adminService } from "@/services";

export const dynamic = "force-dynamic";

interface HeroContent {
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    ctaLink?: string;
    trustedByText?: string;
    heroImage?: string;
    floatingCardTitle?: string;
    floatingCardSubtitle?: string;
}

const defaultContent: HeroContent = {
    headline: "Launch your Learning Journey | with Confidence",
    subheadline: "Learnspire is a premium learning platform that lets you master your exams with secure video streaming, mentor support, and tracked progress.",
    ctaText: "View Courses",
    ctaLink: "#all-courses",
    trustedByText: "Trusted by 2000+ Students",
    floatingCardTitle: "Live Classes",
    floatingCardSubtitle: "Strategic Business Leader",
};

export default async function HeroCmsPage() {
    let content = {
        sectionKey: "hero",
        content: defaultContent
    };

    try {
        const data = await adminService.getCmsItem("hero");
        if (data && data.content) {
            content = {
                sectionKey: "hero",
                content: {
                    ...defaultContent,
                    ...(data.content as unknown as Partial<HeroContent>),
                },
            };
        }
    } catch {
        // use default
    }

    return <HeroCmsClient initialContent={content} />;
}

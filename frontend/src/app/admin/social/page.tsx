import SocialLinksClient from "@/components/admin/layout/contents/SocialLinksClient";
import { adminService } from "@/services";

export const dynamic = "force-dynamic";

interface SocialLinks {
    whatsapp: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    youtube: string;
}

const defaultLinks: SocialLinks = {
    whatsapp: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
};

export default async function SocialLinksPage() {
    let links: SocialLinks = defaultLinks;

    try {
        const data = await adminService.getCmsItem("social");
        if (data && data.content) {
            links = { ...defaultLinks, ...data.content as unknown as Partial<SocialLinks> };
        }
    } catch {

    }

    return <SocialLinksClient initialLinks={links} />;
}

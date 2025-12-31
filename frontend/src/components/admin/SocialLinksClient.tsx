"use client";

import { useState } from "react";
import { adminService } from "@/services";
import { useModal } from "./ModalProvider";

interface SocialLinks {
    whatsapp: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    youtube: string;
}

interface SocialLinksClientProps {
    initialLinks: SocialLinks;
}

export default function SocialLinksClient({ initialLinks }: SocialLinksClientProps) {
    const { showError, showSuccess } = useModal();
    const [links, setLinks] = useState<SocialLinks>(initialLinks);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminService.createCmsItem("social", links as unknown as Record<string, unknown>);
            showSuccess("Social links saved successfully!");
        } catch (error) {
            console.log("Failed to save:", error);
            showError("Failed to save social links");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Social Links</h1>
                <p className="text-slate-500">Manage your social media and contact links</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
                    <input
                        type="text"
                        value={links.whatsapp}
                        onChange={(e) => setLinks({ ...links, whatsapp: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                        placeholder="+91 9876543210"
                    />
                    <p className="text-xs text-slate-500 mt-1">Include country code</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Facebook</label>
                    <input
                        type="url"
                        value={links.facebook}
                        onChange={(e) => setLinks({ ...links, facebook: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                        placeholder="https://facebook.com/yourpage"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Instagram</label>
                    <input
                        type="url"
                        value={links.instagram}
                        onChange={(e) => setLinks({ ...links, instagram: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                        placeholder="https://instagram.com/yourhandle"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
                    <input
                        type="url"
                        value={links.linkedin}
                        onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                        placeholder="https://linkedin.com/company/yourcompany"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Twitter / X</label>
                    <input
                        type="url"
                        value={links.twitter}
                        onChange={(e) => setLinks({ ...links, twitter: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                        placeholder="https://twitter.com/yourhandle"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">YouTube</label>
                    <input
                        type="url"
                        value={links.youtube}
                        onChange={(e) => setLinks({ ...links, youtube: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                        placeholder="https://youtube.com/@yourchannel"
                    />
                </div>

                <div className="pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

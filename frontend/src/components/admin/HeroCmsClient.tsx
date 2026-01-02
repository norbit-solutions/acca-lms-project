"use client";

import { adminService } from "@/services";
import { useState, useRef } from "react";
import { showError, showSuccess } from "@/lib/toast";

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

interface HeroCmsClientProps {
  initialContent: {
    sectionKey: string;
    content: HeroContent;
  } | null;
}

export default function HeroCmsClient({ initialContent }: HeroCmsClientProps) {

  const [content, setContent] = useState<HeroContent>(initialContent?.content || {});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveContent = async (newContent: HeroContent) => {
    setSaving(true);
    try {
      await adminService.createCmsItem(
        "hero",
        newContent as unknown as Record<string, unknown>
      );
      setContent(newContent);
      showSuccess("Hero section updated successfully!");
    } catch (error) {
      console.log("Failed to save:", error);
      showError("Failed to save hero section");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveContent(content);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showError("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const result = await adminService.uploadImage(file, "images");
      const newContent = { ...content, heroImage: result.url };
      setContent(newContent);
      // Auto-save after upload
      await adminService.createCmsItem(
        "hero",
        newContent as unknown as Record<string, unknown>
      );
      showSuccess("Image uploaded and saved!");
    } catch (error) {
      console.log("Failed to upload image:", error);
      showError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    if (content.heroImage) {
      try {
        await adminService.deleteFile(content.heroImage);
      } catch (error) {
        console.log("Failed to delete image from bucket:", error);
      }
    }
    const newContent = { ...content, heroImage: "" };
    setContent(newContent);
    await saveContent(newContent);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Hero Section</h1>
        <p className="text-slate-500">
          Manage the main landing page hero content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Text Content */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
            Main Content
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Headline
            </label>
            <input
              type="text"
              value={content.headline || ""}
              onChange={(e) => setContent({ ...content, headline: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              placeholder="e.g. Launch your Learning Journey | with Confidence"
            />
            <p className="text-xs text-slate-500 mt-1">Use | to separate regular text from styled text</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subheadline
            </label>
            <textarea
              value={content.subheadline || ""}
              onChange={(e) => setContent({ ...content, subheadline: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              rows={3}
              placeholder="Enter subheadline text..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Trusted By Text
            </label>
            <input
              type="text"
              value={content.trustedByText || ""}
              onChange={(e) => setContent({ ...content, trustedByText: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              placeholder="e.g. Trusted by 2000+ Students"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
            Call to Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={content.ctaText || ""}
                onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. View Courses"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Button Link
              </label>
              <input
                type="text"
                value={content.ctaLink || ""}
                onChange={(e) => setContent({ ...content, ctaLink: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. #all-courses"
              />
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
            Hero Image
          </h2>

          {content.heroImage ? (
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.heroImage}
                alt="Hero Preview"
                className="w-full h-64 object-cover rounded-xl border border-slate-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-slate-400 transition-colors bg-slate-50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="hero-image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="hero-image-upload"
                className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-sm text-slate-500">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-base font-medium text-slate-900">Click to upload image</span>
                    <span className="text-sm text-slate-500 mt-1">Recommended: 1920x1080px (Landscape)</span>
                  </div>
                )}
              </label>
            </div>
          )}
        </div>

        {/* Floating Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
            Floating Card Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Card Title (Top)
              </label>
              <input
                type="text"
                value={content.floatingCardTitle || ""}
                onChange={(e) => setContent({ ...content, floatingCardTitle: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. Live Classes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Card Subtitle (Bottom)
              </label>
              <input
                type="text"
                value={content.floatingCardSubtitle || ""}
                onChange={(e) => setContent({ ...content, floatingCardSubtitle: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. Strategic Business Leader"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 shadow-lg transform active:scale-95 transition-all"
          >
            {saving ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

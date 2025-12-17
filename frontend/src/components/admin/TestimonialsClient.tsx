"use client";

import { useEffect, useState, useRef } from "react";
import { adminService } from "@/services";
import { useModal } from "./ModalProvider";

interface Testimonial {
    id: number;
    name: string;
    content: string;
    image: string | null;
    isActive: boolean;
    sortOrder: number;
}

export default function TestimonialsClient() {
    const { showError, showConfirm } = useModal();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        content: "",
        image: "",
        isActive: true,
    });

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            const data = await adminService.getTestimonials();

            console.log('data::', data);
            setTestimonials(data as unknown as Testimonial[]);
        } catch (error) {
            console.error("Failed to load testimonials:", error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
            showError("Please select a valid image file (JPG, PNG, WebP, or GIF)");
            return;
        }

        // Validate file size (5MB max)
        // if (file.size > 5 * 1024 * 1024) {
        //     alert("Image must be less than 5MB");
        //     return;
        // }

        setUploading(true);
        try {
            const result = await adminService.uploadImage(file, "avatars");
            setFormData({ ...formData, image: result.url });
        } catch (error) {
            console.error("Failed to upload image:", error);
            showError("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editing) {
                await adminService.updateTestimonial(editing.id, {
                    name: formData.name,
                    content: formData.content,
                    image: formData.image || undefined,
                });
            } else {
                await adminService.createTestimonial({
                    name: formData.name,
                    content: formData.content,
                    image: formData.image || undefined,
                    rating: 5,
                });
            }
            setShowModal(false);
            setEditing(null);
            setFormData({ name: "", content: "", image: "", isActive: true });
            loadTestimonials();
        } catch (error) {
            console.error("Failed to save testimonial:", error);
            showError("Failed to save testimonial");
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditing(testimonial);
        setFormData({
            name: testimonial.name,
            content: testimonial.content,
            image: testimonial.image || "",
            isActive: testimonial.isActive,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        const confirmed = await showConfirm({
            title: "Delete Testimonial",
            message: "Are you sure you want to delete this testimonial?",
            confirmText: "Delete",
            variant: "danger",
        });
        if (!confirmed) return;
        try {
            await adminService.deleteTestimonial(id);
            loadTestimonials();
        } catch (error) {
            console.error("Failed to delete testimonial:", error);
            showError("Failed to delete testimonial");
        }
    };

    const openNewModal = () => {
        setEditing(null);
        setFormData({ name: "", content: "", image: "", isActive: true });
        setShowModal(true);
    };

    const removeImage = () => {
        setFormData({ ...formData, image: "" });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
                    <p className="text-slate-500">Manage student testimonials for the landing page</p>
                </div>
                <button
                    onClick={openNewModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Add Testimonial
                </button>
            </div>

            {/* Testimonials Grid */}
            {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                {testimonial.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900">{testimonial.name}</h3>
                                    <p className="text-slate-600 mt-2 text-sm line-clamp-3">
                                        &quot;{testimonial.content}&quot;
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => handleEdit(testimonial)}
                                    className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(testimonial.id)}
                                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No testimonials yet</h3>
                    <p className="text-slate-500 mb-4">Add your first student testimonial</p>
                    <button
                        onClick={openNewModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Add Testimonial
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {editing ? "Edit Testimonial" : "Add Testimonial"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Student name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Testimonial</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        rows={4}
                                        placeholder="What did the student say?"
                                        required
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Avatar (optional)</label>

                                    {formData.image ? (
                                        <div className="flex items-center gap-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-600 truncate max-w-[200px]">
                                                    {formData.image.split('/').pop()}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="text-sm text-red-600 hover:text-red-700 font-medium mt-1"
                                                >
                                                    Remove image
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/gif"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="avatar-upload"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="avatar-upload"
                                                className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {uploading ? (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                                        <span className="text-sm text-slate-500">Uploading...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <svg className="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-sm text-slate-600 font-medium">Click to upload image</span>
                                                        <span className="text-xs text-slate-400 block mt-1">JPG, PNG, WebP, GIF (max 5MB)</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editing ? "Save Changes" : "Add Testimonial"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

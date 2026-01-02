"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/services";
import { showError } from "@/lib/toast";
import { useConfirm } from "@/components/ConfirmProvider";
import Modal from "@/components/modals/Modal";

interface Testimonial {
    id: number;
    name: string;
    designation: string | null;
    content: string;
    rating: number;
    image: string | null;
    sortOrder: number;
}

interface TestimonialsClientProps {
    initialTestimonials: Testimonial[];
}

export default function TestimonialsClient({ initialTestimonials }: TestimonialsClientProps) {
    const router = useRouter();
    const { showConfirm } = useConfirm();
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Form data state
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        content: "",
    });
    
    // Separate state for image handling
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string>("");
    const [imageRemoved, setImageRemoved] = useState(false);
    
    // Local preview URL for pending file
    const localPreviewUrl = useMemo(() => {
        if (pendingFile) {
            return URL.createObjectURL(pendingFile);
        }
        return null;
    }, [pendingFile]);
    
    // Cleanup object URL on unmount or when file changes
    useEffect(() => {
        return () => {
            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl);
            }
        };
    }, [localPreviewUrl]);

    useEffect(() => {
        setTestimonials(initialTestimonials);
    }, [initialTestimonials]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
            showError("Please select a valid image file (JPG, PNG, WebP, or GIF)");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError("Image must be less than 5MB");
            return;
        }

        setPendingFile(file);
        setImageRemoved(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            let finalImageUrl: string | undefined = undefined;
            
            // If editing and image was removed (and not replaced), delete the old image
            if (editing && imageRemoved && existingImageUrl && !pendingFile) {
                try {
                    await adminService.deleteFile(existingImageUrl);
                } catch (error) {
                    console.log("Failed to delete old image from bucket:", error);
                }
            }
            
            // If there's a pending file, upload it now
            if (pendingFile) {
                // If editing and there was an old image, delete it first
                if (editing && existingImageUrl) {
                    try {
                        await adminService.deleteFile(existingImageUrl);
                    } catch (error) {
                        console.log("Failed to delete old image from bucket:", error);
                    }
                }
                
                const result = await adminService.uploadImage(pendingFile, "avatars");
                if (result && result.url) {
                    finalImageUrl = result.url;
                } else {
                    showError("Failed to upload image");
                    setSaving(false);
                    return;
                }
            } else if (!imageRemoved && existingImageUrl) {
                finalImageUrl = existingImageUrl;
            }
            
            if (editing) {
                await adminService.updateTestimonial(editing.id, {
                    name: formData.name,
                    content: formData.content,
                    image: finalImageUrl,
                });
            } else {
                await adminService.createTestimonial({
                    name: formData.name,
                    content: formData.content,
                    image: finalImageUrl,
                    rating: 5,
                });
            }
            
            closeModal();
            router.refresh();
        } catch (error) {
            console.log("Failed to save testimonial:", error);
            showError("Failed to save testimonial");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditing(testimonial);
        setFormData({
            name: testimonial.name,
            designation: testimonial.designation || "",
            content: testimonial.content,
        });
        setExistingImageUrl(testimonial.image || "");
        setPendingFile(null);
        setImageRemoved(false);
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
        
        // Delete image from bucket
        const testimonial = testimonials.find(t => t.id === id);
        if (testimonial?.image) {
            try {
                await adminService.deleteFile(testimonial.image);
            } catch (error) {
                console.log("Failed to delete image from bucket:", error);
            }
        }
        
        try {
            await adminService.deleteTestimonial(id);
            router.refresh();
        } catch (error) {
            console.log("Failed to delete testimonial:", error);
            showError("Failed to delete testimonial");
        }
    };

    const openNewModal = () => {
        setEditing(null);
        setFormData({ name: "", designation: "", content: "" });
        setExistingImageUrl("");
        setPendingFile(null);
        setImageRemoved(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
        setFormData({ name: "", designation: "", content: "" });
        setExistingImageUrl("");
        setPendingFile(null);
        setImageRemoved(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeImage = () => {
        setPendingFile(null);
        setImageRemoved(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    const displayImageUrl = pendingFile ? localPreviewUrl : (!imageRemoved ? existingImageUrl : null);

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
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
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
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
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
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
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
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                    >
                        Add Testimonial
                    </button>
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editing ? "Edit Testimonial" : "Add Testimonial"}
                subtitle="Manage student testimonials for the landing page"
                size="md"
                onSubmit={handleSubmit}
                buttons={[
                    {
                        label: "Cancel",
                        onClick: closeModal,
                        variant: "secondary",
                    },
                    {
                        label: editing ? "Save Changes" : "Add Testimonial",
                        type: "submit",
                        variant: "primary",
                        isLoading: saving,
                        loadingText: "Saving...",
                        disabled: saving,
                    },
                ]}
            >
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                            placeholder="Student name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Testimonial *</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none transition-all"
                            rows={4}
                            placeholder="What did the student say?"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Avatar (optional)</label>
                        {displayImageUrl ? (
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={displayImageUrl}
                                    alt="Preview"
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-600 truncate">
                                        {pendingFile ? pendingFile.name : existingImageUrl.split('/').pop()}
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
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-slate-400 transition-colors bg-slate-50">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="testimonial-avatar-upload"
                                />
                                <label
                                    htmlFor="testimonial-avatar-upload"
                                    className="cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-slate-600 font-medium">Click to upload image</span>
                                    <span className="text-xs text-slate-400 block mt-1">JPG, PNG, WebP, GIF (max 5MB)</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/services";
import { showError } from "@/lib/toast";
import { useConfirm } from "@/components/ConfirmProvider";
import Modal from "@/components/modals/Modal";

interface Instructor {
    id: number;
    name: string;
    title: string | null;
    bio: string | null;
    image: string | null;
    sortOrder: number;
}

interface InstructorsClientProps {
    initialInstructors: Instructor[];
}

export default function InstructorsClient({ initialInstructors }: InstructorsClientProps) {
    const router = useRouter();
    const { showConfirm } = useConfirm();
    const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
    useEffect(() => {
        setInstructors(initialInstructors);
    }, [initialInstructors]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Instructor | null>(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Form data state
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        bio: "",
    });
    
    // Separate state for image handling
    const [pendingFile, setPendingFile] = useState<File | null>(null); // File to upload on save
    const [existingImageUrl, setExistingImageUrl] = useState<string>(""); // URL from server (when editing)
    const [imageRemoved, setImageRemoved] = useState(false); // Track if user removed the existing image
    
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

        // Store file for later upload, mark any existing image as removed
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
                // Keep existing image if not removed
                finalImageUrl = existingImageUrl;
            }
            
            if (editing) {
                await adminService.updateInstructor(editing.id, {
                    name: formData.name,
                    title: formData.title || undefined,
                    bio: formData.bio || undefined,
                    image: finalImageUrl,
                });
            } else {
                await adminService.createInstructor({
                    name: formData.name,
                    title: formData.title || undefined,
                    bio: formData.bio || undefined,
                    image: finalImageUrl,
                });
            }
            
            closeModal();
            router.refresh();
        } catch (error) {
            console.log("Failed to save instructor:", error);
            showError("Failed to save instructor");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (instructor: Instructor) => {
        setEditing(instructor);
        setFormData({
            name: instructor.name,
            title: instructor.title || "",
            bio: instructor.bio || "",
        });
        setExistingImageUrl(instructor.image || "");
        setPendingFile(null);
        setImageRemoved(false);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        const confirmed = await showConfirm({
            title: "Delete Instructor",
            message: "Are you sure you want to delete this instructor?",
            confirmText: "Delete",
            variant: "danger",
        });
        if (!confirmed) return;
        
        // Find the instructor to delete their image
        const instructor = instructors.find(i => i.id === id);
        if (instructor?.image) {
            try {
                await adminService.deleteFile(instructor.image);
            } catch (error) {
                console.log("Failed to delete image from bucket:", error);
            }
        }
        
        try {
            await adminService.deleteInstructor(id);
            router.refresh();
        } catch (error) {
            console.log("Failed to delete instructor:", error);
            showError("Failed to delete instructor");
        }
    };

    const openNewModal = () => {
        setEditing(null);
        setFormData({ name: "", title: "", bio: "" });
        setExistingImageUrl("");
        setPendingFile(null);
        setImageRemoved(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
        setFormData({ name: "", title: "", bio: "" });
        setExistingImageUrl("");
        setPendingFile(null);
        setImageRemoved(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeImage = () => {
        // Just mark as removed locally - actual deletion from bucket happens on save
        setPendingFile(null);
        setImageRemoved(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    // Determine what to show as preview
    const displayImageUrl = pendingFile ? localPreviewUrl : (!imageRemoved ? existingImageUrl : null);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Instructors</h1>
                    <p className="text-slate-500">Manage instructors shown on the landing page</p>
                </div>
                <button
                    onClick={openNewModal}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                    Add Instructor
                </button>
            </div>

            {/* Instructors Grid */}
            {instructors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instructors.map((instructor) => (
                        <div
                            key={instructor.id}
                            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                {instructor.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={instructor.image}
                                        alt={instructor.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl">
                                        {instructor.name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">{instructor.name}</h3>
                                    {instructor.title && (
                                        <p className="text-sm text-slate-500 truncate">{instructor.title}</p>
                                    )}
                                    {instructor.bio && (
                                        <p className="text-slate-500 mt-2 text-sm line-clamp-2">{instructor.bio}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => handleEdit(instructor)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(instructor.id)}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No instructors yet</h3>
                    <p className="text-slate-500 mb-4">Add your first instructor</p>
                    <button
                        onClick={openNewModal}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                    >
                        Add Instructor
                    </button>
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editing ? "Edit Instructor" : "Add Instructor"}
                subtitle="Manage instructor details for the landing page"
                size="md"
                onSubmit={handleSubmit}
                buttons={[
                    {
                        label: "Cancel",
                        onClick: closeModal,
                        variant: "secondary",
                    },
                    {
                        label: editing ? "Save Changes" : "Add Instructor",
                        type: "submit",
                        variant: "primary",
                        isLoading: saving,
                        loadingText: "Saving...",
                        disabled: saving,
                    },
                ]}
            >
                <div className="space-y-5">
                    {/* Avatar Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Avatar</label>
                        {displayImageUrl ? (
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={displayImageUrl}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
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
                                        Remove avatar
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
                                    id="instructor-avatar-upload"
                                />
                                <label
                                    htmlFor="instructor-avatar-upload"
                                    className="cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-slate-600 font-medium">Click to upload avatar</span>
                                    <span className="text-xs text-slate-400 block mt-1">JPG, PNG, WebP, GIF (max 5MB)</span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                            placeholder="Instructor name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                            placeholder="e.g. Senior Instructor"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none transition-all"
                            rows={3}
                            placeholder="Brief bio about the instructor"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}


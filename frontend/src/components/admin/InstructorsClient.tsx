"use client";

import { useEffect, useState, useRef } from "react";
import { adminService } from "@/services";
import { useModal } from "./ModalProvider";

interface Instructor {
    id: number;
    name: string;
    title: string | null;
    bio: string | null;
    image: string | null;
    sortOrder: number;
}

export default function InstructorsClient() {
    const { showError, showConfirm } = useModal();
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Instructor | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        bio: "",
        image: "",
    });

    useEffect(() => {
        loadInstructors();
    }, []);

    const loadInstructors = async () => {
        try {
            const data = await adminService.getInstructors();
            setInstructors(data);
        } catch (error) {
            console.error("Failed to load instructors:", error);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        setUploading(true);
        try {
            const result = await adminService.uploadImage(file, "avatars");
            setFormData({ ...formData, image: result.url });
        } catch (error) {
            console.error("Failed to upload avatar:", error);
            showError("Failed to upload avatar. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editing) {
                await adminService.updateInstructor(editing.id, {
                    name: formData.name,
                    title: formData.title || undefined,
                    bio: formData.bio || undefined,
                    image: formData.image || undefined,
                });
            } else {
                await adminService.createInstructor({
                    name: formData.name,
                    title: formData.title || undefined,
                    bio: formData.bio || undefined,
                    image: formData.image || undefined,
                });
            }
            setShowModal(false);
            setEditing(null);
            setFormData({ name: "", title: "", bio: "", image: "" });
            loadInstructors();
        } catch (error) {
            console.error("Failed to save instructor:", error);
            showError("Failed to save instructor");
        }
    };

    const handleEdit = (instructor: Instructor) => {
        setEditing(instructor);
        setFormData({
            name: instructor.name,
            title: instructor.title || "",
            bio: instructor.bio || "",
            image: instructor.image || "",
        });
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
        try {
            await adminService.deleteInstructor(id);
            loadInstructors();
        } catch (error) {
            console.error("Failed to delete instructor:", error);
            showError("Failed to delete instructor");
        }
    };

    const openNewModal = () => {
        setEditing(null);
        setFormData({ name: "", title: "", bio: "", image: "" });
        setShowModal(true);
    };

    const removeAvatar = () => {
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
                    <h1 className="text-2xl font-bold text-slate-900">Instructors</h1>
                    <p className="text-slate-500">Manage instructors shown on the landing page</p>
                </div>
                <button
                    onClick={openNewModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                        {instructor.name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">{instructor.name}</h3>
                                    {instructor.title && (
                                        <p className="text-sm text-blue-600 truncate">{instructor.title}</p>
                                    )}
                                    {instructor.bio && (
                                        <p className="text-slate-500 mt-2 text-sm line-clamp-2">{instructor.bio}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => handleEdit(instructor)}
                                    className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Add Instructor
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {editing ? "Edit Instructor" : "Add Instructor"}
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
                                {/* Avatar Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Avatar</label>

                                    {formData.image ? (
                                        <div className="flex items-center gap-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-600 truncate max-w-[200px]">
                                                    {formData.image.split('/').pop()}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={removeAvatar}
                                                    className="text-sm text-red-600 hover:text-red-700 font-medium mt-1"
                                                >
                                                    Remove avatar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/gif"
                                                onChange={handleAvatarUpload}
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
                                                        <span className="text-sm text-slate-600 font-medium">Click to upload avatar</span>
                                                        <span className="text-xs text-slate-400 block mt-1">JPG, PNG, WebP, GIF (max 5MB)</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Instructor name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g. Senior ACCA Instructor"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        rows={3}
                                        placeholder="Brief bio about the instructor"
                                    />
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
                                    {editing ? "Save Changes" : "Add Instructor"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

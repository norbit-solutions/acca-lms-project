"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/services";
import { showError } from "@/lib/toast";
import { useConfirm } from "@/components/ConfirmProvider";
import Modal from "@/components/modals/Modal";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQClientProps {
    initialFaqs: FAQItem[];
}

export default function FAQClient({ initialFaqs }: FAQClientProps) {
    const router = useRouter();
    const { showConfirm } = useConfirm();
    const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState({ question: "", answer: "" });

    const saveFAQs = async (items: FAQItem[]) => {
        setSaving(true);
        try {
            await adminService.createCmsItem("faq", { items });
            setFaqs(items);
            router.refresh();
        } catch (error) {
            console.log("Failed to save FAQs:", error);
            showError("Failed to save FAQs");
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newFaqs = [...faqs];
        if (editingIndex !== null) {
            newFaqs[editingIndex] = formData;
        } else {
            newFaqs.push(formData);
        }
        await saveFAQs(newFaqs);
        setShowModal(false);
        setEditingIndex(null);
        setFormData({ question: "", answer: "" });
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setFormData(faqs[index]);
        setShowModal(true);
    };

    const handleDelete = async (index: number) => {
        const confirmed = await showConfirm({
            title: "Delete FAQ",
            message: "Are you sure you want to delete this FAQ?",
            confirmText: "Delete",
            variant: "danger",
        });
        if (!confirmed) return;
        const newFaqs = faqs.filter((_, i) => i !== index);
        await saveFAQs(newFaqs);
    };

    const openNewModal = () => {
        setEditingIndex(null);
        setFormData({ question: "", answer: "" });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingIndex(null);
        setFormData({ question: "", answer: "" });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">FAQ</h1>
                    <p className="text-slate-500">Manage frequently asked questions</p>
                </div>
                <button
                    onClick={openNewModal}
                    disabled={saving}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                    Add FAQ
                </button>
            </div>

            {faqs.length > 0 ? (
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                            <p className="text-slate-600 text-sm">{faq.answer}</p>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => handleEdit(index)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No FAQs yet</h3>
                    <p className="text-slate-500 mb-4">Add your first FAQ</p>
                    <button
                        onClick={openNewModal}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
                    >
                        Add FAQ
                    </button>
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingIndex !== null ? "Edit FAQ" : "Add FAQ"}
                subtitle="Manage frequently asked questions for the landing page"
                size="md"
                onSubmit={handleSubmit}
                buttons={[
                    {
                        label: "Cancel",
                        onClick: closeModal,
                        variant: "secondary",
                    },
                    {
                        label: saving ? "Saving..." : "Save",
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Question *</label>
                        <input
                            type="text"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                            placeholder="Enter the question"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Answer *</label>
                        <textarea
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none transition-all"
                            rows={4}
                            placeholder="Enter the answer"
                            required
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}


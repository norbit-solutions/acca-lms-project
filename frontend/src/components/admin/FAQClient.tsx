"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/services";
import { useModal } from "./ModalProvider";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQClientProps {
    initialFaqs: FAQItem[];
}

export default function FAQClient({ initialFaqs }: FAQClientProps) {
    const router = useRouter();
    const { showError, showConfirm } = useModal();
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
                                    className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
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

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold">{editingIndex !== null ? "Edit FAQ" : "Add FAQ"}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
                                    <input
                                        type="text"
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Answer</label>
                                    <textarea
                                        value={formData.answer}
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 resize-none"
                                        rows={4}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50">
                                    {saving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { adminService } from "@/services";
import { useState } from "react";
import { showError, showSuccess } from "@/lib/toast";
import { useConfirm } from "@/components/ConfirmProvider";
import { useRouter } from "next/navigation";

interface WhyItem {
  title: string;
  description: string;
  icon: string;
}

interface WhyContent {
  headline: string;
  subheadline: string;
  items: WhyItem[];
}

interface WhyAccaClientProps {
  initialContent: WhyContent;
}

const iconOptions = [
  "📚",
  "🎓",
  "💡",
  "🏆",
  "⚡",
  "🔒",
  "📱",
  "🌍",
  "👨‍🏫",
  "✅",
];

export default function WhyAccaClient({ initialContent }: WhyAccaClientProps) {
  const router = useRouter();
  const { showConfirm } = useConfirm();
  const [content, setContent] = useState<WhyContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "📚",
  });

  const saveContent = async (newContent: WhyContent) => {
    setSaving(true);
    try {
      await adminService.createCmsItem(
        "why-acca",
        newContent as unknown as Record<string, unknown>
      );
      setContent(newContent);
    } catch (error) {
      console.log("Failed to save:", error);
      showError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleHeadlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveContent(content);
    showSuccess("Headlines updated successfully!");
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItems = [...content.items];
    if (editingIndex !== null) {
      newItems[editingIndex] = formData;
    } else {
      newItems.push(formData);
    }
    await saveContent({ ...content, items: newItems });
    setShowModal(false);
    setEditingIndex(null);
    setFormData({ title: "", description: "", icon: "📚" });
  };

  const handleEditItem = (index: number) => {
    setEditingIndex(index);
    setFormData(content.items[index]);
    setShowModal(true);
  };

  const handleDeleteItem = async (index: number) => {
    const confirmed = await showConfirm({
      title: "Delete Item",
      message: "Are you sure you want to delete this item?",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    const newItems = content.items.filter((_, i) => i !== index);
    await saveContent({ ...content, items: newItems });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Why Learnspire</h1>
        <p className="text-slate-500">
          Manage the &quot;Why Choose Us&quot; section
        </p>
      </div>

      {/* Headlines */}
      <form
        onSubmit={handleHeadlineSubmit}
        className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
      >
        <h2 className="font-semibold text-slate-900">Section Headlines</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Headline
          </label>
          <input
            type="text"
            value={content.headline}
            onChange={(e) =>
              setContent({ ...content, headline: e.target.value })
            }
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Subheadline
          </label>
          <input
            type="text"
            value={content.subheadline}
            onChange={(e) =>
              setContent({ ...content, subheadline: e.target.value })
            }
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Headlines"}
        </button>
      </form>

      {/* Items */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Benefits</h2>
          <button
            onClick={() => {
              setEditingIndex(null);
              setFormData({ title: "", description: "", icon: "📚" });
              setShowModal(true);
            }}
            className="px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800"
          >
            Add Benefit
          </button>
        </div>

        {content.items.length > 0 ? (
          <div className="space-y-3">
            {content.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                <button
                  onClick={() => handleEditItem(index)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">
            No benefits added yet
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold">
                {editingIndex !== null ? "Edit Benefit" : "Add Benefit"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleItemSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`w-10 h-10 text-xl rounded-lg ${formData.icon === icon
                          ? "bg-blue-100 ring-2 ring-blue-500"
                          : "bg-slate-100 hover:bg-slate-200"
                          }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 resize-none"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

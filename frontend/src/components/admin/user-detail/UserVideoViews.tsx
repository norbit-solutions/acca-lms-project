
import { AdminUser } from "@/types";
import { EditIcon } from "@/lib/icons";
import { useState } from "react";

interface UserVideoViewsProps {
    user: AdminUser;
    onSetViewLimit: (lessonId: number, limit: number) => Promise<void>;
    onRemoveViewLimit: (lessonId: number) => Promise<void>;
}

export default function UserVideoViews({
    user,
    onSetViewLimit,
    onRemoveViewLimit,
}: UserVideoViewsProps) {
    const [editingViewLimit, setEditingViewLimit] = useState<{
        lessonId: number;
        lessonTitle: string;
        currentLimit: number | null;
    } | null>(null);
    const [newLimit, setNewLimit] = useState<string>("");

    const openViewLimitModal = (view: any) => {
        setEditingViewLimit({
            lessonId: view.lessonId,
            lessonTitle: view.lessonTitle || 'Unknown Lesson',
            currentLimit: view.customViewLimit || null,
        });
        setNewLimit(view.customViewLimit?.toString() || "");
    };

    const handleSave = async () => {
        if (!editingViewLimit) return;
        const limitValue = parseInt(newLimit, 10);
        if (isNaN(limitValue) || limitValue < 0) return;
        await onSetViewLimit(editingViewLimit.lessonId, limitValue);
        setEditingViewLimit(null);
    };

    const handleRemove = async () => {
        if (!editingViewLimit) return;
        await onRemoveViewLimit(editingViewLimit.lessonId);
        setEditingViewLimit(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Video Views ({user?.videoViews ? user.videoViews.length : 0})
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Click to adjust view limits for this user
                </p>
            </div>
            {user?.videoViews && user.videoViews.length > 0 ? (
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                    {(Array.isArray(user.videoViews) ? user.videoViews : []).map(
                        (view: any) => (
                            <div
                                key={view.id}
                                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => openViewLimitModal(view)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {view.lessonTitle || 'Unknown Lesson'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {view.courseTitle || 'Unknown Course'}
                                        </p>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {view.viewCount} views
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {view.customViewLimit ? (
                                                    <span className="text-blue-600 font-medium">
                                                        Custom limit: {view.customViewLimit}
                                                    </span>
                                                ) : (
                                                    'Default limit'
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-gray-400 hover:text-blue-600">
                                            <EditIcon className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div className="p-6 text-center text-gray-500">
                    No video views recorded
                </div>
            )}

            {/* View Limit Modal */}
            {editingViewLimit && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Set View Limit
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {editingViewLimit.lessonTitle}
                            </p>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom View Limit
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={newLimit}
                                onChange={(e) => setNewLimit(e.target.value)}
                                placeholder="Enter number of views allowed"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Leave empty or set to 0 to use default lesson limit. Current usage: {user.videoViews?.find((v: any) => v.lessonId === editingViewLimit.lessonId)?.viewCount || 0} views.
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between rounded-b-xl">
                            <button
                                onClick={handleRemove}
                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Remove Custom Limit
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingViewLimit(null)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    Save Limit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

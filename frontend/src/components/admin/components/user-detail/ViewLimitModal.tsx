"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/modals/Modal";
import { EyeIcon } from "@/lib/icons";

interface ViewLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  currentLimit: number | null;
  currentViews: number;
  onSave: (limit: number) => Promise<void>;
  onRemove: () => Promise<void>;
}

export default function ViewLimitModal({
  isOpen,
  onClose,
  lessonTitle,
  currentLimit,
  currentViews,
  onSave,
  onRemove,
}: ViewLimitModalProps) {
  const [newLimit, setNewLimit] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewLimit(currentLimit?.toString() || "");
    }
  }, [isOpen, currentLimit]);

  const handleSave = async () => {
    const limitValue = parseInt(newLimit, 10);
    if (isNaN(limitValue) || limitValue < 0) return;
    
    setIsLoading(true);
    try {
      await onSave(limitValue);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // const handleRemove = async () => {
  //   setIsLoading(true);
  //   try {
  //     await onRemove();
  //     onClose();
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const usagePercentage = currentLimit 
    ? Math.min((currentViews / currentLimit) * 100, 100)
    : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust View Limit"
      subtitle={lessonTitle}
      size="md"
      buttons={[
        // {
        //   label: "Remove Limit",
        //   onClick: handleRemove,
        //   variant: "ghost",
        //   disabled: !currentLimit || isLoading,
        // },
        {
          label: "Cancel",
          onClick: onClose,
          variant: "secondary",
          disabled: isLoading,
        },
        {
          label: "Save Limit",
          onClick: handleSave,
          variant: "primary",
          isLoading: isLoading,
          loadingText: "Saving...",
          disabled: !newLimit || isLoading,
        },
      ]}
    >
      <div className="space-y-6">
        {/* Current Usage Display */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
              <EyeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Current Usage</p>
              <p className="text-xl font-bold text-slate-900">
                {currentViews} <span className="text-sm font-normal text-slate-500">views</span>
              </p>
            </div>
          </div>
          
          {currentLimit && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Progress</span>
                <span className="font-medium text-slate-900">
                  {currentViews} / {currentLimit}
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    usagePercentage >= 90 
                      ? 'bg-slate-900' 
                      : usagePercentage >= 70 
                        ? 'bg-slate-600' 
                        : 'bg-slate-400'
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Limit Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Custom View Limit
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="Enter number of views allowed"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all bg-white text-lg"
            />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Set a custom limit for this user. Leave empty to use the default lesson limit.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setNewLimit((currentViews + 5).toString())}
            className="flex-1 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
          >
            +5 views
          </button>
          <button
            type="button"
            onClick={() => setNewLimit((currentViews + 10).toString())}
            className="flex-1 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
          >
            +10 views
          </button>
          <button
            type="button"
            onClick={() => setNewLimit((currentViews + 20).toString())}
            className="flex-1 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
          >
            +20 views
          </button>
        </div>
      </div>
    </Modal>
  );
}

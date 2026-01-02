"use client";

import { useState, useCallback, createContext, useContext, ReactNode } from "react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
}

interface ConfirmContextType {
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used within ConfirmProvider");
  return context;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ isOpen: true, options, resolve });
    });
  }, []);

  const handleConfirm = (result: boolean) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}

      {/* Confirm Modal */}
      {confirmState?.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn"
          onClick={() => handleConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  confirmState.options.variant === "danger" 
                    ? "bg-red-100" 
                    : "bg-slate-100"
                }`}>
                  {confirmState.options.variant === "danger" ? (
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {confirmState.options.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {confirmState.options.message}
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => handleConfirm(false)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                {confirmState.options.cancelText || "Cancel"}
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  confirmState.options.variant === "danger"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {confirmState.options.confirmText || "Confirm"}
              </button>
            </div>
          </div>

          {/* Animations */}
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { 
                opacity: 0; 
                transform: scale(0.9); 
              }
              to { 
                opacity: 1; 
                transform: scale(1); 
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.2s ease-out;
            }
            .animate-scaleIn {
              animation: scaleIn 0.2s ease-out;
            }
          `}</style>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

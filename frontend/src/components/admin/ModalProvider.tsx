"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Types
type ModalType = "success" | "error" | "info" | "warning";

interface AlertOptions {
    title: string;
    message: string;
    type?: ModalType;
    buttonText?: string;
}

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "default";
}

interface ModalContextType {
    showAlert: (options: AlertOptions) => void;
    showConfirm: (options: ConfirmOptions) => Promise<boolean>;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal must be used within ModalProvider");
    return context;
}

// Minimal icons with thin strokes
const IconSuccess = () => (
    <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconError = () => (
    <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconWarning = () => (
    <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const IconInfo = () => (
    <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const getIcon = (type: ModalType) => {
    switch (type) {
        case "success": return <IconSuccess />;
        case "error": return <IconError />;
        case "warning": return <IconWarning />;
        case "info": return <IconInfo />;
    }
};

export function ModalProvider({ children }: { children: ReactNode }) {
    // Alert state
    const [alertState, setAlertState] = useState<(AlertOptions & { isOpen: boolean }) | null>(null);

    // Confirm state
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        options: ConfirmOptions;
        resolve: (value: boolean) => void;
    } | null>(null);

    const showAlert = useCallback((options: AlertOptions) => {
        setAlertState({ ...options, isOpen: true });
    }, []);

    const showSuccess = useCallback((message: string) => {
        setAlertState({ title: "Success", message, type: "success", isOpen: true });
    }, []);

    const showError = useCallback((message: string) => {
        setAlertState({ title: "Error", message, type: "error", isOpen: true });
    }, []);

    const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({ isOpen: true, options, resolve });
        });
    }, []);

    const closeAlert = () => setAlertState(null);

    const handleConfirm = (result: boolean) => {
        confirmState?.resolve(result);
        setConfirmState(null);
    };

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm, showSuccess, showError }}>
            {children}

            {/* Alert Modal */}
            {alertState?.isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4"
                    onClick={closeAlert}
                >
                    <div
                        className="bg-white rounded-xl max-w-xs w-full shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 text-center">
                            <div className="flex justify-center mb-5">
                                {getIcon(alertState.type || "info")}
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">{alertState.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{alertState.message}</p>
                        </div>
                        <div className="px-6 pb-6">
                            <button
                                onClick={closeAlert}
                                className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                {alertState.buttonText || "OK"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {confirmState?.isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4"
                    onClick={() => handleConfirm(false)}
                >
                    <div
                        className="bg-white rounded-xl max-w-xs w-full shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 text-center">
                            <div className="flex justify-center mb-5">
                                {confirmState.options.variant === "danger" ? <IconWarning /> : <IconInfo />}
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">{confirmState.options.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{confirmState.options.message}</p>
                        </div>
                        <div className="flex gap-3 px-6 pb-6">
                            <button
                                onClick={() => handleConfirm(false)}
                                className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                {confirmState.options.cancelText || "Cancel"}
                            </button>
                            <button
                                onClick={() => handleConfirm(true)}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${confirmState.options.variant === "danger"
                                        ? "bg-slate-900 text-white hover:bg-slate-800"
                                        : "bg-slate-900 text-white hover:bg-slate-800"
                                    }`}
                            >
                                {confirmState.options.confirmText || "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}

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

// Icons
const IconSuccess = () => (
    <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconError = () => (
    <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconWarning = () => (
    <svg className="w-12 h-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const IconInfo = () => (
    <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="flex justify-center mb-4">
                                {getIcon(alertState.type || "info")}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{alertState.title}</h3>
                            <p className="text-slate-600">{alertState.message}</p>
                        </div>
                        <div className="px-6 pb-6">
                            <button
                                onClick={closeAlert}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                {alertState.buttonText || "OK"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {confirmState?.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="flex justify-center mb-4">
                                {confirmState.options.variant === "danger" ? <IconWarning /> : <IconInfo />}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{confirmState.options.title}</h3>
                            <p className="text-slate-600">{confirmState.options.message}</p>
                        </div>
                        <div className="flex gap-3 px-6 pb-6">
                            <button
                                onClick={() => handleConfirm(false)}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                {confirmState.options.cancelText || "Cancel"}
                            </button>
                            <button
                                onClick={() => handleConfirm(true)}
                                className={`flex-1 py-3 font-semibold rounded-xl transition-colors ${confirmState.options.variant === "danger"
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
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

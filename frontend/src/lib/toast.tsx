"use client";

import toast, { Toaster, ToastOptions } from "react-hot-toast";

// Toast configuration
const baseStyles: ToastOptions = {
  duration: 4000,
  position: "top-right",
};

// Custom success toast
export const showSuccess = (message: string) => {
  toast.success(message, {
    ...baseStyles,
    style: {
      background: "#f0fdf4",
      color: "#166534",
      border: "1px solid #bbf7d0",
      padding: "16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
    },
    iconTheme: {
      primary: "#22c55e",
      secondary: "#ffffff",
    },
  });
};

// Custom error toast
export const showError = (message: string) => {
  toast.error(message, {
    ...baseStyles,
    duration: 5000,
    style: {
      background: "#fef2f2",
      color: "#991b1b",
      border: "1px solid #fecaca",
      padding: "16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
    },
    iconTheme: {
      primary: "#ef4444",
      secondary: "#ffffff",
    },
  });
};

// Custom info toast
export const showInfo = (message: string) => {
  toast(message, {
    ...baseStyles,
    icon: "ℹ️",
    style: {
      background: "#f0f9ff",
      color: "#075985",
      border: "1px solid #bae6fd",
      padding: "16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
    },
  });
};

// Custom warning toast
export const showWarning = (message: string) => {
  toast(message, {
    ...baseStyles,
    icon: "⚠️",
    style: {
      background: "#fffbeb",
      color: "#92400e",
      border: "1px solid #fde68a",
      padding: "16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
    },
  });
};

// Loading toast with promise
export const showLoading = (message: string) => {
  return toast.loading(message, {
    style: {
      background: "#f8fafc",
      color: "#334155",
      border: "1px solid #e2e8f0",
      padding: "16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
    },
  });
};

// Dismiss a specific toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Toast provider component - add this to your layout
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        className: "",
        duration: 4000,
      }}
    />
  );
}

// Re-export toast for advanced usage
export { toast };

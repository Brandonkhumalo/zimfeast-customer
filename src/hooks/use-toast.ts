// toast.tsx
import React from "react";
import Toast from "react-native-toast-message";

export const TOAST_LIMIT = 1;
export const TOAST_REMOVE_DELAY = 5000; // milliseconds

// Define types
interface ToastOptions {
  type?: "success" | "error" | "info";
  title?: string;
  description?: string;
}

let toasts: string[] = [];

// Core toast manager
export const toast = {
  show: ({ type = "info", title, description }: ToastOptions) => {
    if (toasts.length >= TOAST_LIMIT) {
      toast.dismiss();
    }

    const id = Date.now().toString();
    toasts.push(id);

    Toast.show({
      type,
      text1: title,
      text2: description,
      position: "top",
      autoHide: true,
      visibilityTime: TOAST_REMOVE_DELAY,
      onHide: () => {
        toasts = toasts.filter((t) => t !== id);
      },
    });
  },

  success: (title: string, description?: string) =>
    toast.show({ type: "success", title, description }),

  error: (title: string, description?: string) =>
    toast.show({ type: "error", title, description }),

  info: (title: string, description?: string) =>
    toast.show({ type: "info", title, description }),

  dismiss: () => {
    Toast.hide();
    toasts = [];
  },
};

// Hook for future extensibility (placeholder)
export function useToast() {
  return toast;
}

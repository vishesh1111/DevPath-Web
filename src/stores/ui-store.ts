"use client";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export type ThemePreference = "light" | "dark";
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
}

interface UIStore {
    theme: string | undefined;
    resolvedTheme: ThemePreference;
    isThemeMounted: boolean;
    applyTheme: (theme: ThemePreference) => void;
    syncTheme: (theme: string | undefined, resolvedTheme: string | undefined) => void;
    setThemeApplier: (applyTheme: (theme: ThemePreference) => void) => void;
    toasts: Toast[];
    showToast: (message: string, type: NotificationType, duration?: number) => string;
    removeToast: (id: string) => void;
    showError: (message: string, duration?: number) => string;
    showSuccess: (message: string, duration?: number) => string;
    showWarning: (message: string, duration?: number) => string;
    showInfo: (message: string, duration?: number) => string;
}

const noopApplyTheme = () => undefined;

export const useUIStore = create<UIStore>((set, get) => ({
    theme: undefined,
    resolvedTheme: "dark",
    isThemeMounted: false,
    applyTheme: noopApplyTheme,
    syncTheme: (theme, resolvedTheme) => {
        const nextResolvedTheme: ThemePreference = resolvedTheme === "light" ? "light" : "dark";

        set({
            theme,
            resolvedTheme: nextResolvedTheme,
            isThemeMounted: true,
        });
    },
    setThemeApplier: (applyTheme) => {
        set({ applyTheme });
    },
    toasts: [],
    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
    },
    showToast: (message, type, duration = 5000) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast: Toast = { id, message, type, duration };

        set((state) => ({
            toasts: [...state.toasts, newToast],
        }));

        if (duration > 0) {
            window.setTimeout(() => get().removeToast(id), duration);
        }

        return id;
    },
    showError: (message, duration) => get().showToast(message, "error", duration ?? 6000),
    showSuccess: (message, duration) => get().showToast(message, "success", duration ?? 4000),
    showWarning: (message, duration) => get().showToast(message, "warning", duration ?? 5000),
    showInfo: (message, duration) => get().showToast(message, "info", duration ?? 4000),
}));

export const useThemePreference = () =>
    useUIStore(
        useShallow((state) => ({
            theme: state.theme,
            resolvedTheme: state.resolvedTheme,
            isThemeMounted: state.isThemeMounted,
            applyTheme: state.applyTheme,
        }))
    );

export const useToasts = () => useUIStore((state) => state.toasts);
export const useRemoveToast = () => useUIStore((state) => state.removeToast);

export const useNotificationActions = () =>
    useUIStore(
        useShallow((state) => ({
            showToast: state.showToast,
            showError: state.showError,
            showSuccess: state.showSuccess,
            showWarning: state.showWarning,
            showInfo: state.showInfo,
        }))
    );

export const useNotificationStore = () =>
    useUIStore(
        useShallow((state) => ({
            toasts: state.toasts,
            showToast: state.showToast,
            removeToast: state.removeToast,
            showError: state.showError,
            showSuccess: state.showSuccess,
            showWarning: state.showWarning,
            showInfo: state.showInfo,
        }))
    );

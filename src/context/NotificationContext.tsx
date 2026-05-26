"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number; // milliseconds, 0 = persistent
}

interface NotificationContextType {
    toasts: Toast[];
    showToast: (message: string, type: NotificationType, duration?: number) => string;
    removeToast: (id: string) => void;
    showError: (message: string, duration?: number) => string;
    showSuccess: (message: string, duration?: number) => string;
    showWarning: (message: string, duration?: number) => string;
    showInfo: (message: string, duration?: number) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: NotificationType, duration = 5000) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast: Toast = { id, message, type, duration };
        
        setToasts(prev => [...prev, newToast]);

        // Auto-remove after duration if duration > 0
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showError = useCallback((message: string, duration?: number) => {
        return showToast(message, 'error', duration ?? 6000);
    }, [showToast]);

    const showSuccess = useCallback((message: string, duration?: number) => {
        return showToast(message, 'success', duration ?? 4000);
    }, [showToast]);

    const showWarning = useCallback((message: string, duration?: number) => {
        return showToast(message, 'warning', duration ?? 5000);
    }, [showToast]);

    const showInfo = useCallback((message: string, duration?: number) => {
        return showToast(message, 'info', duration ?? 4000);
    }, [showToast]);

    return (
        <NotificationContext.Provider value={{
            toasts,
            showToast,
            removeToast,
            showError,
            showSuccess,
            showWarning,
            showInfo
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}

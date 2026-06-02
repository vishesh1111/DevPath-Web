"use client";

import React from 'react';
import {
    useNotificationStore,
    type NotificationType,
    type Toast,
} from '@/stores/ui-store';

export type { NotificationType, Toast };

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export function useNotification() {
    return useNotificationStore();
}

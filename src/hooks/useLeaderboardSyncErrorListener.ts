"use client";

import { useEffect } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { leaderboardSyncErrorEmitter } from '@/lib/leaderboard-sync-error';

/**
 * Hook to display leaderboard sync errors as notifications
 * Should be used in a component somewhere in the app layout
 */
export function useLeaderboardSyncErrorListener() {
    const { showError, showWarning } = useNotification();

    useEffect(() => {
        const unsubscribe = leaderboardSyncErrorEmitter.subscribe((error, context) => {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Leaderboard sync error in ${context}:`, error);

            // Check error type and show appropriate message
            if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('permission')) {
                showError(
                    'Leaderboard update failed: Permission denied. Your XP changes may not be synced.',
                    6000
                );
            } else if (errorMessage.includes('UNAUTHENTICATED')) {
                showWarning(
                    'Authentication expired. Please refresh the page.',
                    5000
                );
            } else if (errorMessage.includes('UNAVAILABLE') || errorMessage.includes('network')) {
                showError(
                    'Network error: Unable to sync your XP to leaderboard. Changes will sync when connection is restored.',
                    6000
                );
            } else {
                showError(
                    `Failed to update leaderboard. Your XP may be out of sync. Please refresh the page.`,
                    6000
                );
            }
        });

        return () => unsubscribe();
    }, [showError, showWarning]);
}

/**
 * Leaderboard Sync Error Handler
 * 
 * This module provides a centralized way to handle leaderboard sync errors
 * and display them to users via notifications.
 */

import { useNotification } from '@/context/NotificationContext';

export function useLeaderboardSyncHandler() {
    const { showError, showWarning } = useNotification();

    const handleSyncError = (error: unknown, context: string) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Leaderboard sync error in ${context}:`, error);

        // Check if it's a Firestore permission/rule error
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
                `Failed to update leaderboard. Your XP may be out of sync. Please try again or contact support.`,
                6000
            );
        }
    };

    return { handleSyncError };
}

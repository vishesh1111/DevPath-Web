/**
 * Leaderboard Sync Error Event Emitter
 * 
 * Simple event emitter to communicate sync errors from AuthContext
 * to components that can display notifications.
 */

export type LeaderboardSyncErrorCallback = (error: unknown, context: string) => void;

class LeaderboardSyncErrorEmitter {
    private listeners: Set<LeaderboardSyncErrorCallback> = new Set();

    subscribe(callback: LeaderboardSyncErrorCallback) {
        this.listeners.add(callback);
        return () => { this.listeners.delete(callback); };
    }

    emit(error: unknown, context: string) {
        this.listeners.forEach(callback => {
            try {
                callback(error, context);
            } catch (err) {
                console.error('Error in leaderboard sync error listener:', err);
            }
        });
    }
}

export const leaderboardSyncErrorEmitter = new LeaderboardSyncErrorEmitter();

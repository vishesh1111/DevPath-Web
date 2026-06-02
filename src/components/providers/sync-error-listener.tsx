"use client";

import React from 'react';
import { useLeaderboardSyncErrorListener } from '@/hooks/useLeaderboardSyncErrorListener';

export function SyncErrorListener({ children }: { children: React.ReactNode }) {
    // This hook subscribes to leaderboard sync errors and displays them
    useLeaderboardSyncErrorListener();

    return children;
}

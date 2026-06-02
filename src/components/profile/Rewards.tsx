"use client";

import { useAuth } from '@/context/AuthContext';
import { CheckCircle } from 'lucide-react';
import { doc, updateDoc, writeBatch, increment, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { determineBadges, getBadgeXp } from '@/lib/point-calculation';
import { useState, useEffect, useRef } from 'react';

// Global throttle to prevent infinite loops even if component remounts
let lastBadgeCheckTime = 0;

export default function Rewards({ user: propUser, projectCount = 0 }: { user?: any, projectCount?: number }) {
    const { user: authUser } = useAuth();

    // Use propUser if provided (public view), otherwise authUser (private view)
    const user = propUser || authUser;
    const isOwner = !propUser || (authUser && propUser.uid === authUser.uid);

    const lastCheckedRef = useRef<{ achievements: string[], projectCount: number } | null>(null);



    // Auto-award badges & Sync Points effect
    useEffect(() => {
        if (!isOwner || !user) return;

        // Global throttle: Prevent checks more than once every 5 seconds
        if (Date.now() - lastBadgeCheckTime < 5000) return;

        const checkAndSync = async () => {
            // 24-hour throttle from Firestore field
            const lastScan = user.lastBadgeScan || 0;
            if (Date.now() - lastScan < 24 * 60 * 60 * 1000) {
                console.log('Badge sync skipped — less than 24 h since last scan.');
                return;
            }

            // Update in-memory throttle to prevent concurrent runs
            lastBadgeCheckTime = Date.now();

            try {
                // 1. Fetch the user's projects (needed for builder-badge thresholds)
                const projectsRef = collection(db, 'members', user.uid, 'projects');
                const projectsSnap = await getDocs(projectsRef);
                const userProjects = projectsSnap.docs.map(d => d.data());

                // 2. Derive the full badge list the user has now earned
                const earnedBadges = determineBadges(user, userProjects);
                const currentBadges: string[] = user.achievements || [];

                // 3. Identify ONLY newly unlocked badges — never revoke existing ones
                const newBadges = earnedBadges.filter(id => !currentBadges.includes(id));

                if (newBadges.length > 0) {
                    // 4. Calculate XP for new badges only (additive, not a total reset)
                    const newBadgeXp = newBadges.reduce((sum, id) => sum + getBadgeXp(id), 0);
                    const updatedAchievements = [...currentBadges, ...newBadges];

                    const batch = writeBatch(db);
                    const userRef = doc(db, 'members', user.uid);

                    // 5. Award badge XP as an increment — transactional points are preserved
                    batch.update(userRef, {
                        achievements: updatedAchievements,
                        lastBadgeScan: Date.now(),
                        ...(newBadgeXp > 0 && { points: increment(newBadgeXp) }),
                    });

                    // 6. Mirror XP increment on the leaderboard
                    if (newBadgeXp > 0) {
                        const leaderboardRef = doc(db, 'leaderboard', user.uid);
                        batch.set(leaderboardRef, { points: increment(newBadgeXp) }, { merge: true });
                    }

                    // 7. Write individual badge documents for newly earned badges
                    newBadges.forEach(badgeId => {
                        const badgeRef = doc(db, 'members', user.uid, 'badges', badgeId);
                        batch.set(badgeRef, {
                            id: badgeId,
                            earnedAt: serverTimestamp(),
                            xpAwarded: getBadgeXp(badgeId),
                        });
                    });

                    await batch.commit();
                    // AuthContext's onSnapshot propagates the update — no second write needed.

                    const label = newBadges.length === 1 ? 'badge' : 'badges';
                    alert(`🎉 You earned ${newBadges.length} new ${label} and ${newBadgeXp} XP!`);

                } else {
                    // No new badges — just refresh the 24-hour scan timestamp
                    await updateDoc(doc(db, 'members', user.uid), {
                        lastBadgeScan: Date.now(),
                    });
                }

            } catch (error) {
                console.error('Error syncing badges:', error);
            }
        };

        checkAndSync();
    }, [user, isOwner]);

    if (!user) return null;

    const BADGES = [
        { id: 'early-adopter', name: 'Early Adopter', description: 'Joined during the beta phase.', icon: '🚀' },
        { id: 'profile-perfect', name: 'Profile Perfect', description: 'Completed 100% of profile details.', icon: '✨' },
        { id: 'builder-1', name: 'Builder', description: 'Uploaded first project.', icon: '🛠️' },
        { id: 'builder-3', name: 'Prolific Builder', description: 'Shared 3+ projects.', icon: '🏗️' },
        { id: 'builder-5', name: 'Architect', description: 'Shared 5+ projects.', icon: '🏢' },
        { id: 'builder-10', name: 'Master Builder', description: 'Shared 10+ projects.', icon: '🏰' },
        { id: 'connector-social', name: 'Super Connector', description: 'Connected all social accounts.', icon: '🔗' },
        { id: 'social-github', name: 'Coder', description: 'Linked GitHub account.', icon: '🐙' },
        { id: 'social-linkedin', name: 'Professional', description: 'Linked LinkedIn account.', icon: '💼' },
        { id: 'social-instagram', name: 'Socialite', description: 'Linked Instagram account.', icon: '📸' },
        { id: 'storyteller', name: 'Storyteller', description: 'Wrote a bio.', icon: '✍️' },
        { id: 'face-of-community', name: 'Face of Community', description: 'Uploaded a profile picture.', icon: '😊' },
        { id: 'local-hero', name: 'Local Hero', description: 'Added location details.', icon: '📍' },
        { id: 'streak-7', name: 'Dedicated', description: '7-day login streak.', icon: '🔥' },
        { id: 'rising-star', name: 'Rising Star', description: 'Got 20+ stars on a project.', icon: '⭐' },
        { id: 'top-collaborator', name: 'Top Collaborator', description: 'Active contributor to community projects.', icon: '🤝' },
    ];

    return (
        <div className="space-y-8">
            {/* Badges Section */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CheckCircle className="text-blue-500" size={24} /> Badges & Milestones
                </h3>

                {/* Horizontal Scrollable List */}
                <div className="relative group">
                    <div className="flex overflow-x-auto pb-6 gap-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 transition-colors">
                        {BADGES.map(badge => {
                            const isUnlocked = user.achievements?.includes(badge.id);
                            return (
                                <div
                                    key={badge.id}
                                    className={`flex-none w-40 p-4 rounded-xl border flex flex-col items-center text-center gap-3 transition-all snap-start ${isUnlocked
                                        ? 'bg-primary/5 border-primary/20 shadow-sm scale-100 opacity-100'
                                        : 'bg-muted/20 border-border/50 opacity-50 grayscale scale-95'
                                        }`}
                                >
                                    <div className={`text-4xl p-4 rounded-full ${isUnlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                                        {badge.icon}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-sm ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {badge.name}
                                        </h4>
                                        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
                                            {badge.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Fade effect on the right to indicate scroll */}
                    <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-card to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    );
}

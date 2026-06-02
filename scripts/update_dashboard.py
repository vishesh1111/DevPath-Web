
import os

file_path = r'src/components/admin/AdminDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the start and end of the function to replace
start_marker = 'const handleRecalculateAll = async () => {'
end_marker = 'setMigrating(false);'

# Find start
start_idx = content.find(start_marker)
if start_idx == -1:
    print("Start marker not found!")
    exit(1)

# Find end (it's inside the finally block at the end of the function)
# We need to be careful. The function ends with:
#         } finally {
#             setMigrating(false);
#         }
#     };

# Let's find the closing brace of the function.
# We can search for the next "};" after the start, but there might be nested ones.
# Instead, let's replace the specific block we know is there.

# We want to replace everything inside the try block basically.

new_logic = """    const handleRecalculateAll = async () => {
        if (!confirm("Are you sure you want to RECALCULATE ALL BADGES & POINTS for ALL USERS (Members & Admins)?\\n\\nThis will:\\n- Recalculate badge eligibility for all users\\n- Award XP for newly earned badges only\\n- Preserve existing transactional points\\n- Update leaderboard accordingly\\n\\nThis action cannot be undone.")) return;

        setMigrating(true);
        setMigrationLog(['Starting Full Recalculation...', 'Initializing...']);

        // Statistics tracking
        const stats = {
            totalUsers: 0,
            processedUsers: 0,
            skippedUsers: 0,
            newBadgesAwarded: 0,
            totalXpAwarded: 0,
            errors: 0,
            usersWithChanges: 0
        };

        try {
            const batch = (await import('firebase/firestore')).writeBatch(db);
            const { determineBadges, getBadgeXp } = await import('@/lib/point-calculation');
            const { increment } = await import('firebase/firestore');
            let count = 0;
            let batchCount = 0;

            // 1. Fetch Members
            setMigrationLog((prev: string[]) => [...prev, 'Fetching members...']);
            const membersRef = collection(db, 'members');
            const membersSnapshot = await getDocs(membersRef);
            setMigrationLog((prev: string[]) => [...prev, `Found ${membersSnapshot.size} members.`]);

            // 2. Fetch Admins
            setMigrationLog((prev: string[]) => [...prev, 'Fetching admins...']);
            const adminsRef = collection(db, 'admins');
            const adminsSnapshot = await getDocs(adminsRef);
            setMigrationLog((prev: string[]) => [...prev, `Found ${adminsSnapshot.size} admins.`]);

            // Combine for processing
            const allDocs = [
                ...membersSnapshot.docs.map(d => ({ ...d.data(), id: d.id, collection: 'members', isAuthUid: true })),
                ...adminsSnapshot.docs.map(d => ({ ...d.data(), id: d.id, collection: 'admins', isAuthUid: false }))
            ];

            stats.totalUsers = allDocs.length;
            setMigrationLog((prev: string[]) => [...prev, `Total users to process: ${stats.totalUsers}`]);
            setMigrationLog((prev: string[]) => [...prev, 'Starting badge recalculation...']);

            for (const userDoc of allDocs) {
                const data = userDoc as any;
                const docId = userDoc.id;
                const collectionName = userDoc.collection;

                // For Leaderboard, we need the Auth UID
                const authUid = collectionName === 'members' ? docId : data.uid;

                if (!authUid) {
                    setMigrationLog((prev: string[]) => [...prev, `⚠️ Skipping ${docId}: No Auth UID found.`]);
                    stats.skippedUsers++;
                    stats.errors++;
                    continue;
                }

                try {
                    // Fetch Projects for this user
                    const projectsRef = collection(db, 'members', authUid, 'projects');
                    const projectsSnap = await getDocs(projectsRef);
                    const userProjects = projectsSnap.docs.map(doc => doc.data());

                    // Calculate badges using safe method (preserves existing points)
                    const achievements = determineBadges({ uid: authUid, ...data }, userProjects);
                    const currentBadges = data.achievements || [];
                    
                    // Identify only newly earned badges (incremental approach)
                    const newBadges = achievements.filter(id => !currentBadges.includes(id));
                    const newBadgeXp = newBadges.reduce((sum, id) => sum + getBadgeXp(id), 0);

                    // Skip if no changes needed
                    if (newBadges.length === 0) {
                        stats.skippedUsers++;
                        count++;
                        batchCount++;
                        
                        // Still update lastBadgeScan to refresh the timestamp
                        const userRef = doc(db, collectionName, docId);
                        batch.update(userRef, { lastBadgeScan: Date.now() });
                        
                        if (batchCount >= 400) {
                            await batch.commit();
                            setMigrationLog((prev: string[]) => [...prev, `Processed ${count}/${stats.totalUsers} users...`]);
                            batchCount = 0;
                        }
                        continue;
                    }

                    // Update User Doc (in correct collection)
                    const userRef = doc(db, collectionName, docId);
                    
                    // Build update object - only update achievements and scan time
                    // DO NOT overwrite points - preserve existing transactional XP
                    const userUpdate: any = {
                        achievements: achievements,
                        lastBadgeScan: Date.now()
                    };
                    
                    // Only increment points for newly earned badges
                    if (newBadgeXp > 0) {
                        userUpdate.points = increment(newBadgeXp);
                    }
                    
                    batch.update(userRef, userUpdate);

                    // Update Leaderboard (Always uses Auth UID)
                    // Only update if there are new badge points to add
                    if (newBadgeXp > 0) {
                        const leaderboardRef = doc(db, 'leaderboard', authUid);
                        batch.set(leaderboardRef, { points: increment(newBadgeXp) }, { merge: true });
                    }

                    // Track statistics
                    stats.newBadgesAwarded += newBadges.length;
                    stats.totalXpAwarded += newBadgeXp;
                    stats.usersWithChanges++;
                    
                    setMigrationLog((prev: string[]) => [...prev, 
                        `✓ ${docId}: +${newBadges.length} badges, +${newBadgeXp} XP`
                    ]);

                    stats.processedUsers++;
                    count++;
                    batchCount++;
                    
                    if (batchCount >= 400) {
                        await batch.commit();
                        setMigrationLog((prev: string[]) => [...prev, `Processed ${count}/${stats.totalUsers} users...`]);
                        batchCount = 0;
                    }
                } catch (err) {
                    console.error(`Error processing user ${docId}:`, err);
                    setMigrationLog((prev: string[]) => [...prev, `❌ Error processing ${docId}: ${err}`]);
                    stats.errors++;
                    stats.skippedUsers++;
                }
            }

            // Commit remaining
            if (batchCount > 0) {
                await batch.commit();
            }

            // Final summary
            setMigrationLog((prev: string[]) => [...prev, '']);
            setMigrationLog((prev: string[]) => [...prev, '═══════════════════════════════════════']);
            setMigrationLog((prev: string[]) => [...prev, 'RECALCULATION COMPLETE']);
            setMigrationLog((prev: string[]) => [...prev, '═══════════════════════════════════════']);
            setMigrationLog((prev: string[]) => [...prev, `Total Users: ${stats.totalUsers}`]);
            setMigrationLog((prev: string[]) => [...prev, `Processed: ${stats.processedUsers}`]);
            setMigrationLog((prev: string[]) => [...prev, `Skipped (no changes): ${stats.skippedUsers}`]);
            setMigrationLog((prev: string[]) => [...prev, `Users with Changes: ${stats.usersWithChanges}`]);
            setMigrationLog((prev: string[]) => [...prev, `New Badges Awarded: ${stats.newBadgesAwarded}`]);
            setMigrationLog((prev: string[]) => [...prev, `Total XP Awarded: ${stats.totalXpAwarded}`]);
            setMigrationLog((prev: string[]) => [...prev, `Errors: ${stats.errors}`]);
            setMigrationLog((prev: string[]) => [...prev, '═══════════════════════════════════════']);

            alert(`Recalculation Complete!\\n\\nTotal Users: ${stats.totalUsers}\\nProcessed: ${stats.processedUsers}\\nNew Badges: ${stats.newBadgesAwarded}\\nTotal XP Awarded: ${stats.totalXpAwarded}\\nErrors: ${stats.errors}`);

        } catch (error) {
            console.error("Recalculation failed:", error);
            setMigrationLog((prev: string[]) => [...prev, `❌ Fatal Error: ${error}`]);
            alert(`Recalculation failed: ${error}`);
        } finally {
            setMigrating(false);
        }
    };"""

# We will replace the existing function with this new one.
# We need to find where the existing function ends.
# It starts at start_idx.
# We can assume it ends at the next "};" that is at the root indentation level (4 spaces).
# But indentation might vary.

# Let's try to match the exact string of the OLD function if possible.
# But we don't have it easily.

# Alternative: We know the function starts at `start_idx`. 
# We can iterate lines from there and count braces to find the end.

lines = content.split('\n')
func_start_line = -1
for i, line in enumerate(lines):
    if start_marker in line:
        func_start_line = i
        break

if func_start_line == -1:
    print("Function start line not found")
    exit(1)

# Count braces to find end
brace_count = 0
func_end_line = -1
found_start = False

for i in range(func_start_line, len(lines)):
    line = lines[i]
    brace_count += line.count('{')
    brace_count -= line.count('}')
    
    if brace_count > 0:
        found_start = True
    
    if found_start and brace_count == 0:
        func_end_line = i
        break

if func_end_line == -1:
    print("Function end line not found")
    exit(1)

print(f"Replacing lines {func_start_line} to {func_end_line}")

# Replace lines
new_lines = lines[:func_start_line] + new_logic.split('\n') + lines[func_end_line+1:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("Successfully updated AdminDashboard.tsx")

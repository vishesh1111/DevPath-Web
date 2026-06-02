NOTE: Due to not having login credentials I can't check the feature view.

# feat: add shareable Dev Profile Card to member profiles

## Summary

Introduces a new `DevCard` component that renders a full-width, glassmorphic developer
profile card directly inside the **Achievements** section of every member's profile page.
The card aggregates data that was already being written to Firestore (XP, rank, streak,
badges, GitHub stats) into a single shareable artefact.

Two actions are available:

- **Download Card** — captures the card at 2× resolution using `html2canvas` and saves
  it as a PNG named `devcard-{name}.png`
- **Copy Profile Link** — copies the user's public profile URL to the clipboard with a
  brief success state

---

## Motivation

Until now, sharing DevPath progress outside the platform meant sending the raw profile
URL, which requires the recipient to be logged in. This feature lowers that barrier and
makes community involvement visible on LinkedIn, GitHub READMEs, Discord profiles, etc.

---

## Files Changed

### `src/components/profile/DevCard.tsx` — NEW

The card component. Key implementation details:

**Avatar ring** — A `<div>` with `conic-gradient` background and a slow CSS `animation`
produces a continuously spinning rainbow ring. The inner `<Image>` sits in an absolutely
positioned layer above it.

**Animated counters** — A `useAnimatedCount(target, duration)` hook runs a
`setInterval` loop and interpolates from 0 to the target value over 1 400 ms (900 ms for
streak). Both counters fire on mount.

**Level badge** — `calculateLevel()` from `src/lib/points.ts` is called with `user.points`
and returns a `currentLevel` object whose `color` and `bg` Tailwind class strings are
resolved to CSS hex/rgba values via two lookup maps (`resolveLevelColor` / `resolveLevelBg`).
This avoids JIT purging issues with dynamically constructed class names.

**Global rank** — Fetched once on mount using the same `getCountFromServer` + `where('points', '>', user.points)`
query that `Achievements.tsx` already uses. Shows `—` while loading.

**Language bars** — A boolean state `langMounted` is set to `true` via `setTimeout(…, 500)`
after the card mounts. The CSS `transition: width 1.3s` then animates each bar from `0%`
to its real percentage.

**PNG download** — `html2canvas` is dynamically imported inside the click handler
(`await import('html2canvas')`). It never enters the server-side bundle.

**No emoji** — Every visual indicator (stat icons, section labels, badge chips, meta rows)
uses Lucide React icons exclusively.

**Stagger animation** — The left and right panels are wrapped in `motion.div` containers
with `variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}`.

---

### `src/components/profile/DevCard.module.css` — NEW

Scoped CSS for the card. Highlights:

- `conic-gradient` + `animation: spinRing 6s linear infinite` for the avatar ring
- Dot-grid `background-image: radial-gradient(circle, …)` overlay for texture
- Ambient dual-blob `::before` layer (cyan top-left, purple bottom-right)
- Gradient text via `-webkit-background-clip: text` for XP / rank / streak values
- `transition: width 1.3s cubic-bezier(0.19, 1, 0.22, 1)` on language bars
- Single `@media (max-width: 600px)` breakpoint that collapses to a single column

---

### `src/components/profile/UserProfile.tsx` — MODIFIED

```diff
+import DevCard from '@/components/profile/DevCard';
 ...
                     {/* GitHub Stats & Achievements Component */}
                     <Achievements />
+
+                    {/* Dev Profile Share Card */}
+                    <div>
+                        <div className="flex items-center gap-2 mb-5">
+                            <Share2 size={18} className="text-primary" />
+                            <h3 className="text-xl font-bold">Your Dev Card</h3>
+                            <span className="...">New</span>
+                        </div>
+                        <DevCard user={user} />
+                    </div>
```

---

### `package.json` — MODIFIED

```diff
+"html2canvas": "^1.4.1"
```

---

## Screenshots

> _Attach a screenshot of the rendered card and the downloaded PNG after testing._

---

## Testing Checklist

- [ ] Card renders for a user with GitHub connected (stars + language bars visible)
- [ ] Card renders for a user without GitHub connected (follower count shown, language
      section hidden)
- [ ] Card renders for a new user with 0 badges (empty hint shown with icon)
- [ ] XP counter animates from 0 on mount
- [ ] Streak counter animates from 0 on mount
- [ ] Level progress bar slides in from left on mount
- [ ] Level badge colour matches the correct tier from `LEVELS`
- [ ] Avatar ring spins continuously
- [ ] Download button produces a `devcard-{name}.png` at 2× resolution
- [ ] Downloaded PNG shows only the card (no browser chrome or surrounding page)
- [ ] Copy link button copies `{origin}/u?uid={uid}` and resets after 2.5 s
- [ ] Card stacks to single column on mobile (below 600 px)
- [ ] No console errors in development mode
- [ ] `html2canvas` does not appear in the server-rendered HTML (lazy-loaded only)

---

## Labels

`feature` · `gamification` · `profile` · `UI`

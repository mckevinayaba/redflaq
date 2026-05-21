# Mobile App Shell — v2 (Final)

Rebuild the mobile experience around your real hero (cream/serif, not dark) and the TikTok-style dock you picked. Resolve the duplicate "Verify" and put Connect + Base back into the dock.

## Final wireframe

```text
┌────────────────────────────────────────────┐
│  RedFlaq                  [3]   ( avatar ) │  ← Top bar (56px, cream/blur)
├────────────────────────────────────────────┤
│  SOUTH AFRICA'S SAFETY PLATFORM            │
│                                            │
│  South Africa knows                        │
│  about Gender Based                        │
│  Violence & Femicide                       │
│  (GBVF).                                   │
│  The question is why                       │  ← purple italic
│  you still aren't acting                   │
│  on what you know.                         │
│                                            │
│  Behavioral safety for people who refuse   │
│  to hand over their lives unverified.      │
│  Read daily. See the pattern.              │
│  Act before it becomes evidence.           │
│                                            │
│  │ Before you trust, RedFlaq first.        │  ← purple rule
│                                            │
│  ╭──────────────────────────────────────╮  │
│  │      Create Free Safety Base         │  │  ← purple pill
│  ╰──────────────────────────────────────╯  │
│  ╭──────────────────────────────────────╮  │
│  │      Read Today's Signal             │  │  ← outlined pill
│  ╰──────────────────────────────────────╯  │
│  Free account. No credit card. Pay only…   │
│                                            │
│                                  ╭─────╮   │
│                                  │  ✉  │   │  ← chat FAB
│                                  ╰─────╯   │
├────────────────────────────────────────────┤
│  🏠       📡      ╭───╮      📚      👥   │  ← Dock (72px)
│  Home   Signals  │ ✓ │     Base    Connect│
│                  ╰───╯                     │     ↑ raised purple Verify
└────────────────────────────────────────────┘
```

## Decisions locked in

- **Top bar**: Logo (left) · Credits chip "3" + circular profile avatar (right). **No Verify pill here** — single source of truth.
- **Bottom dock (5 tabs)**: Home · Signals · **Verify** (raised purple FAB, center) · Base · Connect.
- **Journal** moves inside Base as a sub-tab (alongside Saved Reports & Saved Signals). Frees up a dock slot for Connect.
- **Profile** opens from the top-right avatar (sheet/drawer with Account, Help, Payments, Sign out).
- **Hero theme**: cream `#F5F0EB` background, black DM Serif headline, `#7C3AED` italic continuation, two pill CTAs, purple-rule pull-quote, chat FAB above the dock. Matches your attached screenshot exactly.

## Files to change

**Replace** `src/components/mobile/MobileTabBar.tsx` — 5 tabs in the order above, raised center Verify (-top-10, 56px, purple, 4px cream border), label "VERIFY" in JetBrains Mono.

**Replace** `src/components/mobile/MobileTopBar.tsx` — cream/blur bg, logo left, credit chip + profile avatar right. Remove "Verify" pill. Avatar opens a profile sheet (new `MobileProfileSheet.tsx`).

**Replace** `src/components/mobile/screens/MobileHome.tsx` — cream hero exactly matching the screenshot (eyebrow, serif headline, purple italic, body, pull-quote, two pill CTAs, microcopy, chat FAB). Auth-aware: signed-out shows full hero; signed-in shows compact greeting + Daily Signal card + last check status + quick Verify card.

**Update** `src/components/mobile/screens/MobileBase.tsx` — add 3rd segment "Journal" alongside Saved Reports & Saved Signals.

**Keep** `MobileSignals.tsx`, `MobileConnect.tsx` as-is (already cream-friendly or themed to their surface).

**New** `src/components/mobile/MobileProfileSheet.tsx` — bottom sheet (shadcn `Sheet`) triggered by avatar; links to Account, Payments, Help, Sign out.

**Update** `src/App.tsx` — `MobileShell` routes already include /dashboard, /signals, /connect, /search-form, /results. Add `/dashboard/journal` and `/dashboard/reports` to keep dock visible.

**Update** `src/pages/JournalList.tsx` — on mobile, redirect/render inside Base (segment = journal) instead of its own screen.

## Out of scope

- No DB or RLS changes.
- No edits to desktop layouts (`useIsMobile()` branch only).
- No new edge functions, payments, or Capacitor/PWA work.

## Build order

1. New `MobileTopBar` (no Verify pill) + `MobileProfileSheet`.
2. New `MobileTabBar` (5 tabs, raised Verify, Connect restored).
3. Rewrite `MobileHome` to match the cream hero screenshot.
4. Add Journal segment to `MobileBase`; redirect mobile `/dashboard/journal` into it.
5. Verify visually at 390×844 in the preview.

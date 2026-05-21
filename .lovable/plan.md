# RedFlaq Mobile-First v3 — "Daily Safety Habit"

## The thinking (Godin · Hormozi · Jobs)

- **Godin (permission + tribe):** one promise — *"Before you trust, RedFlaq first."* Every screen earns the next tap. No dead ends, no noise.
- **Hormozi (value + friction):** one job-to-be-done per screen. Verify in ≤2 taps from anywhere. Free Safety Base = the hook; R99 check = the offer; daily Signal = the retention loop.
- **Jobs (subtraction):** kill anything that isn't Verify, Learn, or Protect. One primary action per screen. No second CTA competing with the first.
- **Great app design:** thumb-zone first, 60fps motion, haptics on key actions, instant skeletons, zero modal stacking, offline-tolerant.

## What changes

### 1. Remove Connect entirely
- Delete the Connect tab, `MobileConnect.tsx`, `/connect` route entry from mobile shell, and any nav references.
- Archive (don't delete) any Connect-only DB tables behind a feature flag — out of scope for this plan; UI-only removal now.

### 2. New 4-tab dock (thumb-perfect)
```text
 Home  ·  Signals  ·  [ VERIFY ]  ·  Base
                       raised FAB
```
- **Home** — daily pulse, streak, one CTA.
- **Signals** — daily learning feed (the habit).
- **Verify** — raised purple FAB, the money action.
- **Base** — your stuff: Saved Reports · Saved Signals · Journal · Profile entry.

Profile avatar stays top-right (sheet), credits chip stays top-right. Logo top-left.

### 3. The daily habit loop (retention engine)
Every open of the app lands on a **Daily Pulse** card:
- Streak counter ("Day 7 · keep it going")
- One Signal of the day (15-sec read)
- One micro-action ("Check a number you saved last week?")
- Subtle nudge to Verify if credits > 0

Push-style in-app prompt once/day (no real push yet — banner only).

### 4. Frictionless Verify (≤2 taps from anywhere)
- FAB always visible.
- Verify screen: single input (name OR ID OR phone), province auto-detected, one button.
- Pre-fill last search. Recent searches as chips.
- Result in <3s skeleton → risk band → one clear next action.

### 5. Onboarding (15 seconds, no signup wall)
- 3 swipe cards: *What it is · Why it matters · Your first check is free to preview*
- Land on Home with a sample Signal already loaded.
- Signup only when saving or paying. (Godin: earn permission.)

### 6. Visual & motion polish
- Cream `#F5F0EB` + purple `#7C3AED` + ink black — locked.
- DM Serif Display headlines, Syne mid, JetBrains Mono micro-labels.
- Spring transitions between tabs (Framer Motion `layoutId` on FAB).
- Haptic feedback on Verify tap, streak increment, result reveal (Capacitor-ready hook, no-op on web).
- Skeleton screens everywhere — never a spinner.
- 60fps scroll: virtualize Signals feed.

### 7. Empty states that sell
Every empty state = a soft CTA, not a sad face. "No saved reports yet — your first check stays here forever."

## Out of scope (call out explicitly)
- No DB schema changes.
- No payment changes.
- No desktop redesign — desktop keeps current layout.
- No real push notifications / Capacitor build yet (hooks only).
- No AI chatbot changes.

## Build order
1. Strip Connect from `MobileTabBar`, `MobileShell`, routes, and delete `MobileConnect.tsx`.
2. Rebuild `MobileTabBar` as 4-tab with raised Verify FAB.
3. Add `DailyPulse` component + streak hook (`useDailyStreak`, localStorage-backed for now).
4. Rebuild `MobileHome` around Daily Pulse (auth-aware: guest hero stays, signed-in shows Pulse).
5. Tighten `MobileVerify` screen to single-input flow with recent-search chips.
6. Add 3-card onboarding (`MobileOnboarding.tsx`) shown once via localStorage flag.
7. Add Framer Motion spring transitions + haptic hook stub.
8. QA at 390×844 and 360×800.

## Technical notes
- Streak: `localStorage` key `rf_streak` = `{ count, lastOpenISO }`. Increment if `lastOpen` is yesterday; reset if older; no-op if today.
- Onboarding flag: `localStorage` key `rf_onboarded_v3`.
- Haptics: `src/hooks/useHaptics.ts` — checks `window.navigator.vibrate` web fallback; Capacitor `Haptics` plugin if `window.Capacitor` exists.
- Route cleanup: remove `/connect`, redirect to `/` if hit.
- Keep all existing Supabase calls intact.

Approve and I'll build it.

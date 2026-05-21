# Mobile-first everywhere — phone frame on desktop

Make the mobile app the **only** experience. Desktop visitors see the same app, centered inside a phone frame on a dark backdrop (like Instagram / TikTok web).

## Two changes only

### 1. `src/hooks/use-mobile.tsx`
Force `useIsMobile()` to always return `true`. Every screen that branches (`Home`, `Dashboard`, `Signals`, `JournalList`, etc.) will now render its mobile version on any width.

### 2. `src/App.tsx`
Wrap `<Routes>` in a new `PhoneFrame` component:
- On screens **<768px**: pass-through, full-bleed (mobile gets the real app).
- On screens **≥768px**: dark `#0a0a0a` backdrop, app content centered, **max-width 430px**, full-height, subtle border + shadow so it reads as a phone.
- **Excludes `/admin/*` routes** — admin stays full-width (internal tooling).

## What this fixes
- Your published site at 1090px will now show the cream hero + 5-tab dock + Daily Pulse, exactly like the phone preview.
- One source of truth — no more divergent desktop/mobile screens.

## Out of scope
- No content/copy changes.
- No DB, payments, auth.
- Admin tools keep desktop layout.

Approve and I ship.

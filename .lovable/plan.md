# Add Journal as 5th dock tab (bottom-right)

## New dock order
```text
 Home  ·  Signals  ·  [ VERIFY ]  ·  Base  ·  Journal
                       raised FAB              (right)
```

5 tabs, TikTok-style — Verify stays the raised center FAB, Journal takes the far-right slot.

## Changes

1. **`src/components/mobile/MobileTabBar.tsx`** — add a `journal` tab after `base` with the notebook icon. Route: `/dashboard/journal`. Active match: `p.startsWith("/dashboard/journal")`.
2. **`src/components/mobile/screens/MobileBase.tsx`** — remove the Journal segment (was 3rd). Base goes back to 2 segments: Saved Reports · Saved Signals.
3. **`src/components/mobile/MobileShell.tsx`** — no change (route already in `SHELL_ROUTES` via `/dashboard/*`).

## Out of scope
No journal feature changes, no DB, no desktop. Pure nav move.

Approve and I ship it.

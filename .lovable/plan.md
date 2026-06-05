## Problem

On `/dashboard/new-check`, the page is stuck on "Loading balance…" and never shows the form OR the **Buy Checks** button — so the user has no way to pay.

## Root cause

`src/hooks/useCredits.ts` initializes `loading: true` and only sets it to `false` inside `fetchCredits`. But `fetchCredits` early-returns when `userEmail` is falsy:

```ts
const fetchCredits = useCallback(async () => {
  if (!userEmail) return;   // ← loading stays true forever
  ...
  setLoading(false);
}, [userEmail]);
```

It also never catches Supabase errors. If the `purchases` or `manual_payments` query throws (RLS denial, network blip, etc.), the promise rejects and `setLoading(false)` is never reached.

In `DashboardNewCheck.tsx`, while `creditsLoading === true`:
- The "Loading balance…" pill renders
- The form is hidden (`!hasCredits && !creditsLoading` is false)
- The "Buy Checks" CTA is hidden (same condition)

Result: dead-end screen. This matches the screenshot exactly.

## Fix

Single-file change to `src/hooks/useCredits.ts`:

1. When `userEmail` is falsy → `setCredits(0)` + `setLoading(false)` and return.
2. Wrap the two Supabase queries in `try/catch`. On error: log, default credits to 0, and still `setLoading(false)` in a `finally` block.
3. Keep realtime + polling behaviour unchanged.

## Out of scope

- No changes to payment edge functions, Yoco flow, or `PaymentModal` — the existing **Buy Checks → BuyChecksModal → Yoco** path works once the CTA is reachable.
- No DB / RLS changes.
- No UI redesign.

## Verification

- Load `/dashboard/new-check` while signed in with 0 credits → "No checks remaining" banner + **Buy Checks** button visible within ~1s.
- Click **Buy Checks** → modal opens → Yoco redirect works.
- Signed-in user with credits → form renders normally.

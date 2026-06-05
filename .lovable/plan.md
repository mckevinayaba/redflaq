## Goal
Make every public/mobile Verify entrypoint send signed-out users to registration first, instead of landing on the paid check screen and seeing “Loading balance…”.

## Plan
1. Route the mobile Verify CTA through the existing auth gate.
   - Update the mobile bottom-tab Verify action so it behaves like the other guarded “Run a Check” buttons.
   - Signed-out users should go to `/signup` first.
   - Signed-in but unverified users should go to `/verify-email`.
   - Signed-in verified users can continue to the payment/check flow.

2. Add a direct guard on the check page itself.
   - Protect `/dashboard/new-check` so unauthenticated users are redirected away immediately instead of rendering the credits loader.
   - This makes the page safe even if someone opens the route directly or from an old cached link.

3. Keep the paid flow only for eligible users.
   - Preserve the existing behavior where verified signed-in users without credits can continue to pricing/payment.
   - Preserve the existing behavior where users with credits can access the form.

4. Remove the confusing dead-end state for signed-out visitors.
   - Ensure signed-out visitors never see “Loading balance…” on the Verify path.
   - If needed, adjust the page copy/logic so the loading state is only used for authenticated balance fetches.

## Technical details
- Likely files:
  - `src/components/mobile/MobileTabBar.tsx`
  - `src/pages/DashboardNewCheck.tsx`
  - possibly `src/hooks/useAuthGuard.ts` if the guarded flow needs a small refinement
- No backend/database changes are needed.
- No payment provider changes are needed.
- Scope stays focused on Verify entry, auth gating, and the confusing loading state.
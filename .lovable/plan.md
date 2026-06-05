## Goal
Make the post-payment experience do what you intended: after a successful Yoco payment, a verified user should be taken straight into the Verify screen without getting stuck or having to guess what to do next.

## Plan
1. Update the payment success page to automatically continue into Verify.
   - Detect when the user came back from a successful payment.
   - If the user is signed in, automatically route them to `/dashboard/new-check` once credits are confirmed.
   - Keep a clear fallback button in case the redirect is delayed.

2. Add a proper payment-confirmation wait state.
   - Poll for the user’s credits on the payment success page for a short period instead of assuming the webhook finished instantly.
   - Show a specific “confirming your payment and preparing your check” state while waiting.
   - If credits appear, continue automatically.

3. Handle the signed-out and email-mismatch cases clearly.
   - If the payer is not signed in, route them to sign in/sign up with the same email used for payment.
   - Show a precise message when payment succeeded but credits are not yet available because the account email does not match the payment email.

4. Make the Verify page aware of fresh payments.
   - Preserve the existing admin bypass.
   - Keep the existing balance loading only for real authenticated credit fetches.
   - If the user arrived from payment, show a short, non-confusing “finalizing your credits” state instead of looking broken.

## Technical details
- Likely files:
  - `src/pages/PaymentSuccess.tsx`
  - `src/hooks/useCredits.ts`
  - `src/pages/DashboardNewCheck.tsx`
- No payment-provider change is needed.
- No new backend tables are needed.
- If necessary, I’ll also tighten the success-page logic around `payment_id`, `email`, and `from_payment` query params so the redirect remains reliable.

## Expected result
After email verification and successful payment:
- signed-in users are taken straight to Verify once credits land,
- signed-out users are directed to sign in with the same email,
- nobody is left on a vague success screen wondering what to do next.
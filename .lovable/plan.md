

## Problem Analysis

Two critical issues are blocking the payment → search flow:

### Issue 1: Stripe Webhook Failing (ROOT CAUSE)
The `stripe-webhook` function crashes on every Stripe event with:
```
SubtleCryptoProvider cannot be used in a synchronous context.
Use `await constructEventAsync(...)` instead of `constructEvent(...)`
```
This means payments complete on Stripe's side but credits are **never allocated** — the `manual_payments` row stays `pending` and no `purchases` record is created.

### Issue 2: Search Error Handling
When `multi-parameter-search` returns a 402 (no credits), the frontend `DashboardNewCheck` doesn't properly detect the redirect response from the edge function because `supabase.functions.invoke` wraps non-2xx responses as errors, so the `data?.redirect === '/pricing'` check never fires. The user sees a generic "We couldn't complete this search" instead of being redirected to pricing.

---

## Implementation Plan

### Step 1: Fix the Stripe webhook function
In `supabase/functions/stripe-webhook/index.ts`:
- Replace `stripe.webhooks.constructEvent(body, signature, webhookSecret)` with `await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)`
- This is the async-compatible method required in Deno's runtime

### Step 2: Fix search error handling for no-credits case
In `src/pages/DashboardNewCheck.tsx`:
- Update the catch block to better detect 402/no-credits responses from the edge function
- When `supabase.functions.invoke` returns a non-2xx status, the error object or data may contain the redirect info — handle both paths
- Show a clear "No credits" message and redirect to `/pricing`

### Step 3: Redeploy and verify
- Deploy the fixed webhook
- The next Stripe payment will properly trigger credit allocation
- Searches will correctly redirect to pricing when credits are exhausted


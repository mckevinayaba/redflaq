

## Fix: Payment Stuck on "Processing" Forever

### Root Causes (Two Issues)

**Issue 1 — Yoco webhook not receiving events:**
Yes, you need to configure the webhook URL in your Yoco dashboard. Without it, payments are never marked as "verified" in the database, so credits are never activated. The webhook URL is:
`https://gewwxdmxrwyosddczezg.supabase.co/functions/v1/yoco-webhook`

**Issue 2 — PaymentSuccess page never unlocks (even after 60s timeout):**
The page requires `user?.email` to start polling. But the checkout opens in a **new tab** (`window.open`), where the user may not be authenticated. If `user` is null, the polling never starts and the page stays on "Processing..." forever. The 60s auto-unlock never triggers.

Additionally, the checkout opens in a new tab but the user doesn't know to return — the flow is disjointed.

---

### Plan

**1. Fix PaymentSuccess.tsx — remove auth dependency for polling**
- Extract `email` from the URL search params (the `create-yoco-checkout` function already stores email in metadata and we have `payment_id`)
- Poll `manual_payments` by `payment_id` directly instead of requiring auth email — this works because the webhook updates status to "verified" by payment_id
- If no `user?.email` and no webhook has fired, fall back to checking `manual_payments` by `payment_id` only (no auth needed since `payment_id` is a secret token)
- Keep the 60s timeout but make it actually work regardless of auth state

**2. Fix PaymentModal.tsx — redirect in same tab**
- Change `window.open(url, '_blank')` to `window.location.href = url` so the user stays in the same browsing context and returns to the success page authenticated

**3. Fix the webhook to also update manual_payments credits**
- Currently the webhook updates `manual_payments.status` to "verified" but the polling also checks `search_credits - credits_used > 0`. Ensure `search_credits` is properly set (it already is from `create-yoco-checkout`).

**4. Add email as a URL param on success redirect**
- In `create-yoco-checkout`, append `&email=` to the successUrl so PaymentSuccess can poll by email even without auth

---

### Yoco Dashboard Setup (Required)

You must log into your Yoco Business Portal and add this webhook URL:
```
https://gewwxdmxrwyosddczezg.supabase.co/functions/v1/yoco-webhook
```
Subscribe to the `payment.succeeded` event. Without this, no payment will ever be verified automatically.


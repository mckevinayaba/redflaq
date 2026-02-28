

## Problem

The `stripe-webhook` edge function processes successful payments (updates `manual_payments`, creates `purchases` record) but **never sends a confirmation email** to the customer. That's why you've paid 3 times and received nothing.

The "processing" email was added to `multi-parameter-search` (which runs when a search starts), not when payment completes. There is no payment confirmation email in the Stripe flow at all.

## Fix

Add a payment confirmation email to `supabase/functions/stripe-webhook/index.ts` that fires after `checkout.session.completed` is processed successfully.

### Steps

1. **In `stripe-webhook/index.ts`**, after the DB inserts (around line 91), invoke `send-email` with the `admin_password` to send a branded confirmation email to the customer:
   - Subject: "Payment Confirmed — Your RedFlaq Safety Check Credits"
   - HTML template showing: amount paid, credits received, package type, and a link to start a search
   - Uses `Deno.env.get('ADMIN_PASSWORD')` for the `admin_password` field

2. **Redeploy** the `stripe-webhook` edge function.

### Email content
- From: `hello@redflaq.com` (handled by `send-email`)
- To: customer email from session metadata
- Includes credits count, expiry info, and a CTA to start searching at `https://redflaq.com/search-form?payment_id={paymentId}`


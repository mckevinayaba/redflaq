

# Enable Stripe Integration

## Steps

1. **Enable the Stripe integration** — you'll be prompted to paste your Stripe secret key (starts with `sk_` or `rk_`). It will be stored securely as a backend-only secret, never visible in the browser.

2. **Create a Stripe checkout backend function** — generates Stripe Checkout Sessions for your 3 packages (R99 / R249 / R399 in ZAR)

3. **Create a Stripe webhook handler** — listens for `checkout.session.completed` events, credits the user's account (mirrors your existing PayFast ITN flow)

4. **Update PaymentModal** — add a "Pay with Card (Stripe)" button alongside the existing PayFast option

5. **Update PaymentSuccess page** — handle Stripe's `?session_id=` return parameter alongside PayFast's `?payment_id=`

## Security
- Stripe secret key stored as a backend secret only
- Webhook validates Stripe signatures server-side
- No sensitive keys in frontend code


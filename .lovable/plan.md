

## Problem
`window.location.href` redirect to `checkout.stripe.com` is blocked by the preview iframe sandbox. The Stripe API call succeeds (200, valid URL returned) but the browser can't navigate to the external domain inside the iframe.

## Fix
Change the Stripe redirect in `PaymentModal.tsx` from `window.location.href` to `window.open(url, '_blank')` so checkout opens in a new tab. This works in both preview and production.

### Steps
1. In `src/components/PaymentModal.tsx`, replace `window.location.href = data.url` (Stripe) with `window.open(data.url, '_blank')`
2. Do the same for the PayFast redirect (`window.location.href = data.redirect_url`)
3. Optionally show a toast telling the user checkout opened in a new tab


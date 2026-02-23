

# PayFast Payment Integration for RedFlaq

## Overview

Replace the current manual EFT / "Paystack coming soon" payment flow with a live PayFast integration. Your PayFast Merchant ID and Key will be stored securely as backend secrets -- never in client-side code.

## How PayFast Works (High Level)

1. User clicks "Get 1 Check" (or 3 or 5)
2. Your app calls a backend function that generates a PayFast payment form with a signature
3. User is redirected to PayFast's hosted checkout page
4. After payment, PayFast sends a server-side notification (ITN) to confirm payment
5. Your backend verifies the notification, credits the user, and marks payment as complete
6. User is redirected back to RedFlaq with their credits ready

```text
User clicks CTA --> Backend generates signed payment --> Redirect to PayFast --> User pays
                                                                                    |
PayFast ITN (server callback) --> Backend verifies signature --> Credits user --> Done
```

## Step 1: Store PayFast Credentials Securely

Using the secrets management tool, we'll securely store:
- **PAYFAST_MERCHANT_ID** -- your PayFast Merchant ID
- **PAYFAST_MERCHANT_KEY** -- your PayFast Merchant Key
- **PAYFAST_PASSPHRASE** -- your PayFast passphrase (if you have one configured in PayFast settings; required for signature verification)

These are stored as encrypted backend secrets accessible only by backend functions -- never exposed to the browser or frontend code.

## Step 2: Create Backend Function `create-payfast-payment`

New file: `supabase/functions/create-payfast-payment/index.ts`

This function:
- Receives the selected package (single/triple/five) and user email
- Builds the PayFast payment data (merchant_id, merchant_key, amount, item_name, return_url, cancel_url, notify_url)
- Generates an MD5 signature using the passphrase
- Returns a redirect URL or the form data for the frontend to POST to PayFast

## Step 3: Create Backend Function `payfast-itn` (Instant Transaction Notification)

New file: `supabase/functions/payfast-itn/index.ts`

This function:
- Receives POST callbacks from PayFast when a payment completes
- Validates the signature to prevent fraud
- Verifies the payment status is "COMPLETE"
- Inserts/updates the `purchases` or `manual_payments` table with status "completed" and the correct credits
- Logs the transaction for admin review

Config: `verify_jwt = false` (PayFast calls this endpoint directly, no auth token)

## Step 4: Update Payment Modal (`src/components/PaymentModal.tsx`)

Replace the current EFT bank details UI with a cleaner PayFast checkout flow:
- Keep the package selector and email input
- Replace the "I've Paid - Send Me Link" button with "Pay Securely with PayFast"
- On click: call the `create-payfast-payment` backend function, then redirect to PayFast
- Remove all manual bank transfer / WhatsApp payment sections

## Step 5: Update Pricing Badge

In `src/components/landing/PricingPlinq.tsx`:
- Change "Secure Checkout - Paystack (Coming Soon)" to "Secure Checkout via PayFast"

## Step 6: Update Demo Mode References

In these files, change "Paystack" text to "PayFast":
- `src/pages/Signup.tsx` -- demo mode banner
- `src/pages/DashboardNewCheck.tsx` -- demo mode notice
- `src/hooks/useAuthGuard.ts` -- code comment

## Step 7: Add PayFast Return/Cancel Pages

Create a simple return page or update existing routes to handle:
- `/payment-success` -- "Payment confirmed! Your credits are ready." with link to dashboard
- `/payment-cancelled` -- "Payment cancelled. You can try again anytime." with link back to pricing

## Files Summary

### New Files
| File | Purpose |
|---|---|
| `supabase/functions/create-payfast-payment/index.ts` | Generates signed PayFast payment redirect |
| `supabase/functions/payfast-itn/index.ts` | Handles PayFast server-side payment confirmation |

### Modified Files
| File | Change |
|---|---|
| `src/components/PaymentModal.tsx` | Replace EFT UI with PayFast redirect flow |
| `src/components/landing/PricingPlinq.tsx` | Update badge from "Paystack" to "PayFast" |
| `src/pages/Signup.tsx` | Update demo mode text |
| `src/pages/DashboardNewCheck.tsx` | Update demo mode text |
| `supabase/config.toml` | Add `payfast-itn` and `create-payfast-payment` function configs |
| `src/App.tsx` | Add payment success/cancel routes |

### Unchanged
- Homepage hero, pricing amounts, search form, admin panel, all existing features

## Security Notes
- PayFast Merchant ID and Key are stored as encrypted backend secrets only
- The ITN endpoint validates PayFast's signature before crediting any user
- No payment credentials are ever sent to or visible in the browser


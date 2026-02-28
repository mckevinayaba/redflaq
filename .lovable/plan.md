

## Current State

Resend is **already fully integrated** via the `send-email` edge function. It uses the Resend REST API with the `RESEND_API_KEY` secret (already configured). The domain was just updated to send from `noreply@redflaq.com`.

Three edge functions already call `send-email` to deliver transactional emails:
- `multi-parameter-search` — sends search results / discreet mode reports
- `admin-verify-payment` — sends payment confirmation with search link
- `send-welcome-email` — sends welcome email on signup

## What Needs to Change

No npm install or client-side utility file is needed — this is a backend-only integration running in edge functions. The requested changes map to:

### 1. Update sender address from `noreply@` to `hello@redflaq.com`
Change the `from` field in `supabase/functions/send-email/index.ts` from `noreply@redflaq.com` to `hello@redflaq.com`.

### 2. Fix hardcoded `redflaq.co.za` URLs in email templates
Two edge functions still reference the old `.co.za` domain in their HTML email templates:
- `supabase/functions/multi-parameter-search/index.ts` (line 707): privacy/terms links
- `supabase/functions/admin-verify-payment/index.ts` (line 65): search URL

Update all instances to `redflaq.com`.

### 3. Add a branded "check is processing" confirmation email
Create a new email trigger in the `multi-parameter-search` function (or the payment flow) that sends a "Your Safety Check is Processing" email using the HTML template provided, immediately when a search is initiated.

### 4. Redeploy affected edge functions
Deploy `send-email`, `multi-parameter-search`, and `admin-verify-payment`.




# RedFlaq Pre-Launch Audit — Full Status Report

## Summary

The platform is largely functional with solid architecture. There is **one critical blocker** (confirmation emails not sending) and several medium/low issues to address before launch.

---

## CRITICAL — Must Fix Before Launch

### 1. Confirmation Emails Not Sending
**Status:** BROKEN
**Impact:** Users cannot confirm their accounts. No one can complete signup.

The `auth-email-hook` edge function is deployed and the code is correct, but **auth events are not being routed to it**. Edge function logs show only boot/shutdown cycles — zero actual webhook invocations. The domain `notify.redflaq.com` is verified.

**Root cause:** The hook was never properly registered with Lovable's email routing system. Previous `scaffold_auth_email_templates` calls may not have completed the registration handshake.

**Fix:** Run `scaffold_auth_email_templates` again (this registers the hook), then immediately re-apply the custom branded signup template and redeploy. If scaffold reports `templates_already_exist`, approve the overwrite. After scaffolding, verify by signing up with a fresh email and checking edge function logs for "Received auth event" entries.

---

## MEDIUM — Should Fix Before Launch

### 2. 33 Pending Manual Payments Never Resolved
**Status:** DATA ISSUE
There are 33 `pending` records in `manual_payments`. These are likely abandoned Yoco checkout sessions. Not a bug per se, but could confuse admin reporting. Consider adding a cleanup job or filtering these out of admin views.

### 3. Password Reset Page Uses Old Branding
**Status:** COSMETIC
`ResetPassword.tsx` uses the old text-based hexagon logo instead of the official `redflaq-logo-official.png`. Also uses the old cream `#F7F4F0` background instead of the dark theme used everywhere else in auth.

### 4. 3 Users Missing Profiles
**Status:** DATA GAP
10 auth users, only 7 profiles. The `on_auth_user_created` trigger exists and works correctly now, but 3 users signed up before it was added. These users may see "Welcome back" with no name.

**Fix:** Backfill profiles for the 3 missing users via a one-time migration.

### 5. Gazette Records Empty
**Status:** DATA GAP
`gazette_records` table has 0 rows. The feature exists (admin upload + AI extraction) but no data has been imported yet. The search engine will work without it, but it's one of three advertised data sources.

### 6. 2 Unconfirmed Users Stuck
**Status:** DATA
`emma@quiding.co.za` and `testuser@redflaq.com` have `email_confirmed_at = null`. If these are test accounts, consider cleaning them up. If real, they couldn't confirm because emails weren't sending.

---

## LOW — Nice to Fix

### 7. `send-email` Resend Integration
**Status:** WORKING (if RESEND_API_KEY is valid)
The `send-email` function (used for transactional emails like payment receipts and admin notifications) uses Resend with `hello@redflaq.com` as sender. This is separate from the auth email hook. Verify the RESEND_API_KEY is still active.

### 8. Landing Page Claims "1,000+ checks done"
**Status:** INACCURATE
Database shows 37 total searches. This claim should either be removed or changed to "Launching now" / softer social proof until real volume exists.

### 9. `academy/:slug` Redirect Broken
**Status:** MINOR BUG
Route `<Navigate to="/blog/:slug" replace />` uses a literal `:slug` instead of the dynamic param. Should use a component that reads the param and redirects.

---

## WORKING CORRECTLY

| System | Status | Notes |
|--------|--------|-------|
| Yoco Checkout | ✅ | `create-yoco-checkout` and `yoco-webhook` both functional |
| Yoco Webhook | ✅ | Idempotent, creates purchases + sends receipt emails |
| Credit System | ✅ | Realtime subscriptions + polling fallback |
| Search Engine | ✅ | Multi-parameter search with 1,220 wanted persons + 143 SAFLII judgments |
| RBAC | ✅ | Owner role assigned to founder, `has_role` function works |
| RLS Policies | ✅ | Properly configured across all tables |
| Dashboard | ✅ | Auth guard, credit display, search history |
| Signup Form | ✅ | Validation, password strength, consent checkbox |
| Verify Email Page | ✅ | Resend button, status check |
| Payment Success | ✅ | Optimistic UI with polling |
| PWA | ✅ | Configured with manifest, icons, shortcuts |
| POPIA Compliance | ✅ | Consent logging, no ID persistence |
| Domain Config | ✅ | All references use redflaq.com (no .co.za) |
| Secure Report Links | ✅ | 7-day token-based access |
| Admin Dashboard | ✅ | Users, payments, checks, analytics |
| Blog/Academy | ✅ | Working with redirects from old URLs |
| Safety Tips | ✅ | All tool pages functional |
| Partners | ✅ | Application form + admin management |

---

## Recommended Launch Sequence

1. **Fix email hook registration** (critical — blocks all signups)
2. **Backfill 3 missing profiles** (quick migration)
3. **Update ResetPassword branding** (5 min)
4. **Fix academy redirect** (2 min)
5. **Update social proof claim** (2 min)
6. **Test full flow**: Signup → Email → Confirm → Sign in → Buy checks → Run search → View results


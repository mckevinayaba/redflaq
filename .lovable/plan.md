

## Diagnosis

I investigated thoroughly and found two distinct issues:

### Issue 1: Signup confirmation emails may not be delivering

- **Jessica Scott** (jessicascott007@gmail.com) signed up at 15:50 UTC today. Her email is **not confirmed**.
- The `auth-email-hook` edge function has virtually no logs — just a "shutdown" message. This means the hook is likely **not registered** with the email routing system, so it's never being called when signup emails should be sent.
- The email queue infrastructure (`email_send_log` table etc.) does **not exist** — `setup_email_infra` was never run.
- Your email domain `notify.redflaq.com` **is verified and active**, so sending capability exists — but the hook isn't wired up.

### Issue 2: Rate limit on resend

- Jessica hit the built-in auth email rate limit when clicking "Resend" multiple times. The error "email rate limit exceeded" (429) is from the default auth rate limiter — it prevents more than one confirmation email per ~60 seconds per user. This is expected behavior and not a bug.

### Root Cause

The `auth-email-hook` was deployed as code but was never **registered** with the email system. Without registration, signup emails either fall back to a default sender (which may not be configured/working) or silently fail.

### Fix Plan

1. **Set up email infrastructure** — run `setup_email_infra` to create the email queue tables, cron job, and dispatcher function.

2. **Re-scaffold and register the auth-email-hook** — use the scaffolding tool (with overwrite) to properly register the hook with the email routing system. This is the critical step — deployment alone is not enough.

3. **Redeploy the auth-email-hook** — deploy the updated function so the registration takes effect.

4. **Manually confirm Jessica's email** — since she's stuck, we can confirm her email directly so she can use the platform now.

5. **Add a cooldown timer to the Resend button** — show a countdown (e.g. 60s) after clicking Resend so users don't repeatedly trigger the rate limit and see the scary red error.

No other code changes needed — the email templates already exist and are well-designed.


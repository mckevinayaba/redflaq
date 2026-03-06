

## Problem Confirmed

The `auth-email-hook` function is deployed but **never receives any auth events**. Evidence:
- Zero HTTP requests to the function in edge logs
- Zero "Received auth event" log entries
- Only boot/shutdown cycles from preview health checks
- Domain `notify.redflaq.com` IS verified and ready
- Auth logs show signups happening (`user_repeated_signup`) but no email hook is triggered

**Root cause**: The hook was never properly registered with the email routing system. Previous attempts to scaffold may not have completed the registration.

## Fix Plan

### Step 1: Re-scaffold auth email templates (critical registration step)
Call `scaffold_auth_email_templates` — this is the ONLY way to register the function as the active auth email handler. Without this registration, the function exists but auth events are never routed to it.

### Step 2: Re-apply custom branded signup template
After scaffolding overwrites files, restore `signup.tsx` with the RedFlaq branding:
- Dark header with RedFlaq logo from `https://redflaq.lovable.app/redflaq-logo-email.png`
- Subtitle: "Public Record Safety Check · South Africa"
- Headline: "Welcome! 💜"
- Purple "Confirm Your Email →" CTA button linking to `confirmationUrl`
- Benefits section (safety check, risk report, confidentiality)
- Branded footer with Setup A Startup (Pty) Ltd

### Step 3: Re-apply custom subject line and config in auth-email-hook/index.ts
- Subject: `'Welcome to RedFlaq — one click to activate your account'`
- SITE_NAME: `"redflaq"`
- SENDER_DOMAIN: `"notify.redflaq.com"`
- ROOT_DOMAIN: `"redflaq.com"`
- FROM_DOMAIN: `"redflaq.com"`

### Step 4: Deploy
Call `deploy_edge_functions(["auth-email-hook"])` to push live.

### Step 5: Test with curl
Use `curl_edge_functions` to hit the function and verify it responds, confirming deployment succeeded.

### Step 6: Delete the existing unconfirmed user and re-test
The account `dormithienne@gmail.com` is stuck as `user_repeated_signup`. After deployment, you should sign up with a fresh test email to verify the full flow works — one email, one click.


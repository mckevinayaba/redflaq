

# Email Delivery Status

## The Problem

The email **code** is built and ready — the `send-email` edge function exists and works. But the actual **RESEND_API_KEY secret is not configured** in your project. Without it, the function just logs emails to the console instead of sending them.

Your admin dashboard correctly shows this warning. Here is what is missing:

## What You Need To Do (outside Lovable)

1. Go to **https://resend.com** and create a free account (100 emails/day free tier)
2. **Verify your domain** at https://resend.com/domains — add `redflaq.co.za` and set the DNS records they give you (SPF, DKIM, DMARC). Without this, emails from `noreply@redflaq.co.za` will be rejected
3. **Create an API key** at https://resend.com/api-keys
4. Come back here and I will store it as a secure secret

## What I Will Do Once You Provide the Key

1. Store `RESEND_API_KEY` as a backend secret (accessible only by edge functions, never exposed to the browser)
2. Update the admin dashboard to check the secret dynamically instead of showing a hardcoded warning
3. The existing `send-email` function will immediately start working — no code changes needed, it already has the Resend integration built in

## What Is Already Wired

- `send-email` function: built, deployed, uses Resend API
- `payfast-itn` webhook: calls `send-email` when payment is confirmed
- Admin payment verification: calls `send-email` when manually approving payments
- The `from` address is already set to `RedFlaq <noreply@redflaq.co.za>`

## What Is NOT Yet Wired (will do after the key is added)

- Search completion email (send results link after a check finishes)
- Welcome email on signup
- These are quick additions once the key is live

## Summary

No code fix needed. You need to create a Resend account, verify the `redflaq.co.za` domain, get an API key, and give it to me. I will store it securely and emails will start flowing immediately.

Would you like to proceed? Go set up Resend and come back with the API key.


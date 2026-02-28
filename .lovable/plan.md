

## Why You're Not Receiving Emails

The issue is clear from the backend logs. Your emails are failing with a **403 error** from Resend:

> "The redflaq.co.za domain is not verified. Please, add and verify your domain on https://resend.com/domains"

**Root cause:** The `send-email` function sends from `noreply@redflaq.co.za`, but the `redflaq.co.za` domain has not been verified in your Resend account. Resend blocks all emails from unverified domains.

## How to Fix

You have two options:

### Option A: Verify `redflaq.co.za` in Resend (recommended)
1. Log in to your [Resend dashboard](https://resend.com/domains)
2. Add `redflaq.co.za` as a sending domain
3. Add the required DNS records (SPF, DKIM, DMARC) to your domain registrar (GoDaddy)
4. Wait for verification to complete — emails will start working immediately after

### Option B: Temporary fix — use Resend's default sender
If you want emails to work right now while you verify your domain, the `send-email` edge function can be updated to send from `onboarding@resend.dev` (Resend's free test domain). This works immediately but emails will come from a generic address instead of your brand.

## No Code Changes Needed

This is purely a domain configuration issue on the Resend side. Once `redflaq.co.za` is verified in Resend, all email flows (welcome, search results, discreet mode) will start working automatically.


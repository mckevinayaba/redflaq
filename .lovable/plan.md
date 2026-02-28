

## Issue

The `send-email` edge function hardcodes `from: 'RedFlaq <noreply@redflaq.co.za>'` but your primary domain is `redflaq.com`. The `.co.za` domain isn't verified in Resend, which is why emails fail.

## Fix

Update `supabase/functions/send-email/index.ts` to send from `noreply@redflaq.com` instead of `noreply@redflaq.co.za`.

### Steps
1. Change the `from` field in the Resend API call from `'RedFlaq <noreply@redflaq.co.za>'` to `'RedFlaq <noreply@redflaq.com>'`
2. Deploy the updated edge function

### Prerequisite
The `redflaq.com` domain must be verified in your Resend account. If it isn't yet, you'll need to add it at [resend.com/domains](https://resend.com/domains) and add the required DNS records (SPF, DKIM) in GoDaddy.


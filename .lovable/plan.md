

# WhatsApp Feature Audit

## What is working

| Component | Status | Evidence |
|-----------|--------|----------|
| **Database tables** | Working | `whatsapp_messages`, `whatsapp_conversations`, `whatsapp_openings` all exist with correct schemas and RLS policies |
| **Opening messages** | Working | 5 rotating openings stored and active in `whatsapp_openings` |
| **State machine logic** | Working | Edge function code handles START → MENU → CHECK_CONSENT → CHECK_NAME → CHECK_PROVINCE → CHECK_SENT flow correctly |
| **Conversation tracking** | Working | 3 conversations logged from test numbers (27000000000, 27820000000, 27820000001) with correct state transitions |
| **Message logging** | Working | 8 messages logged (inbound + outbound) with correct direction tagging |
| **Secrets configured** | Working | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` (1080092818511668), `WHATSAPP_VERIFY_TOKEN` (redflaq_verify_2025) all set |
| **WhatsApp landing page** | Working | `/whatsapp` page renders with CTA, steps, benefits, share button |
| **Centralized config** | Working | `src/constants/whatsapp.ts` has number, share messages, URL builders |
| **WhatsApp share button** | Working | Reusable component used across the app |
| **WhatsApp banner** | Working | Drives users to `/whatsapp` page |
| **Followup function** | Deployed | Code looks correct for 2-hour reminder on stale CHECK_SENT conversations |
| **Webhook verification (GET)** | Working | Endpoint handles Meta hub.challenge correctly |
| **config.toml** | Working | Both `whatsapp-webhook` and `whatsapp-followup` set to `verify_jwt = false` |

## What is NOT working or uncertain

| Issue | Severity | Details |
|-------|----------|---------|
| **No webhook logs from real phones** | Critical | Edge function logs show zero requests for `whatsapp-webhook`. The 8 messages in the DB were likely from testing via `curl`/invoke, not from Meta forwarding real WhatsApp messages. This means **Meta is not delivering inbound messages to your webhook**. |
| **Meta webhook subscription likely incomplete** | Critical | Even though you configured the callback URL and verify token, Meta requires you to explicitly subscribe to the `messages` field under the specific WhatsApp Business Account. If only the webhook URL was verified but the `messages` field wasn't subscribed, no messages arrive. |
| **WHATSAPP_ACCESS_TOKEN may be temporary** | High | If this is a temporary developer token from the Meta App Dashboard, it expires after 24 hours. Outbound `sendWhatsAppMessage()` calls will silently fail with an OAuthException. You need a **permanent System User token**. |
| **No outbound delivery confirmation** | Medium | The webhook code doesn't check `res.ok` result from `sendWhatsAppMessage()` before logging as "outbound". If Meta rejects the send, the message is still logged as sent. |
| **Followup function never triggered** | Medium | No logs for `whatsapp-followup`. It needs to be invoked on a schedule (e.g., cron). There's no cron trigger configured — it will never run on its own. |
| **No error alerting** | Low | Errors in the webhook are caught and a 200 is returned to Meta, but no admin notification or logging to a monitoring table exists. Silent failures. |
| **Double-read of request body in error handler** | Low | The catch block calls `req.clone().json()` but `req.json()` was already consumed. While `clone()` should work, this is fragile. |

## Root cause of "messages not arriving"

The most likely issue is one of:
1. **Meta webhook field `messages` not subscribed** — verify in Meta Dashboard → WhatsApp → Configuration → Webhook fields that `messages` has a green checkmark
2. **WhatsApp Business Account not linked to the app** — the webhook must be registered under a WhatsApp Business Account that owns phone number +27663365296
3. **App not in Live mode** — if the Meta app is still in Development mode, only registered test numbers can send messages

## Recommended next steps

1. **Verify Meta Dashboard config**: Confirm `messages` field is subscribed, app is Live, and the WhatsApp Business Account is linked
2. **Generate a permanent System User token**: Replace the temporary access token to prevent 24h expiry
3. **Set up a cron for `whatsapp-followup`**: Use an external cron service (e.g., cron-job.org) to call the followup function every 2 hours
4. **Add send-failure handling**: Check `res.ok` in `sendWhatsAppMessage()` and log failures separately
5. **Test with a real phone**: Once Meta config is confirmed, send "Hi" from a real number and check logs again


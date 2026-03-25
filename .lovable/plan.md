

# WhatsApp Integration Audit

## Files Reviewed
- `supabase/functions/whatsapp-webhook/index.ts` -- main chatbot state machine
- `supabase/functions/whatsapp-followup/index.ts` -- 2-hour reminder cron
- `src/pages/WhatsApp.tsx` -- landing page
- `src/components/WhatsAppShareButton.tsx` -- share component
- `src/constants/whatsapp.ts` -- config and messages
- `src/components/landing/NavbarPlinq.tsx` -- navbar WhatsApp link
- References in 23 files total

---

## Findings

### 1. SECURITY -- No rate limiting on webhook (MEDIUM)
The `whatsapp-webhook` function processes every inbound message without any rate limiting. A malicious actor could spam the WhatsApp number and trigger unlimited database writes and outbound API calls.

**Fix**: Add per-phone-number rate limiting (e.g. max 20 messages per minute) using an in-memory map or database check.

### 2. SECURITY -- No input sanitization on name (MEDIUM)
In the `CHECK_NAME` state, the user's input is stored directly as `name_entered` and embedded into a URL via `buildCheckLink()`. While `encodeURIComponent` handles URL encoding, the name is also stored raw in the database with no length cap beyond `msgText.length < 2`.

**Fix**: Cap name input to 100 characters and strip control characters.

### 3. SECURITY -- Followup function has no auth guard (LOW)
`whatsapp-followup` is `verify_jwt = false` and has no internal authentication. Anyone who discovers the URL can trigger it. While it only sends reminders to existing conversations, it could be abused to spam users repeatedly if called in a loop (though the state transitions to FOLLOWUP_SENT, limiting this).

**Fix**: Add a shared secret header check or restrict to service-role calls only.

### 4. BUG -- Followup doesn't update `last_message_at` (LOW)
When the followup function sends a reminder, it updates `current_state` and `updated_at` but not `last_message_at`. This is minor since the state change to `FOLLOWUP_SENT` prevents re-sending, but it creates inconsistent data.

### 5. BUG -- Province matching is too loose (LOW)
The province matcher uses `.includes()` bidirectionally: `inputLower.includes(p) || p.includes(inputLower)`. This means typing just "e" would match "eastern cape" since `"eastern cape".includes("e")` is true.

**Fix**: Require exact match or at least a minimum input length of 3+ characters.

### 6. DATA -- Landing page says "in under 60 seconds" but bot sends a link (MISMATCH)
The WhatsApp page (step 03) says users "receive a result -- CLEAR, LOW, MODERATE, or HIGH RISK -- in under 60 seconds." But the actual bot sends a *link* to the website to complete the check. The result is not delivered in WhatsApp itself. This could mislead users.

**Fix**: Update the landing page copy to say "Get a link to complete your check in under 60 seconds" or similar.

### 7. CODE QUALITY -- Duplicated Meta API call logic
The `whatsapp-followup` function duplicates the Meta send logic that already exists in the webhook's `sendWhatsAppMessage()`. This means two places to update if the API version changes.

**Fix**: Extract shared WhatsApp send logic into `supabase/functions/_shared/whatsapp-send.ts`.

### 8. BRANDING -- Hardcoded source references remain
The webhook embeds `https://redflaq.com/dashboard/new-check` with `source=whatsapp` query params. These are fine. However, the bot messages and landing page do not reference "RedFlaq Verified Public Records Network" -- they still say "public safety records" and "safety check." This is consistent with the recent rebranding only being applied to result pages, not WhatsApp copy. Decide if WhatsApp messaging should also use the unified brand language.

### 9. UNUSED IMPORTS -- WhatsApp.tsx (TRIVIAL)
`Shield` and `ArrowRight` are imported from lucide-react but never used.

---

## Summary

| # | Issue | Severity | Type |
|---|-------|----------|------|
| 1 | No rate limiting on webhook | Medium | Security |
| 2 | No input sanitization/length cap on name | Medium | Security |
| 3 | Followup has no auth guard | Low | Security |
| 4 | Followup doesn't update `last_message_at` | Low | Bug |
| 5 | Province matching too loose | Low | Bug |
| 6 | Landing page copy mismatches bot behavior | Low | UX |
| 7 | Duplicated Meta API send logic | Low | Code quality |
| 8 | Branding not unified in WhatsApp copy | Info | Branding |
| 9 | Unused imports in WhatsApp.tsx | Trivial | Cleanup |

No critical or blocking issues. The integration is functional and well-structured. The medium-severity items (rate limiting and input sanitization) should be addressed before scaling WhatsApp traffic.

Want me to fix any or all of these?


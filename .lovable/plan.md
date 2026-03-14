

## Problem

The WhatsApp number constant in `src/constants/whatsapp.ts` is correctly set to `27663365296`, but the **navbar** and **footer** have the old placeholder `27000000000` hardcoded directly in their href attributes instead of using the shared constant.

Three hardcoded instances remain:
- `NavbarPlinq.tsx` line 159 (desktop WhatsApp link)
- `NavbarPlinq.tsx` line 394 (mobile WhatsApp link)
- `FooterPlinq.tsx` line 74 (footer WhatsApp link)

## Fix

**File: `src/components/landing/NavbarPlinq.tsx`**
1. Import `WHATSAPP_CHAT_URL` from `@/constants/whatsapp`
2. Replace `"https://wa.me/27000000000"` on lines 159 and 394 with `{WHATSAPP_CHAT_URL}`

**File: `src/components/landing/FooterPlinq.tsx`**
1. Import `WHATSAPP_CHAT_URL` from `@/constants/whatsapp`
2. Replace `"https://wa.me/27000000000"` on line 74 with `{WHATSAPP_CHAT_URL}`

This ensures all WhatsApp links use the single constant and any future number change only requires editing one file.


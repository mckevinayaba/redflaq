

# Remove WhatsApp API Integration

The WhatsApp API (Meta Cloud API chatbot, webhook, followup cron) needs to be disabled. Generic "share on WhatsApp" links (wa.me share URLs) are harmless and can stay — they don't use the API. Here's the separation:

## What to remove

### 1. Remove the `/whatsapp` page and route
- **`src/App.tsx`**: Remove the WhatsApp route and lazy import
- **`src/pages/WhatsApp.tsx`**: Delete this file entirely — it's the dedicated WhatsApp bot landing page with "Save RedFlaq on WhatsApp" and the bot flow explanation

### 2. Remove the WhatsApp bot CTA from About page
- **`src/pages/About.tsx`**: Remove the "WhatsApp Us" button that links to the bot number via `WHATSAPP_CHAT_URL`

### 3. Remove "WhatsApp Support" from feature lists
- **`src/components/landing/ValueStack.tsx`**: Remove the "WhatsApp Support — Direct line to RedFlaq team" item
- **`src/components/landing/FAQHormozi.tsx`**: Remove "WhatsApp support" from the free account FAQ answer

### 4. Edge functions — leave in place but note as disabled
The backend functions (`whatsapp-webhook`, `whatsapp-followup`) and database tables (`whatsapp_conversations`, `whatsapp_messages`, `whatsapp_openings`) stay untouched. They're not called from the frontend once the above references are removed. No data loss, easy to re-enable later.

## What stays (no API involved)
- **`src/components/WhatsAppShareButton.tsx`** — uses `wa.me/?text=` share links, no API
- **`src/pages/ResultsPageUpdated.tsx`** — share button after check results
- **`src/pages/JournalDetail.tsx`** — share journal entry via WhatsApp link
- **`src/pages/ConversationGuide.tsx`** — share on WhatsApp link
- **`src/components/tools/ToolLayout.tsx`** — share checklist on WhatsApp
- **`src/constants/whatsapp.ts`** — keeps share URL helpers; remove `WHATSAPP_NUMBER` and `WHATSAPP_CHAT_URL` (bot-specific), keep `getWhatsAppShareUrl` and `WHATSAPP_MESSAGES`
- **`src/pages/DataSources.tsx`** / **`src/pages/tools/TenantSafety.tsx`** — just mention "WhatsApp" as a word in text, not API-related

## Files changed
1. `src/App.tsx` — remove route + import
2. `src/pages/WhatsApp.tsx` — delete
3. `src/pages/About.tsx` — remove WhatsApp Us button
4. `src/components/landing/ValueStack.tsx` — remove WhatsApp Support item
5. `src/components/landing/FAQHormozi.tsx` — remove "WhatsApp support" from FAQ text
6. `src/constants/whatsapp.ts` — remove bot number/URL exports, keep share helpers




## Summary

Most of the requested features already exist from previous builds. The changes needed are primarily **content updates** to match the new emotional messaging, plus minor text/label tweaks.

### What already exists (no structural changes needed):
- WhatsApp number constant (`src/constants/whatsapp.ts`) — already set to `27663365296`
- WhatsApp share button on results page (`ResultsPageUpdated.tsx`)
- Post-check registration prompt for logged-out users (`PostCheckRegistrationPrompt.tsx`)
- `/whatsapp` page with hero, how-it-works, registration nudge, and share sections
- WhatsApp banner on homepage between MakeRedflaqHabit and Pricing
- Footer link "RedFlaq on WhatsApp" → `/whatsapp`
- Route registered in `App.tsx`

### Changes Required:

**1. `src/constants/whatsapp.ts`** — Update the `shareAfterCheck` message to the new emotional story text ("She loved him...Forward this to every woman you love.")

**2. `src/components/PostCheckRegistrationPrompt.tsx`** — Update body text to include Affidavit Builder and GBV helplines: "Create a free account to save your check history, access your private Safety Journal, build an Affidavit if you need one, and get GBV helplines across all 9 provinces. No credit card needed."

**3. `src/pages/WhatsApp.tsx`** — Multiple content updates:
- Hero body text: Replace generic text with the emotional story ("She loved him...RedFlaq was built so that story ends differently for the next woman.")
- Step 4 description: Add "access your Safety Journal, and build an Affidavit"
- Benefits section: Change headline to "Your free account does more than save a check." and update to 4 benefits (Safety Journal, Affidavit Builder, Saved check history, GBV helplines)
- Share section: Change headline to "Share RedFlaq with someone you love.", update body text, change button label to "Forward on WhatsApp", update share message to the new emotional story text
- Update `chatbotStart` message in constants to match the new prefilled text

**4. `src/components/WhatsAppBanner.tsx`** — Update banner text to "RedFlaq is now on WhatsApp. Check anyone without leaving your chat." and link text to "See how it works →" (minor wording change from "Learn" to "See")

**5. `src/constants/whatsapp.ts`** — Add a new `emotionalShare` message constant for the long emotional story, used by both the results share button and the /whatsapp share section. Update `groupShare` to use this same message.




## Plan: Update Social Media Links in Footer

**What needs to change:**

Update `src/components/landing/FooterPlinq.tsx` (lines 76-79) to use the correct social media URLs and add Facebook:

- Replace `"X"` → `"Facebook"` with URL `https://www.facebook.com/RedFlaqSafety/`
- Update Instagram URL to `https://www.instagram.com/redflaqsafety/`
- LinkedIn URL is already correct: `https://www.linkedin.com/company/redflaq/`

Also make the social links more visible — increase font size from 11px to 13px, brighten the default color from `rgba(255,255,255,0.35)` to `rgba(255,255,255,0.6)`, and add simple icon indicators (emoji or text) so they stand out as clickable social links.

**Files to edit:**
- `src/components/landing/FooterPlinq.tsx` — update social media array and styling (lines 75-82)


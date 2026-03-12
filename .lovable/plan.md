

## Analysis

The user wants two fixes:

1. **Restore warm beige backgrounds** — The screenshots clearly show the warm beige/off-white (#F5F0EB) background that was previously changed to #FFFFFF. The user wants this restored across the entire site.

2. **Restore McKevin Ayaba's photo** — His photo (`src/assets/mckevin-ayaba.png`) exists but isn't used in `WhyRedflaqSection.tsx`.

3. **Restore round colored circles on "What your report reveals"** — Screenshot (image-91) shows large round colored circles (red, amber, orange, green) centered above each card with white background and colored badge pills at bottom. The current dark "intel report" cards need to revert to this centered circle layout.

## Plan

### Fix 1: Restore warm beige background globally

Change `background: '#FFFFFF'` back to `background: '#F5F0EB'` in all light sections. Files to update:

- `src/index.css` — CSS variables `--paper` and `--cream`, `html`/`body` background
- `src/pages/Index.tsx` — main wrapper
- `src/components/landing/HeroPlinq.tsx`
- `src/components/landing/HowItWorksPlinq.tsx`
- `src/components/landing/RiskLevelsSection.tsx` — section bg
- `src/components/landing/PricingPlinq.tsx`
- `src/components/landing/SearchOptionsSection.tsx`
- `src/components/landing/NavbarPlinq.tsx` — scrolled state
- `src/components/landing/PhotoGrid.tsx`
- `src/components/landing/WhoRedflaqHelps.tsx`
- `src/components/landing/ShareSection.tsx`
- `src/components/landing/AdvocacySection.tsx`
- `src/components/landing/CommunityImageStrip.tsx`
- `src/components/landing/VerificationProgress.tsx`
- `src/components/landing/EmptyState.tsx`
- All other pages: About, Blog, Academy, SafetyTips, Partners, DataSources, Dispute, etc.
- `src/components/tools/ToolLayout.tsx`

Dark sections (TestimonialsSectionNew, FAQPlinq, FooterPlinq, RealitySection, WhyRedflaqSection) already use dark backgrounds — leave untouched.

### Fix 2: Restore McKevin's photo

In `WhyRedflaqSection.tsx`:
- Import `mckevinPhoto from "@/assets/mckevin-ayaba.png"`
- Add an organic-frame photo element (same style as Nthabi's) in McKevin's card section

### Fix 3: Restore round colored circles on risk levels

Revert `RiskLevelsSection.tsx` to show:
- Centered layout per card (not left-aligned dark cards)
- Large round colored circle above each card (matching red/amber/orange/green from screenshot)
- White card background on beige section background
- Colored badge pills at bottom of each card ("HIGH RISK", "MODERATE RISK", etc.)
- Remove the dark #0F0D1A background and left-border intel style




## Plan: Restore AdvocacySection and FinalCTAPlinq to Landing Page

The three screenshots show:
1. **Hero** (image-143) — already on the page, no change needed
2. **AdvocacySection** (image-142) — the RedFlaq advocacy badge + "Verify Someone Now — R99" CTA. Component exists at `src/components/landing/AdvocacySection.tsx` but is not in `Index.tsx`
3. **FinalCTAPlinq** (image-144) — "Before you trust, verify." over Joburg skyline. Component exists at `src/components/landing/FinalCTAPlinq.tsx` but `Index.tsx` uses `FinalUrgency` instead

### Changes — `src/pages/Index.tsx` only

1. Import `AdvocacySection` and `FinalCTAPlinq`
2. Add `<AdvocacySection />` after `WhyRedflaqSection` (section 16) — this is where advocacy/mission content logically fits
3. Add `<FinalCTAPlinq />` after `FinalUrgency` (section 17) — restores the cinematic skyline CTA as a secondary closer before FAQ

No other files are modified. No existing sections are removed or reordered.


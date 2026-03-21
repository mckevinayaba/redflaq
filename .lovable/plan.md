

## Plan: Restore CommunitySectionSA to Landing Page

Add the existing `CommunitySectionSA` component back to `src/pages/Index.tsx`, placed after `CommunityImageStrip` (section 15) and before `WhyRedflaqSection` — matching its original logical position as the "Built For South African Women" section.

### Changes — `src/pages/Index.tsx` only

1. Import `CommunitySectionSA` from `@/components/landing/CommunitySectionSA`
2. Insert `<CommunitySectionSA />` between `<CommunityImageStrip />` and `<WhyRedflaqSection />`

No other files modified. No sections removed or reordered.


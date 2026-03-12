

## Problem

The testimonials section ("Real Stories. Real Safety") appears cut off because the CSS `.reveal-stagger` animation only defines opacity/transform transitions for children 1 through 6. The testimonials grid has 14 cards, so cards 7-14 remain permanently at `opacity: 0` and are invisible.

Additionally, the user wants comprehensive mobile responsiveness across all devices.

## Fix 1: Testimonials Grid Cut-Off

**Root cause**: In `src/index.css` lines 543-553, `.reveal-stagger > .reveal-child` starts at `opacity: 0`, but only children 1-6 get the `.visible` state. Children 7+ never become visible.

**Solution**: Add rules for children 7-14 in the CSS, OR better — use a general rule that makes ALL `.reveal-child` elements visible when the parent has `.visible`, with staggered delays capped at child 6 and all subsequent children appearing at the same final delay.

In `src/index.css`:
- Add a catch-all rule: `.reveal-stagger.visible > .reveal-child:nth-child(n+7)` with `transition-delay: 600ms; opacity: 1; transform: translateY(0);`

## Fix 2: Mobile Responsiveness Audit

Files to update for mobile-safe layouts:

1. **TestimonialsSectionNew.tsx** — The 3-column grid already uses `grid-cols-1 md:grid-cols-3`, which is correct. But the footer area (attribution row with name/location/badge) wraps poorly on small screens. Change the badge/location row to `flex-wrap: wrap` to prevent overflow.

2. **PhotoGrid.tsx** — The `md:grid-cols-[38%_32%_28%]` grid with fixed heights (520px, 260px, 220px) can overflow on mobile. Add responsive heights for mobile (auto height instead of fixed).

3. **CommunitySectionSA.tsx** — The organic frame has a fixed `height: 550` which can be too tall on small screens. Make it responsive.

4. **FounderSection.tsx** — The `md:grid-cols-[60%_40%]` layout with fixed photo height (480px) needs a mobile-friendly height.

5. **WhyRedflaqSection.tsx** — Verify the 3-card founder grid stacks properly on mobile.

6. **General CSS** — Ensure the grain texture overlay `z-index: 9998` doesn't interfere with touch events (it has `pointer-events: none` so it's fine).

## Changes Summary

| File | Change |
|------|--------|
| `src/index.css` | Add `.reveal-stagger.visible > .reveal-child:nth-child(n+7)` rule to make all children beyond 6 visible |
| `src/components/landing/TestimonialsSectionNew.tsx` | Add `flexWrap: 'wrap'` to the location/badge row for mobile; ensure padding is mobile-safe |
| `src/components/landing/PhotoGrid.tsx` | Make fixed heights responsive on mobile (use `minHeight` or auto) |
| `src/components/landing/CommunitySectionSA.tsx` | Reduce organic frame height on mobile |
| `src/components/landing/FounderSection.tsx` | Reduce photo frame height on mobile |

The primary fix (cards cut off) is a one-line CSS addition. The mobile fixes are targeted adjustments to prevent overflow and ensure proper stacking on all phone sizes.


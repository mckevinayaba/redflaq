

## Problem

The `TestimonialsSectionNew` component uses `useScrollReveal()` with the default threshold of `0.15` (15%). On mobile, the 14 testimonial cards stack into a single column, making the section extremely tall (likely 8000+ pixels). The IntersectionObserver requires 15% of that height to be visible in the viewport before triggering — which is physically impossible on a ~700px mobile screen. So the section stays at `opacity: 0` permanently.

## Fix

**File: `src/components/landing/TestimonialsSectionNew.tsx`** (line 22)

Change `useScrollReveal()` to `useScrollReveal(0.01)` — a 1% threshold that will trigger as soon as the top of the section scrolls into view. This is the same approach used to fix the PhotoGrid section previously.

One line change. No layout, content, or design changes needed.


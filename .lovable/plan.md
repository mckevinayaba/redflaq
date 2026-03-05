

## Fix: Mobile Horizontal Shifting (Left-Right Bounce)

The site shifts horizontally on mobile because multiple elements overflow the viewport width, and there is no global overflow guard. Here is what needs to be fixed:

---

### Root Cause

On mobile, several elements extend beyond the screen width. Without `overflow-x: hidden` on the page wrapper, the browser allows horizontal scrolling, causing the "shifting left and right" effect when scrolling or interacting.

**Main offenders:**
- The **ticker bar animation** (`TickerBar.tsx`) renders duplicate inline content that extends far beyond the viewport with no `overflow: hidden` on its parent
- The **hero section grid** (`lg:grid-cols-[55%_45%]`) can push content wider than 100vw on certain screen sizes
- The **footer grid** (`md:grid-cols-[2fr_1fr_1fr_1fr]`) can overflow on narrow screens
- Sections with `position: absolute` decorative elements (purple glows) extending outside their containers
- The social proof trust bar in `Index.tsx` has no overflow clipping

---

### Plan

**1. Add global overflow-x guard in `index.css`**
- Add `overflow-x: hidden` to `html` and `body` elements to prevent any horizontal scroll site-wide
- This is the single most impactful fix — it stops the shifting immediately

**2. Fix the TickerBar component**
- Ensure the outer container has `overflow: hidden` (it does, but verify the `width: 100%` isn't being overridden)

**3. Constrain the Index page wrapper**
- Add `overflow-x: hidden` to the root `<div>` in `Index.tsx` (and other page wrappers like `Blog.tsx`, `SafetyTips.tsx`)

**4. Constrain hero section**
- Add `overflow: hidden` to the hero `<section>` in `HeroPlinq.tsx` (already has it via className but verify inline style doesn't override)

**5. Fix footer grid for mobile**
- The footer uses `grid-cols-[2fr_1fr_1fr_1fr]` which stacks on mobile via `grid-cols-1` — verify this works correctly

---

### Summary

The primary fix is adding `overflow-x: hidden` to `html` and `body` in the global CSS. This is a one-line change that prevents all horizontal shifting. The additional component-level fixes add defence-in-depth so no single element can cause overflow even if the global guard is somehow bypassed.


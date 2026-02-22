
# Fix: Navbar Invisible in Comet, Edge, and WebView Browsers

## Root Cause

The navbar uses **Tailwind CSS responsive classes** (`hidden md:flex`, `md:hidden`) to show/hide desktop vs mobile elements. In WebView browsers like Comet, Perplexity, and some Edge configurations, Tailwind's responsive utility classes fail to apply correctly. The result: elements with `className="hidden md:flex"` stay permanently hidden (`display: none`), making all nav links, buttons, and the hamburger menu invisible.

The logo is the only thing visible because it has no Tailwind visibility classes -- it's always rendered with pure inline styles.

## The Fix

Remove ALL Tailwind responsive classes from NavbarPlinq and replace them with **JavaScript-based responsive detection** using the existing `useIsMobile()` hook. This makes visibility decisions in React logic rather than CSS, which is guaranteed to work in every browser.

### Changes to `src/components/landing/NavbarPlinq.tsx`

1. Import `useIsMobile` from `@/hooks/use-mobile`
2. Replace every `className="hidden md:flex"` with conditional rendering: `{!isMobile && ( ... )}`
3. Replace every `className="md:hidden"` with conditional rendering: `{isMobile && ( ... )}`
4. Remove the `className="space-y-4"` and `className="space-y-2"` Tailwind classes from the mobile menu, replacing with inline `style` equivalents
5. Remove ALL remaining Tailwind `className` usage (hover states like `hover:!text-[#7C3AED]`) and replace with inline `onMouseEnter`/`onMouseLeave` handlers or just remove them (hover effects are non-critical compared to visibility)

### Specific replacements

| Current (broken in WebView) | Replacement |
|---|---|
| `className="hidden md:flex"` on desktop nav links div | `{!isMobile && <div style={{display:'flex', ...}}>}` |
| `className="hidden md:flex"` on desktop right-side div | `{!isMobile && <div style={{display:'flex', ...}}>}` |
| `className="md:hidden"` on hamburger button | `{isMobile && <button ...>}` |
| `className="md:hidden"` on mobile menu panel | `{isMobile && <div ...>}` |
| `className="space-y-4"` | `style={{ display:'flex', flexDirection:'column', gap: 16 }}` |
| `className="space-y-2"` | `style={{ display:'flex', flexDirection:'column', gap: 8 }}` |
| `className="hover:!text-[#7C3AED] transition-colors"` | Remove (or add JS hover handlers for non-critical polish) |

### Why this works

- `useIsMobile()` uses `window.matchMedia` and `window.innerWidth` -- native browser APIs that work in every browser including WebViews
- React conditional rendering (`{condition && <element>}`) doesn't depend on CSS at all
- This matches the existing pattern already used in the project memory: "navbar and headers use hardened styling... Tailwind's HSL-based opacity modifiers must be avoided"

### Scope

Only `NavbarPlinq.tsx` needs this fix since it's the active navbar used on the landing page. The other navbar variants (Navbar.tsx, NavbarHonest.tsx) are inactive/unused.

## Technical Details

```text
Before:
  <div className="hidden md:flex" style={{...}}>  --> WebView ignores Tailwind --> stays display:none

After:
  {!isMobile && (
    <div style={{ display: 'flex', ... }}>  --> React controls visibility --> always works
  )}
```

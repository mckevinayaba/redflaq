

## Problem

The uploaded logo PNG (`src/assets/redflaq-logo.png`) is not rendering visibly in the navbar — it appears blank/invisible. The user wants to revert to the previous text-based wordmark that was clear and readable.

## Plan

Revert all 10 files from using the `<img>` tag back to the original text-based wordmark with the purple hexagon icon, "Red" in purple, "Fla" in dark, and "q" in red (#DC2626). This restores the previous working logo that was clearly visible.

### Files to update (all 10):

**Navbars (3 files):**
1. `src/components/landing/NavbarPlinq.tsx` — Replace `<img>` with text wordmark using inline styles (Syne font, 22px)
2. `src/components/landing/Navbar.tsx` — Replace `<img>` with text wordmark using Tailwind classes
3. `src/components/landing/NavbarHonest.tsx` — Replace `<img>` with text wordmark using Tailwind classes

**Dashboard/Auth (3 files):**
4. `src/components/dashboard/AppHeader.tsx` — Replace `<img>` with text wordmark (20px for compact header)
5. `src/pages/Signup.tsx` — Replace `<img>` with text wordmark (28px, centered)
6. `src/pages/VerifyEmail.tsx` — Replace `<img>` with text wordmark (28px, centered)

**Footers (4 files):**
7. `src/components/Footer.tsx` — Replace `<img>` with text wordmark
8. `src/components/landing/FooterNew.tsx` — Replace `<img>` with text wordmark
9. `src/components/landing/FooterHonest.tsx` — Replace `<img>` with text wordmark
10. `src/components/landing/FooterPlinq.tsx` — Replace `<img>` with text wordmark

### Wordmark structure (consistent everywhere):

```tsx
// Purple hexagon icon + text
<Shield style={{ width: 24, height: 24, color: '#7C3AED' }} />
<span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22 }}>
  <span style={{ color: '#7C3AED' }}>Red</span>
  <span style={{ color: '#2D2235' }}>Fla</span>
  <span style={{ color: '#DC2626' }}>q</span>
</span>
```

- Import `Shield` from lucide-react (already imported in most files)
- Remove `import redflaqLogo from "@/assets/redflaq-logo.png"` from each file
- Desktop: 22px font, 24px icon
- Mobile navbars: 20px font, 20px icon
- Footers: 20px font, 20px icon
- Signup/VerifyEmail: 28px font, 28px icon
- AppHeader: 20px font, 20px icon
- 14px gap between icon and text in all cases


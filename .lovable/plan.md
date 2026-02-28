

## Replace RedFlaq Logo Across the App

The uploaded image is the new RedFlaq logo — a purple rounded-square icon with a stylized "R" flag design, plus the "RedFlaq" wordmark where "RedFla" is dark and "q" is red.

### Current State
The logo is currently a CSS-drawn purple hexagon with a white "R" letter, repeated in **7 locations**:
1. **NavbarPlinq** (line 100-103) — main landing navbar
2. **FooterPlinq** (line 38-41) — landing footer
3. **AppHeader** (line 37-40) — dashboard header
4. **AdminHeader** (line 43) — admin header (Shield icon)
5. **Signup page** (line 224-227) — auth screen
6. **Hero** (line 72-76) — hero section
7. **PWA icons** — `pwa-192x192.svg` and `pwa-512x512.svg`

### Implementation Steps

1. **Copy the uploaded logo image** to `src/assets/redflaq-logo.png`

2. **Update all 6 component files** to replace the CSS hexagon + text with:
   - An `<img>` tag importing the new logo (height ~28-32px for navbars, scaled appropriately per context)
   - Keep the "RedFlaq" wordmark text next to it with the updated color scheme: "RedFla" in dark (#2D2235), "q" in red (#DC2626) — matching the uploaded image

3. **Update PWA SVG icons** (`pwa-192x192.svg`, `pwa-512x512.svg`) to use the new purple rounded-square with stylized R design (simplified SVG approximation since we can't embed a raster image in PWA manifest SVGs)

### Files to Modify
- `src/assets/redflaq-logo.png` — new file (copy from upload)
- `src/components/landing/NavbarPlinq.tsx` — replace hexagon with logo image
- `src/components/landing/FooterPlinq.tsx` — replace hexagon with logo image
- `src/components/dashboard/AppHeader.tsx` — replace hexagon with logo image
- `src/components/admin/AdminHeader.tsx` — replace Shield icon with logo image
- `src/pages/Signup.tsx` — replace hexagon with logo image
- `src/components/Hero.tsx` — replace emoji logo with logo image
- `public/pwa-192x192.svg` — update icon design
- `public/pwa-512x512.svg` — update icon design

### Wordmark Update
The uploaded logo shows the "q" in red, not the current split where "Red" is purple and "Flaq" is dark. All wordmark instances will be updated to match: **"RedFla"** in dark charcoal, **"q"** in red (#DC2626).


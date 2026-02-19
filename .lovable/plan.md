
# Fix Mobile Layout and Make RedFlaq Installable (PWA)

## Problem 1: Mobile Display Issues

The screenshot shows the mobile version has a dark/black background and oversized text. This is caused by:

- **Missing dark mode prevention**: The site doesn't include `color-scheme: light` meta tag, so phones with dark mode enabled invert the colors
- **Hero padding too large on mobile**: The left column has `padding: 160px 40px 80px 40px` which wastes space on small screens
- **Font sizes not optimized for mobile**: The headline uses `clamp(44px, 5vw, 72px)` which is still very large on mobile
- **Stat cards padding not responsive**: Right column has `padding: 120px 40px 80px` which is excessive on mobile
- **Sticky bottom bar (StickyElements)** still shows old R50 pricing and may overlap content

### Changes:

1. **index.html** -- Add `<meta name="color-scheme" content="light only">` and `theme-color` meta tag to prevent dark mode on mobile browsers

2. **HeroPlinq.tsx** -- Make responsive:
   - Reduce left column padding on mobile (e.g., `padding: 100px 20px 40px`)
   - Reduce right column padding on mobile
   - Smaller headline font on mobile screens
   - Stack buttons vertically on small screens

3. **StickyElements.tsx** -- Update R50 references to R99

4. **NavbarPlinq.tsx** -- Ensure navbar height works well on mobile

---

## Problem 2: Make RedFlaq Installable as a PWA

To pin RedFlaq to desktop and phone home screens, we will set up a Progressive Web App (PWA):

1. **Install `vite-plugin-pwa`** dependency

2. **vite.config.ts** -- Configure the PWA plugin with:
   - App name: "RedFlaq"
   - Theme color: `#7C3AED`
   - Background color: `#F7F4F0`
   - Display: standalone
   - Icons (we will use a simple generated icon)
   - `navigateFallbackDenylist: [/^\/~oauth/]`

3. **index.html** -- Add:
   - `<meta name="theme-color" content="#7C3AED">`
   - `<meta name="apple-mobile-web-app-capable" content="yes">`
   - `<meta name="apple-mobile-web-app-status-bar-style" content="default">`
   - `<link rel="manifest" href="/manifest.webmanifest">`

4. **Create PWA icons** in `/public`:
   - `pwa-192x192.png` and `pwa-512x512.png` (simple purple hexagon with R)
   - Or use an SVG icon that the PWA plugin can reference

5. After publishing, users can:
   - **Desktop (Chrome)**: Click the install icon in the address bar to pin it
   - **Mobile (Android)**: Tap "Add to Home Screen" from the browser menu
   - **Mobile (iPhone)**: Tap Share then "Add to Home Screen"

---

## Technical Summary

| File | Change |
|------|--------|
| `index.html` | Add color-scheme, theme-color, apple-mobile-web-app meta tags |
| `src/components/landing/HeroPlinq.tsx` | Responsive padding, font sizes, button layout for mobile |
| `src/components/StickyElements.tsx` | Update R50 to R99 |
| `vite.config.ts` | Add vite-plugin-pwa configuration |
| `public/pwa-192x192.svg` | Create PWA icon |
| `public/pwa-512x512.svg` | Create PWA icon |

After these changes, the mobile view will match the cream-and-purple desktop design, and users will be able to install RedFlaq as an app on their phone or desktop.

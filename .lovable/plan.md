

## Why the PWA install prompt isn't showing

The PWA configuration via `vite-plugin-pwa` generates the manifest and service worker correctly, but there are two issues:

1. **No install prompt UI**: The browser's `beforeinstallprompt` event fires silently. Without code to intercept it and show a custom install banner/button, users only see the tiny browser-native install icon (easily missed).

2. **Preview URL limitation**: PWA install only works on HTTPS production URLs (e.g. `redflaq.lovable.app` or `redflaq.com`), not on preview URLs. The app must be published first.

## Plan

### 1. Create a PWA install prompt hook (`src/hooks/usePWAInstall.ts`)
- Listen for `beforeinstallprompt` event, store the deferred prompt
- Detect if already installed via `display-mode: standalone`
- Detect iOS (which doesn't fire `beforeinstallprompt`) and show manual instructions
- Expose: `canInstall`, `isIOS`, `isInstalled`, `promptInstall()`

### 2. Create an install banner component (`src/components/PWAInstallBanner.tsx`)
- Sticky bottom banner that appears when `canInstall` is true (Android/desktop Chrome)
- On iOS: shows "Tap Share → Add to Home Screen" instructions
- Dismissible (stores dismissal in localStorage for 7 days)
- Purple branded styling with app icon and "Install RedFlaq" CTA button
- Auto-hides if already installed

### 3. Add the banner to the Index page and App layout
- Import and render `<PWAInstallBanner />` in `src/pages/Index.tsx` (and optionally in `App.tsx` so it appears on all pages)

### 4. No changes needed to vite.config.ts or index.html
- The existing PWA manifest and service worker config are correct

### Technical note
- The install prompt will only appear on the **published** production URL over HTTPS. It will not work on the Lovable preview URL. After implementing, you'll need to publish the app and test on `redflaq.lovable.app` or `redflaq.com`.


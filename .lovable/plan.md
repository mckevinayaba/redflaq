## What's actually going on

I checked both the Lovable preview and your live site (`https://redflaq.com`) side by side. **They are already identical** — both show the current hero:

> "South Africa knows about Gender Based Violence & Femicide (GBVF). The question is why you still aren't acting on what you know."

The screenshot you uploaded shows a **different** hero:

> "You Checked the Restaurant Reviews. You Shared Your Location. You Told a Friend Where You'd Be. You Think That Makes You *Safe*. **It Doesn't.**"

That copy does not exist anywhere in the codebase (`rg` returns zero matches). So the preview is not "showing something else" — it's showing what was published. What you want is a **new hero design** that has never been built yet. That's what I'll build.

## Why mobile still shows the old version

Mobile browsers (especially Chrome on Android and Safari on iPhone) aggressively cache published Lovable sites as PWAs. After clicking **Publish → Update**, mobile users may still see the old version for several hours unless they:

1. Pull-to-refresh the page, OR
2. Clear the site data for `redflaq.com`, OR
3. (If they installed it as an app via the "Install RedFlaq" banner) close and reopen the installed app.

This is a browser cache issue, not a publishing issue. I'll also add a small cache-busting tweak so future deploys take effect faster on mobile.

## Changes I'll make

### 1. Rewrite the hero in `src/components/signals/SignalsHero.tsx`

Replace the eyebrow + headline + sub copy with the screenshot's design:

- **Eyebrow pill** (unchanged): `SOUTH AFRICA'S SAFETY PLATFORM`
- **Headline** (DM Serif Display, large, black ink):
  - "You Checked the Restaurant Reviews."
  - "You Shared Your Location."
  - "You Told a Friend Where You'd Be."
  - *(spacing break)*
  - "You Think That Makes You *Safe*." (italic on "Safe")
  - **"It Doesn't."** ← in red `var(--rf-danger)` / `#C0392B`
- **Sub copy + CTAs + brand line** stay the same ("Behavioral safety…", "Create Free Safety Base", "Read Today's Signal", "Free account. No credit card…").
- **Right column image + floating quote**: keep, but on mobile it'll move below as today.

### 2. Tighten the navbar `Run a Check` button

In the screenshot, the dark `Run a Check` pill shows "From R99" subtext. I'll add that small subline so it matches.

### 3. Cache-busting for mobile (`index.html` + `vite.config.ts`)

- Add `<meta http-equiv="Cache-Control" content="no-cache">` for the HTML shell so the published `index.html` is always re-fetched on mobile (assets stay long-cached via hashed filenames — this is safe).
- Bump the `manifest` cache version so installed PWA users get the update on next launch.

### 4. Nothing else changes

Sections below the hero (Reality stats, dark quote band, category pills, today's featured, pricing, footer) are already correct and match earlier screenshots — leaving them as-is.

## After I publish this

You will need to click **Publish → Update** in Lovable for the change to go live on `redflaq.com`. On mobile, pull down to refresh once, or close + reopen the installed app.

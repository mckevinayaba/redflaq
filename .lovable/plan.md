## Goal

Make `/` (home) render exactly the design shown in the screenshots — the cream-paper hero, dark Reality stats block, dark full-quote band, category pills with featured "Today's Signal" card, dark pricing trio, and dark Signals footer.

## What's actually happening

The components for that exact design already exist in `src/components/signals/` (`SignalsNav`, `SignalsTicker`, `SignalsHero`, `SignalsFullQuote`, `SignalsCategories`, `SignalsTodayFeatured`, `SignalsPricing`, `SignalsFooter`) plus `RedFlaqReality` in `src/components/landing/`. None of them are currently composed into a page — `/` is pointing at `src/pages/Signals.tsx`, which is the *blog-style* article grid (different design).

So the fix is to assemble those components into a single page and route `/` to it.

## Changes

### 1. New page: `src/pages/Home.tsx`

Composes the screenshot design top-to-bottom:

```text
SignalsNav
SignalsTicker
SignalsHero            ← cream paper hero (image 169)
RedFlaqReality         ← "denial problem" + stats grid + callout (images 166–168)
SignalsFullQuote       ← dark "most dangerous thing you will do today" band (image 170 top)
SignalsCategories      ← pill filters (image 170 middle)
SignalsTodayFeatured   ← featured signal card (images 170–171)
SignalsPricing         ← R0 / R99 / Free Safety Base (image 172)
SignalsFooter          ← dark footer with GBV hotline (image 173)
PWAInstallBanner
```

Also keeps the existing `?confirmed=true` and `?ref=...` query-param handling from `Index.tsx` so email-confirm and referral links still work on `/`.

### 2. `src/App.tsx`

- `/` → `<Home />` (lazy-loaded)
- `/signals` keeps the current article-grid `Signals` page (untouched)
- `/home-old` keeps pointing at `<Index />` for safety

### 3. Remove remaining "Nthabi Montsho" reference

- `src/pages/AffidavitBuilder.tsx` line 225: change the deponent-name placeholder from `"e.g. Nthabiseng Kholofelo Montsho"` to a generic `"e.g. Full names and surname"`.

(All other Nthabi mentions on About / Why-We-Exist / Team and the Women Arise With Power logo were already removed in earlier turns. A full-codebase search confirms only this placeholder remains.)

## Not touched

`SignalsHero`, `SignalsFullQuote`, `SignalsTodayFeatured`, `SignalsPricing`, `SignalsFooter`, `SignalsNav`, `SignalsTicker`, `SignalsCategories`, `RedFlaqReality` — already match the screenshots, no edits needed. Old `Index.tsx`, navbar, footer, pricing/Yoco flow, verification, admin, DB — untouched.

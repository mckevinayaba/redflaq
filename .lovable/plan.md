# Mobile-first re-skin — Option A

Port the visual language of Claude's `/mobile` prototype (dark cards, big serif headings, JetBrains Mono labels, `#7C3AED` accent, generous spacing) onto the **existing** routes that the bottom tab bar already points at. No new data layer, no migration, no parallel UI tree.

## Scope — 6 mobile screens

| Tab | Existing route | Prototype source | What changes |
|---|---|---|---|
| Home | `/dashboard` | `HomeScreen` | New mobile-only hero: greeting, verification badge, "Run a check" CTA, last-check card, daily Signal card. Desktop layout untouched. |
| Check | `/dashboard/new-check` (and `/search-form`, `/results`) | `CheckScreen` | Mobile-tuned form: stacked inputs, 16px font, large province pill picker, sticky CTA. |
| Signals | `/signals` | `SignalsScreen` | Mobile card stack with the prototype's dark cards + JetBrains Mono category chips. |
| Journal | `/dashboard/journal` | `JournalScreen` | Mobile list view: large timestamp, body preview, lock icon, FAB for "New entry". |
| Connect | `/connect` | `ConnectScreen` | Replace current "Coming soon" stub with the prototype's verify → quiz → groups visual (still teaser, no backend). |
| Base | `/dashboard/reports` | `BaseScreen` | Mobile reports/saved tabs in prototype's segmented-control style. |

## Fixes first (blockers I saw in the preview)

1. **Tab bar invisible on `/dashboard`** — preview shows a blank white page. Two likely causes to verify before re-skinning:
   - `Dashboard.tsx` redirects unauthenticated users away from `/dashboard`, so `MobileShell` never gets a chance to render its match.
   - Even when authed, `DashboardLayout` renders its own full-height shell on top of `MobileShell`.
   Fix: render `MobileShell` regardless of auth state on its allowed routes (it already gates by route + viewport), and add `paddingBottom: MOBILE_TAB_BAR_HEIGHT + safe-area` inside `DashboardLayout`'s `<main>` on mobile so the tab bar doesn't cover content.
2. **Hide the desktop "hamburger + AppHeader"** on mobile when the new mobile shell is active (replace with a slim mobile top bar showing logo + credits only).
3. **Background mismatch** — `DashboardLayout` already uses `#08080f`; mobile pages that currently render on `#F5F0EB` (e.g. `SearchFormHonest`) need a `useIsMobile()` dark override.

## Visual system (locked across all 6 screens)

- Background `#08080f`, cards `#111118` with `1px solid rgba(255,255,255,0.06)`
- Accent `#7C3AED` (already standardised — prototype's `#6C35DE` is dropped)
- Display: `DM Serif Display` 32–40px for screen titles
- Labels/meta: `JetBrains Mono` 9–11px uppercase, `letter-spacing: 0.08em`
- Body: `Inter` / `Syne` as already configured
- Card radius `16px`, padding `20px`, gap `12–16px`
- 44px min touch targets, 16px inputs (iOS no-zoom), `100dvh` height, safe-area insets respected
- Re-use existing tokens from `index.css` — no new colors added globally

## Approach per page

Add a `useIsMobile()` branch at the top of each of the 6 pages and render a new `Mobile<Name>` component (kept next to the page or in `src/components/mobile/screens/`). Desktop JSX stays exactly as is. All data hooks (`useAuth`, `useCredits`, `useSignalStreak`, journal queries, signal queries) are reused unchanged — only presentation changes.

## Out of scope (for this phase)

- No DB migration, no Connect tables (the page remains a styled teaser)
- No Capacitor / native wrap
- No PWA manifest changes
- No edits to marketing `/` or admin routes
- No changes to edge functions, payments, or RLS

## Technical notes

```text
src/
  components/mobile/
    MobileShell.tsx          (exists — extend match list, keep)
    MobileTabBar.tsx         (exists, keep)
    MobileTopBar.tsx         (new — logo + credits + back, 56px)
    screens/
      MobileHome.tsx         (new)
      MobileCheck.tsx        (new)
      MobileSignals.tsx      (new)
      MobileJournal.tsx      (new)
      MobileConnect.tsx      (new — replaces current Connect.tsx body)
      MobileBase.tsx         (new)
  pages/
    Dashboard.tsx            (branch on useIsMobile)
    DashboardNewCheck.tsx    (branch)
    Signals.tsx              (branch)
    JournalList.tsx          (branch)
    DashboardReports.tsx     (branch)
    Connect.tsx              (branch)
  components/dashboard/
    DashboardLayout.tsx      (add mobile bottom padding, hide sidebar/hamburger row on mobile)
```

Routing, auth, RBAC, RLS, payments — all untouched. The re-skin is purely a presentation layer that activates below 768px.

## Order of work

1. Tab-bar visibility fix + `DashboardLayout` mobile padding (so we can actually see progress)
2. `MobileTopBar` + `MobileHome` (highest-value, sets the visual language)
3. `MobileCheck` + `MobileSignals` (revenue + retention paths)
4. `MobileJournal` + `MobileBase` (utility surfaces)
5. `MobileConnect` styled teaser

Each step is independently shippable and reviewable in the mobile preview.


## What Claude actually built in `/mobile`

A small, standalone **UI prototype** — not a full app:

- Single `App.tsx` with `useState` tab switching (no React Router)
- 6 screens: Home, Check, Signals, Journal, Connect, Base
- 1 component: a fixed bottom `TabBar` with custom SVG icons, purple `#6C35DE` accent, safe-area aware
- Hooks: `useAuth`, `useSavedChecks`, `useSavedSignals`, `useJournal` — mostly **localStorage**, not wired to your real tables
- Auth screen exists; everything else is greenfield
- Migration file defines a **fresh schema** that conflicts with your live DB (already analyzed — would wipe users, payments, scraped records, RBAC, etc.)
- Only 2 prod deps (`react`, `react-dom`) — no router, no supabase-js, no Capacitor, no shadcn. It's a design shell.

**Translation:** the `/mobile` folder is a *visual + interaction prototype* of what RedFlaq should feel like on a phone — bottom-tab native-app aesthetic, dark theme, safe-area handled. It is not a shippable mobile app and not connected to your real data.

## Recommendation: adopt the design, keep the engine

Don't run two codebases, don't migrate the DB, don't lose paying users. Instead, **port the `/mobile` shell into the existing app** and ship it as an installable PWA. Later wrap in Capacitor if you want App Store / Play Store presence.

### Why this beats the alternatives

| Path | Pros | Cons |
|---|---|---|
| **A. Port design into live app (recommended)** | One codebase. Web + mobile from same source. Keeps all users, payments, RBAC, scraped records, journal, admin. Ships in days. | Some rework of existing pages for mobile breakpoint. |
| B. Run `/mobile` as separate project + separate Supabase | Clean slate. | Two apps to maintain. Users on web can't see mobile data. Connect lives in isolation. Payments/admin duplicated. |
| C. Full cutover to `/mobile` schema | Matches the prototype 1:1. | Destroys all live data and the web app. Already ruled out. |

## Plan

### Phase 1 — Mobile shell on existing codebase (1–2 days of work)

1. Create `src/components/mobile/MobileTabBar.tsx` — port the SVG TabBar verbatim from `/mobile`.
2. Create `src/layouts/MobileShell.tsx` — fixed bottom tab + `100dvh` scroll container + safe-area paddings (copy `index.css` mobile rules).
3. Render `<MobileShell>` only on mobile breakpoint via `useIsMobile()`; desktop keeps the current Router/Dashboard layout.
4. Map the 6 tabs to existing routes (no new pages):
   - Home → `/dashboard`
   - Check → `/dashboard/new-check`
   - Signals → `/signals`
   - Journal → `/dashboard/journal`
   - Base → `/dashboard/reports` (Saved checks + Saved signals)
   - Connect → `/connect` (new — coming-soon stub for now)
5. Re-skin the top 3 mobile views (Home, Check, Signals) to match the prototype's typography, spacing and dark palette using existing semantic tokens (project is already dark `#08080f` / `#7C3AED`).
6. Add manifest-only PWA install (no service worker, per project rules) so users can "Add to Home Screen".

### Phase 2 — Connect (additive, optional, when you're ready)

- Add **only** the new tables from the rebuild migration: `quiz_responses`, `group_memberships`, `messages`, `event_rsvps`, `event_feedback`. Leave `profiles`, `journal_entries`, `searches`, `user_roles`, `purchases` untouched.
- Add 90-day "verification badge" derived from the latest paid search on `profiles`.
- Build Connect screens (quiz → match → group → event RSVP) inside the existing app.

### Phase 3 — Capacitor wrap (only if App Store presence is needed)

- `npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android`
- `npx cap init` with the project ID, sync, build, ship. Same codebase, native shell.

## Technical notes

- Don't touch `supabase/migrations`, `src/integrations/supabase/{client,types}.ts`, or the live DB schema.
- TabBar accent `#6C35DE` is slightly different from current `#7C3AED` — recommend standardising on the existing token, not the prototype's literal.
- The `/mobile` `useJournal`/`useSavedChecks` hooks use localStorage; replace with the existing Supabase-backed equivalents (`journal_entries`, `signal_saves`) so data syncs across devices.
- Keep React Router; mobile shell renders inside `<BrowserRouter>` and uses `useNavigate()` instead of `useState` for tabs so deep links and back-button still work.

## What I need from you to proceed

1. **Confirm Path A** (port design into the live app) vs. running `/mobile` as a separate project.
2. **Connect timing** — build now in Phase 1, or stub as "coming soon" and ship the mobile shell first?
3. **App Store** — needed soon (so plan Capacitor early), or PWA-only is fine for v1?

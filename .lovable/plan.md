

## Phase 3: New Pages

Create 6 new pages and register routes in App.tsx.

### Pages to Create

1. **`src/pages/About.tsx`** — Full rewrite of existing file
   - Hero: "Why RedFlaq Exists" with GBV stat headline
   - The Problem narrative (moved from old landing page content)
   - The Solution: what RedFlaq does differently
   - Team section: McKevin, Nthabi, Ayola, Stacey (photo placeholders + bios + quotes)
   - Impact stats/milestones
   - Partners link
   - Contact section (email, WhatsApp, social)
   - Hash anchors: `#why-we-exist`, `#team` for nav dropdown links

2. **`src/pages/Shop.tsx`** — New
   - Hero: "Wear the Movement. Support Women's Safety."
   - Product grid: Cap, Tracksuit, Jumpsuit — each with placeholder image, description, price, "Coming Soon" button
   - Clean white background, purple CTAs, mobile-first

3. **`src/pages/HabitComingSoon.tsx`** — New
   - Hero, 3 pillars (Daily Check-Ins, Red Flag Education, Safety Streaks), deeper purpose section
   - Email capture form (store in `coming_soon_signups` table or just toast confirmation)
   - "Launching April 2026"

4. **`src/pages/BehavioralSignalComingSoon.tsx`** — New
   - Hero, "The Truth" section, how it works, the science, 5 categories, risk levels
   - Email capture, "Launching May 2026"

5. **`src/pages/ApiComingSoon.tsx`** — New
   - Hero, "For" list (dating apps, HR, etc.), "What You Get" (REST API, webhooks, docs)
   - Email + company capture, "Q3 2026"

6. **`src/pages/RedflaqOrgComingSoon.tsx`** — New
   - Hero, coming soon features list (bulk verification, training materials, etc.)
   - Email + organization capture

### Routing Changes (`src/App.tsx`)

Add imports and 5 new routes:
- `/shop` → Shop
- `/habit-coming-soon` → HabitComingSoon
- `/behavioral-signal-coming-soon` → BehavioralSignalComingSoon
- `/api-coming-soon` → ApiComingSoon
- `/redflaq-org-coming-soon` → RedflaqOrgComingSoon
- `/about` already exists — just rewriting the component

### Design Approach

- All pages use `NavbarPlinq` + `FooterPlinq` wrapper
- Same dark hero pattern (`#0F0A1A` → `#1A1035` gradient) used in existing About page
- Purple `#7C3AED` for accents and CTAs
- Email capture: simple `Input` + `Button` with toast confirmation (no DB table needed for now)
- Coming Soon badges use existing purple styling
- Mobile-first, single-column stacking

### No DB Changes Required
Email captures will show a toast confirmation. Can add persistence later.


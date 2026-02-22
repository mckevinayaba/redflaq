
# RedFlaq Growth Engine — Build Only What's Missing

## What Already Exists (DO NOT TOUCH)
- Homepage with Hero, HowItWorks, Pricing, FAQ, Testimonials, Footer
- Full auth flow (Signup, Verify Email, Reset Password)
- Safety Check flow (SearchForm, Payment, Results with risk levels)
- User Dashboard (checks history, reports, account, help)
- Admin panel (users, checks, content, pricing, analytics, system)
- Share/Invite modal with WhatsApp + Email + Copy link
- SEO meta tags, OpenGraph, Twitter cards in index.html
- POPIA consent flow, dispute system, data sources page
- Referral link generation (user.id-based)
- Privacy, Terms, About pages

## What Needs to Be Built (6 New Features)

### 1. Post-Check "Safety Win" Screen
After results load on the Results page, add a celebratory overlay/section (only for GREEN/YELLOW results) with:
- Celebratory message: "You made a safe, informed decision"
- Share buttons (WhatsApp, X/Twitter, Facebook, LinkedIn, Copy link) with pre-filled generic text — never shows private data
- "Invite friends and get a free check" teaser linking to referral
- File: New component `src/components/SafetyWinScreen.tsx`, integrated into `ResultsPageUpdated.tsx`

### 2. Free Safety Tools Section (/tools)
Create 4 interactive checklist pages that drive SEO and funnel users to paid checks:
- `/tools` — index page listing all tools
- `/tools/first-date-safety` — "First Date Safety Checklist"
- `/tools/tenant-safety` — "Tenant / Landlord Safety Checklist"
- `/tools/domestic-worker-safety` — "Domestic Worker / Nanny Safety Checklist"
- `/tools/red-flag-quiz` — "Is This a Red Flag?" quick quiz/decision helper

Each tool page has:
- SEO-optimised H1 with SA-specific keywords
- Step-by-step interactive checklist (checkboxes, progress bar)
- CTA at the end: "Run a RedFlaq Safety Check"
- Share buttons to share the tool itself (not answers)
- Internal links back to homepage

New files:
- `src/pages/Tools.tsx` (index)
- `src/pages/tools/FirstDateSafety.tsx`
- `src/pages/tools/TenantSafety.tsx`
- `src/pages/tools/DomesticWorkerSafety.tsx`
- `src/pages/tools/RedFlagQuiz.tsx`
- `src/components/tools/ToolLayout.tsx` (shared layout with navbar, footer, SEO)

### 3. Safety Academy / Blog Engine (/academy)
A simple CMS-driven blog using the existing `site_settings` table pattern:
- `/academy` — article listing page with category filters
- `/academy/:slug` — individual article page
- Categories: Dating Safety, Tenant & Landlord Safety, Domestic Worker Safety, POPIA & Privacy, GBV Resources
- Each article auto-suggests: "Run a safety check now" CTA, 2-3 related articles, 1 relevant tool
- FAQ schema markup (JSON-LD) for Google rich results
- Database: New `academy_articles` table for content storage

New files:
- `src/pages/Academy.tsx` (listing)
- `src/pages/AcademyArticle.tsx` (single article)
- `src/components/academy/ArticleCard.tsx`
- `src/components/academy/ArticleSidebar.tsx`

Database migration:
```sql
CREATE TABLE public.academy_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'dating-safety',
  featured_image_url text,
  meta_description text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author text DEFAULT 'RedFlaq Team',
  related_tool_slug text
);
ALTER TABLE public.academy_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read published articles" ON public.academy_articles
  FOR SELECT USING (published = true);
```

### 4. Partner / Community Portal (/partners)
- `/partners` — landing page explaining the partner programme
- `/partners/apply` — application form (org name, type, contact, website)
- Partner dashboard (post-approval) showing referral stats and embeddable button code

Database migration:
```sql
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name text NOT NULL,
  org_type text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  website text,
  status text DEFAULT 'pending',
  referral_code text UNIQUE,
  checks_referred integer DEFAULT 0,
  revenue_referred numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  notes text
);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert partners" ON public.partners
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow partners view own" ON public.partners
  FOR SELECT USING (true);
```

New files:
- `src/pages/Partners.tsx` (landing)
- `src/pages/PartnersApply.tsx` (application form)

### 5. Referral System Upgrade (Dashboard)
The current ShareInviteModal generates a referral link but there's no tracking or reward logic. Add:
- New `referrals` table to track signups from referral links
- Capture `?ref=` parameter on landing page and store in sessionStorage
- On signup, record the referrer in the referrals table
- Dashboard widget showing: "You invited X friends, earned Y free checks"
- Award 1 free check per 3 paying referrals

Database migration:
```sql
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL,
  referred_user_id uuid,
  referred_email text,
  status text DEFAULT 'clicked',
  converted_at timestamptz,
  reward_granted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_user_id);
CREATE POLICY "Allow public insert referrals" ON public.referrals
  FOR INSERT WITH CHECK (true);
```

Changes:
- `src/pages/Index.tsx` — capture `?ref=` param on mount
- `src/pages/Signup.tsx` — on signup, record referral
- `src/pages/Dashboard.tsx` — add referral stats widget

### 6. Navigation & SEO Updates
- Add "Tools" and "Academy" links to NavbarPlinq and FooterPlinq
- Update footer strapline: "South Africa's public-record safety check for women and communities -- not a SAPS fingerprint check."
- Add sitemap.xml generation (static file in /public)
- Update `index.html` title to: "RedFlaq -- #1 Public Record Safety Check & Criminal Background Signal in South Africa"
- Add routes to App.tsx for all new pages

## Implementation Order
1. Database migrations (academy_articles, partners, referrals tables)
2. Safety Win screen (small, high-impact)
3. Tools pages (SEO value, no backend needed)
4. Academy pages + admin article management
5. Partners portal
6. Referral tracking upgrade
7. Navigation and SEO updates throughout

## Files Changed (Existing)
- `src/App.tsx` — add new routes
- `src/pages/Index.tsx` — capture ref param
- `src/pages/Signup.tsx` — record referral on signup
- `src/pages/Dashboard.tsx` — referral stats widget
- `src/pages/ResultsPageUpdated.tsx` — integrate Safety Win screen
- `src/components/landing/NavbarPlinq.tsx` — add Tools, Academy links
- `src/components/landing/FooterPlinq.tsx` — add Tools, Academy, Partners links + strapline
- `index.html` — update title tag
- `public/sitemap.xml` — new static file

## Files Created (New)
- `src/components/SafetyWinScreen.tsx`
- `src/components/tools/ToolLayout.tsx`
- `src/pages/Tools.tsx`
- `src/pages/tools/FirstDateSafety.tsx`
- `src/pages/tools/TenantSafety.tsx`
- `src/pages/tools/DomesticWorkerSafety.tsx`
- `src/pages/tools/RedFlagQuiz.tsx`
- `src/pages/Academy.tsx`
- `src/pages/AcademyArticle.tsx`
- `src/components/academy/ArticleCard.tsx`
- `src/components/academy/ArticleSidebar.tsx`
- `src/pages/Partners.tsx`
- `src/pages/PartnersApply.tsx`
- `public/sitemap.xml`

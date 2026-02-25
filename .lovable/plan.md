

# RedFlaq Full Platform Audit

## What You Have Built

### Frontend Pages (45+ routes)

**Public Marketing & Content:**
- Landing page (/) with LG-style visual redesign, organic frames, photo grid, ticker bar, trust bar, community section, founder section, testimonials, FAQ, pricing, final CTA
- About (/about), Privacy (/privacy), Terms (/terms), Dispute (/dispute)
- Pricing (/pricing) with 3 packages: R99/R249/R399
- Blog (/blog) with 6 articles, individual article pages (/blog/:slug)
- Safety Tips (/safety-tips) - fully built out with red flags, post-flag guidance, emergency resources
- Conversation Guide (/conversation-guide) - standalone shareable resource
- Partners page (/partners) + application form (/partners/apply)
- Data Sources (/sources)
- Demo result page (/demo-result)

**Auth & User:**
- Signup/signin (/signup) with email verification flow
- Email verification (/verify-email)
- Password reset (/reset-password)
- Welcome modal for first-time users

**User Dashboard (authenticated):**
- Dashboard home (/dashboard) with check history, stats, referral tracker
- New check form (/dashboard/new-check) with demo mode support
- Reports history (/dashboard/reports)
- Account settings (/dashboard/account)
- Help (/dashboard/help)

**Core Product:**
- Search form (/search-form) - legacy payment-gated form
- Results page (/results) with risk levels (RED/ORANGE/YELLOW/GREEN), identity match selector, PDF download, post-report guidance ("What do I do with this result?"), dispute buttons, share controls
- Payment modal with PayFast integration
- Payment success/cancelled pages
- Receipt page

**Admin Panel (10 pages):**
- Admin dashboard (new + legacy)
- User management, checks review, content management
- Pricing management, analytics, system settings
- Gazette management, scraper tools, import tools
- Payment verification, merge review
- Admin login with role-based access (owner/admin/support)

**Global Elements:**
- Emergency GBV banner on every page (0800 428 428)
- Share/invite modal (WhatsApp, email, copy link)
- Auth-guarded CTAs across all pages

---

### Backend (Edge Functions)

| Function | Status | Purpose |
|---|---|---|
| `create-payfast-payment` | Built | Creates PayFast checkout session, stores pending payment |
| `payfast-itn` | Built | Webhook handler for PayFast payment confirmation |
| `multi-parameter-search` | Built | Core search engine - 6 strategies (case number, ID, name filtered, fuzzy name, SAFLII, gazette) |
| `submit-payment` | Built | Alternative payment submission |
| `admin-verify-payment` | Built | Manual payment verification |
| `verify-admin` | Built | Admin role checking |
| `send-email` | Built | Email delivery |
| `import-opensanctions` | Built | SAPS wanted persons data import |
| `import-sapswanted` | Built | SAPS scraper import |
| `import-wanted-persons` | Built | CSV import |
| `scrape-saps-wanted` | Built | SAPS website scraper |
| `scrape-saps-details` | Built | Individual detail scraper |
| `index-saflii` | Built | SAFLII court judgment indexer |
| `extract-gazette` | Built | Government Gazette extractor |

---

### Database (17 tables)

| Table | Records | Purpose |
|---|---|---|
| `wanted_persons` | 1,220 active | Core criminal records (SAPS) |
| `saflii_judgments` | 143 criminal | Court judgment records |
| `gazette_records` | 0 | Government Gazette (empty - not yet populated) |
| `searches` | 12 | Search history |
| `profiles` | 1 | User profiles |
| `manual_payments` | — | Payment tracking |
| `purchases` | — | Credit tracking |
| `disputes` | — | Record dispute system |
| `referrals` | — | Referral programme |
| `partners` | — | Partner applications |
| `academy_articles` | — | Blog/academy CMS |
| `admin_events` | — | Audit log |
| `duplicate_name_groups` | — | Dedup tracking |
| `human_verification_requests` | — | Manual review queue |
| `record_merge_log` | — | Record merging |
| `user_roles` | — | RBAC |
| `site_settings` | — | CMS settings |

**Secrets configured:** PayFast (merchant ID, key, passphrase), PayPal (client ID, secret, mode), Firecrawl API key.

---

## Brutally Honest Launch Readiness Assessment

### What IS ready

1. **Landing page** - Polished, conversion-oriented, SA-specific messaging. Good enough to launch.
2. **Auth flow** - Signup, email verification, signin, password reset all work.
3. **Search engine** - 6-strategy search across SAPS + SAFLII. Functional and smart.
4. **Results page** - Risk levels, identity matching, PDF export, post-report guidance. This is solid.
5. **PayFast integration** - Full payment flow (create, ITN webhook, credit tracking). PayFast is the right choice for SA.
6. **Safety content** - Safety Tips, Conversation Guide, emergency banner. This is genuinely good content that differentiates you.
7. **Admin panel** - Exists and has basic functionality for managing records, users, payments.
8. **POPIA compliance** - Consent checkboxes, audit logging, dispute mechanism, no-notification policy. You have thought about this.

### What is NOT ready (blockers)

**Critical - Must fix before launch:**

1. **RLS policies are wide open.** The database linter found 12+ "always true" policies. Your `manual_payments`, `purchases`, `searches`, `disputes`, `human_verification_requests` tables allow anyone to read anyone else's data. A user could query another user's payment history, search history, or dispute details from the browser console. This is a POPIA violation waiting to happen.

2. **Gazette records table is empty (0 records).** You advertise 3 data sources but only 2 have data. Either populate it or remove the claim from the landing page and results page.

3. **Only 1 user profile exists and 12 searches total.** You have not tested the full flow end-to-end with real users. You need at least 5-10 people to complete the signup → pay → search → results → PDF flow before going public.

4. **The dashboard search form (`/dashboard/new-check`) charges R99 but has no credit check.** It calls `multi-parameter-search` without a `payment_id`. The edge function will happily run the search for free because `payment_id` is optional. Anyone with an account can run unlimited free searches.

5. **No email notifications.** The `send-email` function exists but is not wired into the payment success or search completion flows. Users pay R99 and get... a redirect. No confirmation email, no receipt email, no results email. This will generate support complaints immediately.

**High priority - Should fix before launch:**

6. **No error monitoring.** No Sentry, no error tracking. When something breaks in production, you will not know until users complain.

7. **PayFast is pointed at production** (`www.payfast.co.za`), not sandbox. If you have not tested live transactions yet, you could be charging real money into a misconfigured merchant account.

8. **The legacy search form (`/search-form`) still exists** alongside the dashboard form. Two entry points with different validation, different credit checking, and different UX. Pick one and kill the other.

9. **No rate limiting on the search function.** Someone could script thousands of searches against your database.

10. **Images are placeholder/AI-generated.** The organic-frame photos in the hero, photo grid, community section are generated assets. For a platform built on trust, stock AI faces undermine credibility with your target audience.

### What would be nice but can wait

- SEO meta tags are minimal
- PWA service worker exists but is basic
- No analytics (Google Analytics, Plausible, etc.)
- Referral programme exists in code but has never been tested at scale
- Partner programme is a form that goes into a table - no automated follow-up
- Mobile app (PWA is sufficient for v1)

---

## Can You Launch?

**Not today. But you are 1-2 weeks of focused work away.**

Here is what I would prioritise, in order:

```text
Week 1 (must-do):
  1. Lock down RLS policies (2-3 hours)
  2. Add credit-checking to dashboard search (1 hour)
  3. Wire up confirmation emails (payment + results) (half day)
  4. Test PayFast end-to-end with a real R99 transaction (1 hour)
  5. Get 5 real humans to test the full flow (2-3 days)
  6. Replace AI photos with real SA stock photos (half day)

Week 2 (should-do):
  7. Remove legacy /search-form route
  8. Add basic error monitoring
  9. Populate gazette records OR remove from claims
  10. Add rate limiting to search function
```

After that, you are ready for a soft launch to a small audience (100-500 users). Not a press launch. A "share the link with 20 women you know" launch.

---

## How Was "Plinq" Launch?

I should be transparent: I do not have memory of building a product called Plinq separately. The "Plinq" references in your codebase (`HeroPlinq`, `NavbarPlinq`, `FooterPlinq`, `PricingPlinq`, etc.) are design variants of RedFlaq's landing page, not a separate product. They appear to be an iteration of the landing page styling - likely named after the LG "Life's Good" inspired aesthetic direction you chose.

So there was no separate Plinq launch. This IS the product, with Plinq-styled components being the current visual design system for RedFlaq's landing page.

---

## Bottom Line

You have built something genuinely meaningful. The safety content alone (Conversation Guide, post-report guidance) is better than anything else in this space in South Africa. The search engine works across real data sources. The payment flow is integrated.

But the security holes (open RLS policies, no credit checking) mean that launching today would expose user data and let people search for free. Fix those two things, send yourself a test payment, get 5 friends to try it, and you are ready to go live.


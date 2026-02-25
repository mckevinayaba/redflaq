
# RedFlaq Full Platform Audit — Updated

## What You Have Built

### Frontend Pages (45+ routes)

**Public Marketing & Content:**
- Landing page (/) with LG-style visual redesign, organic frames, photo grid, ticker bar, trust bar, community section, founder section, testimonials, FAQ, pricing, final CTA
- About (/about), Privacy (/privacy), Terms (/terms), Dispute (/dispute)
- Pricing (/pricing) with 3 packages: R99/R249/R399
- Blog (/blog) with 6 articles, individual article pages (/blog/:slug)
- Safety Tips (/safety-tips) — fully built out with red flags, post-flag guidance, emergency resources (GBV Command Centre, Lifeline SA, TEARS Foundation, Protection Order info)
- Conversation Guide (/conversation-guide) — standalone shareable resource with pre-conversation safety checklist, question cards, mistaken identity assessment, post-conversation outcomes, WhatsApp share
- Partners page (/partners) + application form (/partners/apply)
- Data Sources (/sources)
- Demo result page (/demo-result)
- Tools hub (/tools) with sub-pages: First Date Safety, Red Flag Quiz, Tenant Safety, Domestic Worker Safety

**Auth & User:**
- Signup/signin (/signup) with email verification flow
- Email verification (/verify-email)
- Password reset (/reset-password)
- Welcome modal for first-time users

**User Dashboard (authenticated):**
- Dashboard home (/dashboard) with check history, stats, referral tracker
- New check form (/dashboard/new-check) with demo mode support and **server-side credit validation**
- Reports history (/dashboard/reports)
- Account settings (/dashboard/account)
- Help (/dashboard/help)

**Core Product:**
- Results page (/results) with risk levels (RED/ORANGE/YELLOW/GREEN), identity match selector, PDF download, post-report guidance ("What do I do with this result?"), dispute buttons, share controls
- Payment modal with PayFast integration
- Payment success/cancelled pages
- Receipt page

**Admin Panel (10 pages):**
- Admin dashboard (new + legacy)
- User management, checks review, content management
- Pricing management, analytics, system settings
- Gazette management, scraper tools, import tools
- Payment verification (with WhatsApp shortcut), merge review
- Admin login with role-based access (owner/admin/support)

**Global Elements:**
- Emergency GBV banner on every page (0800 428 428) — non-dismissible, deep purple
- Share/invite modal (WhatsApp, email, copy link)
- Auth-guarded CTAs across all pages

---

### Backend (Edge Functions — 14 functions)

| Function | Status | Purpose |
|---|---|---|
| `create-payfast-payment` | ✅ Built | Creates PayFast checkout session, stores pending payment |
| `payfast-itn` | ✅ Built | Webhook handler for PayFast payment confirmation |
| `multi-parameter-search` | ✅ Built + **Credit-gated** | Core search engine — 6 strategies, server-side credit deduction |
| `submit-payment` | ✅ Built | Alternative payment submission |
| `admin-verify-payment` | ✅ Built | Manual payment verification |
| `verify-admin` | ✅ Built | Admin role checking |
| `send-email` | ✅ Built | Email delivery via Resend |
| `import-opensanctions` | ✅ Built | OpenSanctions data import |
| `import-sapswanted` | ✅ Built | SAPS scraper import |
| `import-wanted-persons` | ✅ Built | CSV import |
| `scrape-saps-wanted` | ✅ Built | SAPS website scraper |
| `scrape-saps-details` | ✅ Built | Individual detail scraper |
| `index-saflii` | ✅ Built | SAFLII court judgment indexer |
| `extract-gazette` | ✅ Built | Government Gazette extractor |

---

### Database (17 tables)

| Table | Records | Purpose | RLS Status |
|---|---|---|---|
| `wanted_persons` | 1,220 active | Core criminal records (SAPS) | ✅ Public read only |
| `saflii_judgments` | 143 criminal | Court judgment records | ✅ Public read only |
| `gazette_records` | 0 | Government Gazette (empty) | ✅ Public read only |
| `searches` | 12 | Search history | ✅ Own + staff |
| `profiles` | 1 | User profiles | ✅ Own + staff |
| `manual_payments` | — | Payment tracking | ✅ **FIXED** Own + staff |
| `purchases` | — | Credit tracking | ✅ **FIXED** Own + staff |
| `disputes` | — | Record dispute system | ✅ **FIXED** Own + staff |
| `referrals` | — | Referral programme | ✅ Own referrer |
| `partners` | — | Partner applications | ✅ Staff view, public insert |
| `academy_articles` | — | Blog/academy CMS | ✅ Published public, admin manage |
| `admin_events` | — | Audit log | ✅ **FIXED** Staff only |
| `duplicate_name_groups` | — | Dedup tracking | ✅ **FIXED** Staff only |
| `human_verification_requests` | — | Manual review queue | ✅ **FIXED** Staff only |
| `record_merge_log` | — | Record merging | ✅ **FIXED** Staff only |
| `user_roles` | — | RBAC | ✅ Own + owner manage |
| `site_settings` | — | CMS settings | ✅ Staff only |

---

## What Was Fixed Today

### ✅ RLS Security Lockdown (Critical Fix #1)
- Replaced 12+ "always true" SELECT/UPDATE policies with properly scoped ones
- `manual_payments`, `purchases`, `searches`: users can only see their own data (matched by email or user_id)
- `disputes`: users see only their own disputes (by email)
- `admin_events`, `duplicate_name_groups`, `human_verification_requests`, `record_merge_log`: staff-only access
- `partners`: staff-only viewing (public insert for applications retained)
- All write operations (INSERT/UPDATE) on sensitive tables now restricted to service_role (edge functions)

### ✅ Credit Gate on Search (Critical Fix #2)
- `multi-parameter-search` edge function now **requires credits** before executing
- Checks `purchases` table first (PayFast flow), then `manual_payments` (legacy flow)
- Returns 402 with redirect to /pricing if no credits available
- Dashboard form handles no-credits gracefully with user-friendly error + redirect
- No more free unlimited searches

---

## Remaining Launch Checklist

### Still Must-Do Before Launch:
1. ~~Lock down RLS policies~~ ✅ DONE
2. ~~Add credit-checking to dashboard search~~ ✅ DONE
3. Wire up confirmation emails (payment + results) — `send-email` exists but not triggered
4. Test PayFast end-to-end with a real R99 transaction
5. Get 5 real humans to test the full flow
6. Populate gazette records OR remove "3 data sources" claim

### Should-Do Before Launch:
7. Remove legacy /search-form route
8. Add basic error monitoring
9. Add rate limiting to search function
10. Replace AI photos with real SA stock photos

### Can Wait:
- SEO meta tags
- Analytics integration
- Referral programme at-scale testing
- Partner programme automated follow-up

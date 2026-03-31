

# RedFlaq Full Platform Audit

## Live Database Stats (as of now)

| Table | Records | Notes |
|-------|---------|-------|
| wanted_persons (active) | 1,220 | Core data, populated |
| saflii_judgments | 143 | Court judgments indexed |
| gazette_records | 0 | Empty — no gazette data imported yet |
| profiles (users) | 18 | 18 registered users |
| user_roles | 16 (15 user, 1 owner) | Role system working |
| searches (checks run) | 80 | 80 checks executed |
| purchases (completed) | 17 | 17 completed purchases |
| manual_payments (verified) | 21 | 21 verified payments |
| manual_payments (pending) | 36 | 36 still pending — likely abandoned Yoco sessions |
| journal_entries | 1 | 1 journal entry created |
| journal_evidence | 0 | No evidence files uploaded |
| affidavit_drafts | 0 | No affidavits generated |
| whatsapp_conversations | 3 | 3 conversations started |
| whatsapp_messages | 10 | 10 messages logged |
| whatsapp_openings | 5 | Bot greetings configured |
| behavioral_assessments | 1 | 1 assessment completed |
| habit_checkins | 1 | 1 habit check-in |
| academy_articles (published) | 6 | 6 blog articles live |
| gbv_resources | 34 | Safety resource directory populated |
| disputes | 0 | No disputes filed |
| partners | 0 | No partner applications |
| referrals | 0 | Referral system unused |
| secure_report_links | 2 | 2 secure share links created |

---

## Feature-by-Feature Status

### WORKING (Confirmed functional)

**1. Landing Page / Marketing Site**
- Homepage with Hormozi-style copy, testimonials, pricing, FAQ
- Navbar with auth-aware menu (login/signup vs dashboard)
- Footer with links, WhatsApp, social
- PWA install banner
- Status: WORKING. No console errors.

**2. User Authentication (Signup / Sign In)**
- Email + password signup with Supabase Auth
- Email verification flow (email confirmation required before sign-in)
- Password reset flow
- Password strength indicator
- POPIA consent checkbox
- Profile auto-creation via `handle_new_user()` trigger
- Default "user" role assignment on signup
- 18 users registered, role system active
- Status: WORKING

**3. Verify — Safety Check Engine (Paid Core Feature)**
- Multi-parameter search across 3 databases (wanted_persons, saflii_judgments, gazette_records)
- Fuzzy/exact name matching, ID number, case number, province filtering
- Risk scoring (0-100) with GREEN/YELLOW/ORANGE/RED badges
- Credit deduction per search
- 80 searches executed successfully
- All source labels unified to "RedFlaq Verified Public Records Network"
- External source links removed
- Status: WORKING

**4. Yoco Payment Integration**
- `create-yoco-checkout` edge function creates payment sessions (R99/R249/R399)
- `yoco-webhook` handles payment confirmation, awards credits
- Sends confirmation email to customer + notification to founder
- Idempotency check prevents double-crediting
- 17 completed purchases, 21 verified manual payments
- Status: WORKING (payments are being processed)

**5. Credit System**
- Real-time credit tracking via `useCredits` hook
- Pulls from both `purchases` and `manual_payments` tables
- Realtime subscription for instant UI updates
- Polling fallback after payment redirect
- Status: WORKING

**6. My Safety Journal (Free Core Feature)**
- Create, view, edit journal entries
- Structured incident documentation (abuse types, witnesses, location, etc.)
- SHA-256 cryptographic hashing via `generateStatementHash()`
- Statement locking (immutable after verification)
- Server-side locking via `lock_journal_entry_statement()` DB function
- Evidence file upload to private `journal-evidence` storage bucket
- File hashing via `generateFileHash()`
- Timeline export, PDF certificate generation
- 1 entry created, 0 evidence files uploaded
- Status: WORKING (code complete, minimally used)

**7. Affidavit Builder (Free Feature)**
- Draft affidavit PDF generator for DVA protection order applications
- Links journal entries as supporting evidence
- Client-side PDF generation
- 0 drafts created
- Status: WORKING (code complete, unused)

**8. Blog / Academy**
- 6 published articles
- Slug-based routing, legacy `/academy` redirects to `/blog`
- Admin can manage articles via admin panel
- Status: WORKING

**9. Safety Tips / Tools**
- First Date Safety, Tenant Safety, Domestic Worker Safety, Red Flag Quiz
- GBV Resources directory (34 resources loaded)
- Provincial resources section
- Conversation guide
- Status: WORKING

**10. Admin Panel**
- Dashboard with stats
- User management, check review, content management
- Payment verification (manual EFT verification)
- Gazette management, scraper, import tools
- Merge review for duplicate records
- Analytics page
- Status: WORKING (admin auth has security concerns — see below)

**11. Email System**
- Resend-based email sending via `send-email` edge function
- Email queue system with pgmq (enqueue, batch read, DLQ)
- `process-email-queue` runs on schedule
- Auth email hook for custom branded emails (signup, recovery, etc.)
- Suppressed email tracking
- Status: WORKING (RESEND_API_KEY configured)

**12. Secure Report Sharing**
- Token-based secure links (7-day expiry)
- `verify-secure-link` edge function validates tokens
- 2 links created
- Status: WORKING

**13. Data Sources**
- SAPS scraper (`scrape-saps-wanted`, `scrape-saps-details`)
- OpenSanctions importer (`import-opensanctions`)
- SAFLII indexer (`index-saflii`)
- Gazette PDF extractor (`extract-gazette`)
- CSV import for wanted persons
- Status: WORKING (1,220 wanted persons + 143 SAFLII records loaded)

---

### NOT WORKING / ISSUES

**14. WhatsApp Chatbot**
- Code is complete and well-structured (7-state conversational flow)
- Edge functions deployed (22 deployments)
- Secrets configured (WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN)
- 3 conversations and 10 messages in database (some historical activity)
- **0 invocations recently** — no recent traffic reaching the webhook
- **Root cause: Meta Developer Dashboard webhook configuration** — the callback URL is not correctly pointing to the edge function, or the verify token does not match
- Status: NOT WORKING — Meta webhook not receiving/forwarding messages

**15. Gazette Records**
- Table exists, extraction edge function exists
- **0 records in database** — no gazette data has been imported
- Status: NOT WORKING — empty dataset, search will find nothing from this source

**16. Admin Authentication Security**
- Admin login uses a shared password checked via `verify-admin` edge function (server-side) — this part is fine
- **But admin session is stored in `localStorage("admin_authenticated")`** — easily spoofable
- Admin password is stored in plain text in `localStorage("adminPassword")` — major security risk
- Some admin pages (AdminImport, AdminMergeReview) only check localStorage, not server-side
- AdminDashboard has a hybrid check (Supabase role + localStorage fallback)
- Status: SECURITY VULNERABILITY — anyone can set `localStorage.admin_authenticated = "true"` in browser console and access admin pages

**17. Stripe Integration**
- `create-stripe-checkout` and `stripe-webhook` edge functions exist
- STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET configured
- **No evidence of any Stripe transactions** — appears to be a backup/alternative to Yoco
- Status: BUILT BUT UNUSED

**18. PayFast Integration**
- `create-payfast-payment` and `payfast-itn` edge functions exist
- PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_PASSPHRASE configured
- **No evidence of any PayFast transactions**
- Status: BUILT BUT UNUSED

**19. Behavioral Signal Detection**
- Page exists at `/dashboard/behavioral-signals`
- `analyze-behavioral-signals` edge function exists
- 1 assessment in database
- Uses AI analysis (Lovable AI integration)
- Status: PARTIALLY WORKING — built but barely tested

**20. Habit Dashboard**
- Page exists at `/dashboard/habit`
- 1 check-in in database
- Status: PARTIALLY WORKING — built but barely used

**21. Referral System**
- Table exists, RLS policies in place
- 0 referrals recorded
- Status: BUILT BUT UNUSED

**22. Partner Program**
- Application form exists at `/partners/apply`
- 0 applications submitted
- Status: BUILT BUT UNUSED

**23. Shop**
- Shop page with product grid exists
- Appears to be merchandise/educational content
- Status: STATIC — no ecommerce backend

**24. 36 Pending Manual Payments**
- 36 payment records stuck in "pending" status
- These are likely abandoned Yoco checkout sessions where users started but never completed payment
- Status: DATA CLEANUP NEEDED

---

### COMING SOON PAGES (Placeholders)

- `/api-coming-soon` — API access for organizations
- `/redflaq-org-coming-soon` — RedFlaq.org nonprofit arm
- `/habit-coming-soon` — Habit tracker landing
- `/behavioral-signal-coming-soon` — Behavioral signal landing

---

## Summary

```text
FEATURE STATUS BREAKDOWN
═══════════════════════════════════════════
FULLY WORKING (13):
  Landing page, Auth, Verify search engine,
  Yoco payments, Credit system, Safety Journal,
  Affidavit builder, Blog, Safety tips/tools,
  Admin panel, Email system, Secure sharing,
  Data importers

NOT WORKING (2):
  WhatsApp chatbot (Meta webhook misconfigured)
  Gazette records (0 data imported)

SECURITY ISSUE (1):
  Admin auth uses localStorage — spoofable

BUILT BUT UNUSED (4):
  Stripe, PayFast, Referrals, Partners

PARTIALLY WORKING (2):
  Behavioral signals, Habit dashboard

DATA CLEANUP (1):
  36 abandoned pending payments
═══════════════════════════════════════════
```

## Priority Fixes Recommended (when you're ready)

1. **WhatsApp webhook** — Fix Meta Developer Dashboard callback URL + verify token match
2. **Admin auth security** — Replace localStorage checks with proper Supabase role-based auth on all admin pages
3. **Gazette data** — Import gazette records so the third data source is populated
4. **Pending payments cleanup** — Archive or expire the 36 stale pending payments


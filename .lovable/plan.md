

# RedFlaq — Complete Platform Architecture Document

## What RedFlaq Is

RedFlaq is a South African safety verification platform that enables individuals — primarily women — to check whether someone has a criminal record, protection order, or public safety warning **before** trusting them with their life, home, or children. It positions itself not as an awareness campaign, but as an action tool: "Before you trust — RedFlaq first."

---

## 1. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui components |
| Backend | Lovable Cloud (Supabase) |
| Edge Functions | 26 Deno-based serverless functions |
| Database | PostgreSQL with Row-Level Security |
| Auth | Supabase Auth (email/password, email verification) |
| Payments | Yoco (primary SA), Stripe, PayFast |
| Messaging | Meta WhatsApp Cloud API |
| Email | Resend + custom email queue (pgmq) |
| PWA | Service worker with install banner |
| Data Sources | SAPS, OpenSanctions, SAFLII, Government Gazette |

---

## 2. Public-Facing Pages (22 routes)

### Core Conversion Flow
| Route | Page | Purpose |
|-------|------|---------|
| `/` | Landing Page | 20+ section Hormozi-style conversion page |
| `/signup` | Signup/Login | Email auth with verification |
| `/verify-email` | Email Verification | Post-signup confirmation |
| `/reset-password` | Password Reset | Recovery flow |
| `/pricing` | Pricing Page | Check pricing breakdown |
| `/search-form` | Search Form | Run a safety check |
| `/results` | Results Page | Display check results with risk levels |
| `/demo-result` | Demo Result | Preview sample report |

### Information Pages
| Route | Page |
|-------|------|
| `/about` | About RedFlaq (team, mission) |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/sources` | Data Sources transparency |
| `/dispute` | Dispute a record |
| `/whatsapp` | WhatsApp bot landing page |
| `/blog` | Blog/Academy articles |
| `/blog/:slug` | Individual blog articles |
| `/partners` | Partner program info |
| `/partners/apply` | Partner application form |
| `/shop` | Merchandise shop |
| `/conversation-guide` | How to have the conversation |

### Safety Tools
| Route | Tool |
|-------|------|
| `/safety-tips` | Safety resources hub with GBV provincial resources |
| `/safety-tips/first-date-safety` | First date safety checklist |
| `/safety-tips/tenant-safety` | Tenant verification guide |
| `/safety-tips/domestic-worker-safety` | Domestic worker safety |
| `/safety-tips/red-flag-quiz` | Interactive red flag quiz |

### Roadmap / Coming Soon
| Route | Feature |
|-------|---------|
| `/habit-coming-soon` | Safety Habit Tracker |
| `/behavioral-signal-coming-soon` | Behavioral Signal Detection |
| `/api-coming-soon` | Developer API |
| `/redflaq-org-coming-soon` | RedFlaq.org nonprofit arm |

---

## 3. Authenticated User Dashboard (12 routes)

| Route | Feature |
|-------|---------|
| `/dashboard` | Main dashboard (overview of checks, credits) |
| `/dashboard/new-check` | Run a new safety check |
| `/dashboard/reports` | View past check reports |
| `/dashboard/account` | Account settings |
| `/dashboard/help` | Help & support |
| `/dashboard/claim` | Claim a payment reference for credits |
| `/dashboard/journal` | Safety Journal — list entries |
| `/dashboard/journal/new` | Create new journal entry |
| `/dashboard/journal/:id` | View journal entry detail |
| `/dashboard/journal/:id/edit` | Edit journal entry |
| `/dashboard/journal/export` | Export journal as PDF timeline |
| `/dashboard/affidavit` | Affidavit Builder (generate legal documents) |
| `/dashboard/habit` | Safety Habit Dashboard (streaks, check-ins) |
| `/dashboard/behavioral-signals` | AI-powered behavioral signal detection |

---

## 4. Admin Panel (14 routes)

| Route | Function |
|-------|----------|
| `/admin/login` | Admin authentication |
| `/admin` | New admin dashboard (overview) |
| `/admin/dashboard` | Legacy admin dashboard |
| `/admin/users` | User management |
| `/admin/checks` | View all searches |
| `/admin/content` | Blog/academy article management |
| `/admin/pricing` | Pricing configuration |
| `/admin/analytics` | Platform analytics |
| `/admin/system` | System settings |
| `/admin/gazette` | Government Gazette record management |
| `/admin/scraper` | SAPS web scraper controls |
| `/admin/import` | Bulk data import (CSV) |
| `/admin/verify-payments` | Manual payment verification |
| `/admin/merge-review` | Duplicate record merge review |

---

## 5. Database Schema (27 tables)

### User & Auth
- **profiles** — user metadata (name, avatar, status)
- **user_roles** — RBAC roles (owner, admin, support, user)

### Criminal Records & Data
- **wanted_persons** — core criminal records (SAPS, OpenSanctions, multi-source)
- **criminal_records** — identity data with risk levels
- **saflii_judgments** — High Court judgment records
- **gazette_records** — Government Gazette notices (insolvency, etc.)
- **duplicate_name_groups** — flagged potential duplicates for admin review
- **record_merge_log** — audit trail of merged records

### Searches & Payments
- **searches** — all safety check audit logs with risk scoring
- **purchases** — completed payment records (Yoco, Stripe, PayPal)
- **manual_payments** — EFT/manual payment tracking
- **reference_claim_logs** — payment reference claim audit
- **secure_report_links** — time-limited shareable report URLs

### Safety Journal System
- **journal_entries** — incident documentation with cryptographic locking (SHA-256 hash)
- **journal_evidence** — media attachments with file hashes
- **affidavit_drafts** — legal document drafts linked to journal entries

### Safety Habit Tracker
- **habit_checkins** — daily safety check-in responses
- **habit_streaks** — streak tracking (current, longest, total)

### Behavioral Assessment
- **behavioral_assessments** — AI-analyzed behavioral signal questionnaires

### WhatsApp Bot
- **whatsapp_conversations** — conversation state machine tracking
- **whatsapp_messages** — full message log (inbound + outbound)
- **whatsapp_openings** — curated rotating opening messages

### Platform Operations
- **admin_events** — admin action audit log
- **site_settings** — key-value platform configuration
- **partners** — partner program applications
- **referrals** — referral tracking
- **disputes** — record dispute submissions
- **gbv_resources** — GBV shelter/helpline directory by province
- **academy_articles** — blog/academy CMS content

### Email Infrastructure
- **email_send_log** — delivery tracking
- **email_send_state** — rate limiting & batch config
- **email_unsubscribe_tokens** — unsubscribe management
- **suppressed_emails** — bounce/complaint suppression list

---

## 6. Edge Functions (26 serverless functions)

### Payment Processing
| Function | Purpose |
|----------|---------|
| `create-yoco-checkout` | Create Yoco payment session |
| `yoco-webhook` | Process Yoco payment confirmations |
| `register-yoco-webhook` | Register Yoco webhook endpoint |
| `create-stripe-checkout` | Create Stripe checkout session |
| `stripe-webhook` | Process Stripe events |
| `create-payfast-payment` | Create PayFast payment |
| `payfast-itn` | PayFast instant transaction notification |
| `submit-payment` | Generic payment submission |
| `admin-verify-payment` | Admin manual payment verification |

### Data Pipeline
| Function | Purpose |
|----------|---------|
| `multi-parameter-search` | Core search engine (name, ID, province, DOB, case number) |
| `import-wanted-persons` | Bulk CSV import of wanted persons |
| `import-opensanctions` | OpenSanctions API data import |
| `import-sapswanted` | SAPS wanted persons import |
| `scrape-saps-wanted` | Scrape SAPS wanted list |
| `scrape-saps-details` | Scrape individual SAPS detail pages |
| `index-saflii` | Index SAFLII court judgments |
| `extract-gazette` | Extract names from Government Gazette PDFs |

### Communication
| Function | Purpose |
|----------|---------|
| `whatsapp-webhook` | WhatsApp chatbot (state machine with 7 states) |
| `whatsapp-followup` | Automated WhatsApp follow-up messages |
| `send-email` | Transactional email via Resend |
| `process-email-queue` | Batch email queue processor (pgmq) |
| `auth-email-hook` | Custom branded auth emails |

### Security & Admin
| Function | Purpose |
|----------|---------|
| `verify-admin` | Admin authentication |
| `verify-secure-link` | Validate time-limited report sharing links |
| `analyze-behavioral-signals` | AI-powered behavioral signal analysis |

---

## 7. Key Features in Detail

### A. Multi-Source Safety Check Engine
- Searches across SAPS wanted persons, OpenSanctions (FIC), SAFLII court judgments, and Government Gazette records
- 7+ search strategies (name match, ID number, province filter, case number, DOB, fuzzy matching, live API)
- Risk scoring algorithm producing GREEN / AMBER / RED risk levels
- Identity confidence scoring for match quality
- Human verification flagging for ambiguous matches

### B. Safety Journal (Cryptographically Secured)
- Full incident documentation (date, time, location, witnesses, abuse types)
- Evidence attachment with SHA-256 file hashing
- Statement locking with cryptographic hash — tamper-proof once locked
- PDF timeline export for legal proceedings
- Affidavit builder that pulls from journal entries
- Addendum notes after locking

### C. WhatsApp Chatbot
- 7-state conversation flow: START → MENU → CHECK_CONSENT → CHECK_NAME → CHECK_PROVINCE → CHECK_SENT → FOLLOWUP_SENT
- Rotating opening messages from database
- Consent-gated check initiation
- Direct deep-link generation to pre-filled check forms
- Automated follow-up messaging
- Full conversation and message logging

### D. Payment System (3 gateways)
- **Yoco** (primary): SA card payments with webhook verification
- **Stripe**: International card payments
- **PayFast**: SA alternative with ITN
- Credit-based system with reference claiming
- Manual EFT payment verification by admin
- Receipt generation

### E. Email Infrastructure
- Custom branded auth emails (signup, recovery, magic link, email change)
- pgmq-based email queue for reliability
- Rate limiting and retry logic
- Bounce/complaint suppression
- Unsubscribe token management
- Dead letter queue for failed sends

### F. Safety Habit Tracker
- Daily check-in questionnaire
- Streak tracking (current, longest, total)
- Gamified safety habit building

### G. Behavioral Signal Detection
- AI-powered analysis of relationship behavior descriptions
- Risk categorization and scoring
- Questionnaire-based and free-text assessment modes

### H. Progressive Web App (PWA)
- Install banner for mobile users
- Custom icons (192x192, 512x512)
- Offline-capable service worker

---

## 8. Security Architecture

### Row-Level Security (RLS)
- Every table has RLS enabled
- User data isolated by `auth.uid()`
- Staff access gated by `has_role()` security definer function
- Role hierarchy: Owner > Admin > Support > User
- Service role access for edge functions and system operations

### Data Protection
- Journal entries use SHA-256 cryptographic hashing
- Evidence files individually hashed
- Secure report sharing via time-limited tokens (7-day expiry)
- No direct auth.users table references from public schema

### Admin Security
- Server-side role verification (never client-side)
- Admin event audit logging
- Separate admin login flow

---

## 9. Landing Page Architecture (24 sections)

1. NavbarPlinq
2. HeroHormozi (editorial hook + hero image)
3. GovDataSection (national disaster classification + stats)
4. TickerBar (trust ticker)
5. HomepageDemo (interactive search simulation)
6. BarrierSection (why no one checked before)
7. SolutionHormozi (solution pillars)
8. HowItWorksPlinq (4-step timeline)
9. RiskLevelsSection (what your report reveals)
10. StatsBar (trust statistics)
11. PhotoGrid (real SA women)
12. ValueStack (FREE tier value explosion — R12,000+ value at R0)
13. PaidChecksSection (R99 pricing)
14. TestimonialsSectionNew
15. IndustriesBrief (who this is for)
16. CommunityImageStrip (photo gallery)
17. CommunitySectionSA ("You're not paranoid. You're prepared.")
18. WhyRedflaqSection (3-person leadership team)
19. AdvocacySection (R99 CTA)
20. FinalUrgency
21. FinalCTAPlinq (Joburg skyline CTA)
22. FAQHormozi
23. FooterPlinq
24. PWAInstallBanner

---

## 10. Utility Libraries

| File | Purpose |
|------|---------|
| `riskScoring.ts` | Risk level calculation algorithm |
| `identityConfidence.ts` | Match confidence scoring |
| `idValidation.ts` | SA ID number validation |
| `caseNumberParser.ts` | Court case number parsing |
| `hashUtils.ts` | SHA-256 hashing for journal entries |
| `pdfCertificate.ts` | Safety check certificate PDF generation |
| `pdfAffidavit.ts` | Affidavit PDF generation |
| `pdfDashboardReport.ts` | Dashboard report PDF export |
| `pdfTimeline.ts` | Journal timeline PDF export |
| `importWantedPersons.ts` | CSV import utility |

---

## 11. Custom Hooks

| Hook | Purpose |
|------|---------|
| `useAuth` | Authentication state management |
| `useAuthGuard` | Protected route enforcement |
| `useCredits` | Check credit balance tracking |
| `useUserRole` | Role-based access control |
| `usePWAInstall` | PWA install prompt handling |
| `useScrollAnimation` | Scroll-triggered animations |
| `useScrollReveal` | Section reveal on scroll |
| `useCountUp` | Animated number counting |
| `useMobile` | Responsive breakpoint detection |

---

## 12. External Integrations

| Service | Purpose | Secret |
|---------|---------|--------|
| Meta WhatsApp Cloud API | Chatbot messaging | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN` |
| Yoco | SA payments | `YOCO_SECRET_KEY` |
| Stripe | International payments | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| PayFast | SA payments | `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE` |
| OpenSanctions | Sanctions/FIC data | `OPENSANCTIONS_API_KEY` |
| Resend | Transactional email | `RESEND_API_KEY` |
| Firecrawl | Web scraping | `FIRECRAWL_API_KEY` (connector) |
| Lovable AI | Behavioral signal analysis | `LOVABLE_API_KEY` |

---

## 13. Database Migrations

**34 migrations** have been applied, spanning from November 2025 to March 2026, building the full schema incrementally.

---

## 14. Brand Positioning Summary

- **Primary CTA**: "Create Your Free Safety Base"
- **Pricing**: R99 per criminal record check; everything else free
- **Value Stack**: R12,000+ annual value (Journal, Affidavit Builder, legal resources) at R0
- **Positioning**: Action tool, not awareness campaign
- **Core verb**: "RedFlaq" as a verb — "RedFlaq first"
- **Target**: SA women making trust decisions (dating, hiring, childcare)
- **Data anchors**: DCOG/DWYPD national disaster classification, HSRC stats, "every 4 hours a woman is killed"

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total routes | 60+ |
| Database tables | 27+ |
| Edge functions | 26 |
| UI components | 100+ |
| Custom hooks | 9 |
| Utility libraries | 10 |
| Payment gateways | 3 |
| Data sources | 4 (SAPS, OpenSanctions, SAFLII, Gazette) |
| Database migrations | 34 |
| External integrations | 8 |
| Storage buckets | 2 (gazette-pdfs, journal-evidence) |


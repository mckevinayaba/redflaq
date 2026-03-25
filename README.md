# RedFlaq 🔴

**South Africa's first public record safety check and evidence documentation platform.**

RedFlaq closes the information inequality gap by giving ordinary people instant, affordable access to public criminal records — and free tools to document abuse for legal proceedings.

---

## Why RedFlaq Exists

In South Africa, a traditional background check costs R2,000+ and takes 5–14 business days. Most people — especially women, tenants, and parents — cannot afford this. Meanwhile, gender-based violence affects 1 in 3 women, and survivors often lack the tools to build a legal case.

RedFlaq solves both problems in one platform.

---

## Core Features

### 💰 Verify — Instant Safety Check *(Paid: R99 per check)*

The only paid feature. A fingerprint-free criminal record check that searches across three South African public record databases in seconds:

- **SAPS Wanted Persons** — active warrants and wanted suspects
- **SAFLII Court Judgments** — criminal case outcomes from SA courts
- **Government Gazette** — insolvency, sequestration, and legal notices

Each check returns a **0–100 risk score** with color-coded badge (GREEN / YELLOW / ORANGE / RED), offense categorization, identity confidence scoring, and human verification for ambiguous matches.

**How it works:**
1. User enters the person's name (+ optional ID number, province)
2. Multi-parameter search engine queries all three databases
3. Results displayed with risk assessment and source links
4. Credits purchased via Yoco (South Africa's leading card payment gateway)

### 📓 My Safety Journal *(Free)*

A secure digital incident diary with cryptographic integrity verification:

- **Structured incident recording** — who, what, when, where, abuse type classification
- **Evidence uploads** — photos, videos, audio, documents (50MB limit per file)
- **SHA-256 cryptographic hashing** — every statement and file receives a tamper-proof fingerprint
- **Statement locking** — once verified, entries become immutable with timestamp proof
- **Verification certificates** — court-ready PDF showing the SHA-256 hash chain
- **Timeline export** — chronological PDF of all entries for protection order applications

Admissible as electronic evidence under South Africa's **ECTA Section 15**. Private to the user — no admin access (strict Row-Level Security).

### 📄 Affidavit Builder *(Free)*

Generates draft affidavit PDFs in the format required by South African Magistrate's Courts for **Domestic Violence Act (Act 116 of 1998)** protection order applications. Users can link journal entries as supporting evidence.

### 🛡️ Additional Free Features

- **Behavioral Signal Detection** — AI-powered red flag assessment
- **Safety Academy** — educational articles on dating safety, tenant safety, and more
- **GBV Resource Directory** — national helplines, shelters, and legal aid by province
- **Red Flag Quiz** — interactive relationship safety assessment
- **Conversation Guide** — scripts for difficult safety conversations
- **WhatsApp Bot** — safety checks via WhatsApp for users without app access
- **Referral System** — share safety with friends and earn credits
- **Discreet Mode** — hide check results from your own dashboard

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions, Storage, Realtime) |
| **Payments** | Yoco Checkout API (ZAR) |
| **Hosting** | Lovable Cloud |
| **PDF Generation** | jsPDF (client-side) |
| **Cryptography** | Web Crypto API (SHA-256) |

---

## Architecture Overview

### Database (27+ tables with Row-Level Security)

Key tables:
- `wanted_persons` — SAPS wanted persons records (public read)
- `saflii_judgments` — court judgment records (public read)
- `gazette_records` — government gazette entries (public read)
- `searches` — audit log of all safety checks (user-scoped)
- `journal_entries` — incident documentation with SHA-256 hashes (user-only)
- `journal_evidence` — uploaded evidence files with file hashes (user-only)
- `affidavit_drafts` — legal document drafts (user-only)
- `manual_payments` / `purchases` — payment and credit tracking
- `user_roles` — RBAC: owner, admin, support, moderator, user

### Edge Functions (26 Deno-based serverless functions)

Core:
- `multi-parameter-search` — the Verify search engine
- `create-yoco-checkout` — payment session creation
- `yoco-webhook` — payment confirmation and credit provisioning
- `whatsapp-webhook` / `whatsapp-followup` — WhatsApp bot state machine

Data ingestion:
- `scrape-saps-wanted` / `scrape-saps-details` — SAPS data collection
- `index-saflii` — court judgment indexing
- `extract-gazette` — Government Gazette parsing
- `import-opensanctions` — international sanctions data

### Security

- **POPIA compliant** — SA ID numbers validated but never stored in full; user data protected by RLS
- **SHA-256 evidence integrity** — tamper-proof hashing for legal admissibility
- **RBAC** — 5-tier role system (Owner > Admin > Support > Moderator > User)
- **PCI compliant** — no card data touches our servers (Yoco handles payment security)

---

## Project Structure

```
src/
├── components/
│   ├── landing/        # Homepage sections
│   ├── dashboard/      # User dashboard layout and components
│   ├── admin/          # Admin panel layout and components
│   ├── safety/         # GBV resources and safety tools
│   ├── shop/           # Merchandise store components
│   ├── tools/          # Interactive safety tools layout
│   └── ui/             # shadcn/ui component library
├── hooks/              # Custom React hooks (auth, credits, roles)
├── pages/              # Route-level page components
├── utils/
│   ├── riskScoring.ts          # 0-100 risk score algorithm
│   ├── identityConfidence.ts   # Match confidence scoring
│   ├── hashUtils.ts            # SHA-256 hashing (statements + files)
│   ├── idValidation.ts         # SA ID number validation
│   ├── pdfAffidavit.ts         # Affidavit PDF generator
│   ├── pdfCertificate.ts       # Verification certificate generator
│   ├── pdfTimeline.ts          # Journal timeline export
│   └── pdfDashboardReport.ts   # Admin analytics report
└── integrations/
    └── supabase/               # Auto-generated client and types

supabase/
├── functions/          # 26 Deno Edge Functions
├── config.toml         # Function configuration
└── migrations/         # Database schema migrations
```

---

## Business Model

**One paid feature. Everything else is free.**

| Package | Price (ZAR) | Credits |
|---------|-------------|---------|
| Single Check | R99 | 1 |
| Safety Pack | R249 | 3 |
| Family & Friends | R399 | 5 |

The free tier delivers R12,000+ in annual value (Safety Journal, Affidavit Builder, legal resources, safety tools) — users only pay when they want to verify someone's criminal record.

---

## Legal Framework

- **POPIA** (Protection of Personal Information Act) — data minimization, consent, purpose limitation
- **ECTA** (Electronic Communications and Transactions Act) — electronic evidence admissibility
- **DVA** (Domestic Violence Act 116 of 1998) — affidavit format compliance
- **Criminal Procedure Act** — offense severity classification (Schedule 1-8)

---

## Contact

- **Product**: [redflaq.lovable.app](https://redflaq.lovable.app)
- **GitHub**: [github.com/mckevinayaba/redflaq](https://github.com/mckevinayaba/redflaq)

---

*Built with [Lovable](https://lovable.dev) · Powered by Supabase · Payments by Yoco*

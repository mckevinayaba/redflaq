<!-- Last sync test: 2026-03-25 -->
# 🔴 RedFlaq

**South Africa's first public record safety check and evidence documentation platform.**

Before you trust — RedFlaq first.

---

## What Is RedFlaq?

RedFlaq enables individuals — primarily women — to check whether someone has a criminal record, protection order, or public safety warning **before** trusting them with their life, home, or children.

It combines **instant public record checks** with a **court-ready evidence documentation system** (My Safety Journal), making it both a prevention tool and a legal preparedness platform.

### The Problem RedFlaq Solves

South Africa has the highest rate of gender-based violence globally. The Department of Social Development classifies GBV as a **national disaster**. Yet there is no accessible, affordable way for ordinary citizens to check someone's criminal history before making trust decisions — hiring a nanny, moving in with a partner, or accepting a tenant.

RedFlaq closes that gap.

---

## Key Features

### 🔍 Instant Safety Checks (R99/check)
- Search across **4 public data sources** simultaneously
- Cross-references SAPS wanted persons, SAFLII court judgments, Government Gazette records, and OpenSanctions
- Multi-strategy name matching (exact, normalised, phonetic, fuzzy)
- Risk score engine (0-100) with SA-specific legal term classification
- Identity confidence scoring to reduce false positives
- No fingerprints required — name-based, instant results

### 📓 My Safety Journal (Free)
- Structured incident documentation with guided prompts
- **SHA-256 cryptographic hashing** — each verified entry is hashed and locked, creating a tamper-proof evidence chain
- Evidence file uploads (photos, videos, audio, documents) with per-file hash verification
- Timestamped, immutable statements that satisfy ECTA Section 15 for electronic evidence admissibility
- Addendum system for post-verification updates (medical reports, police case numbers)
- Exportable verification certificates for court use

### 📄 Affidavit Builder (Free)
- Generates court-ready PDF drafts in the format required by SA Magistrate's Courts
- Pre-populated from journal entries for DVA (Act 116 of 1998) protection order applications
- Includes deponent details, statement of facts, relief sought, and Commissioner of Oaths section
- Clearly marked as DRAFT — must be commissioned at a police station

### 🛡️ Safety Tools (Free)
- Red Flag Quiz — behavioural pattern assessment
- First Date Safety Checklist
- Domestic Worker Safety Guide
- Tenant Safety Screening Guide
- Conversation guides for difficult safety discussions
- Provincial GBV resource directory

### 💬 WhatsApp Safety Bot
- 7-state conversation machine for users without app access
- Consent-first flow with POPIA compliance
- Generates secure report links viewable on any device
- Automated follow-up messaging

---

## Technical Architecture

### Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + shadcn/ui |
| Backend | Lovable Cloud (Supabase) |
| Functions | 26 Deno-based Edge Functions |
| Database | PostgreSQL with Row-Level Security |
| Auth | Email/password with verification |
| Payments | Yoco (primary), Stripe, PayFast |
| Messaging | Meta WhatsApp Cloud API |
| Email | Resend + custom pgmq queue |
| PWA | Service worker with install banner |

### Data Sources

| Source | Data Type |
|--------|-----------|
| SAPS (South African Police Service) | Wanted persons, case numbers |
| SAFLII (Southern African Legal Information Institute) | Criminal court judgments |
| Government Gazette | Protection orders, insolvencies, legal notices |
| OpenSanctions | International sanctions, FIC watchlists |

### Database

- **27+ tables** with comprehensive Row-Level Security policies
- Role-based access: `public`, `user`, `support`, `admin`, `owner`
- `has_role()` security definer function prevents recursive RLS
- Realtime subscriptions for credit balance updates
- Custom pgmq email queue with dead-letter queue handling

### Security & Compliance

#### POPIA (Protection of Personal Information Act)
- **Consent-first**: Users explicitly consent before any data processing
- **Data minimisation**: Only publicly available records are searched
- **Right to dispute**: Built-in dispute resolution flow (Regulation 8 compliance)
- **ID validation without storage**: SA ID numbers are validated client-side using Luhn algorithm; full IDs are never stored
- **Session-only auth data**: No PII cached beyond the authenticated session

#### Evidence Integrity
- SHA-256 hashing of journal entry statement fields (description, date, time, user_id, created_at)
- Per-file SHA-256 hashing for uploaded evidence
- `lock_journal_entry_statement` database function makes verified entries immutable
- Hash verification certificates exportable as PDF
- Compliant with ECTA Section 15 (electronic evidence admissibility)

#### Infrastructure
- Row-Level Security on all user-facing tables
- Edge functions with JWT verification
- No direct database access from client — all mutations through RLS-protected queries
- Admin actions logged in `admin_events` audit table

---

## Project Structure

```
src/
├── components/
│   ├── landing/        # 40+ conversion-optimised landing page sections
│   ├── dashboard/      # User dashboard layout and navigation
│   ├── admin/          # Admin panel layout (role-gated)
│   ├── safety/         # GBV resources and safety tools
│   ├── shop/           # Merchandise shop components
│   ├── tools/          # Safety tool layouts
│   └── ui/             # shadcn/ui component library
├── hooks/
│   ├── useAuth.ts      # Authentication state management
│   ├── useCredits.ts   # Credit balance with realtime updates
│   ├── useUserRole.ts  # Role-based access control
│   └── useAuthGuard.ts # Route protection
├── pages/              # 60+ route pages
├── utils/
│   ├── hashUtils.ts    # SHA-256 evidence hashing (critical path)
│   ├── riskScoring.ts  # 0-100 risk assessment engine
│   ├── identityConfidence.ts  # Match confidence scoring
│   ├── idValidation.ts # SA ID number validation (Luhn)
│   ├── pdfAffidavit.ts # Court-ready affidavit generation
│   ├── pdfCertificate.ts # Verification certificate PDFs
│   └── pdfTimeline.ts  # Incident timeline export
└── integrations/
    └── supabase/       # Auto-generated client and types

supabase/
├── functions/          # 26 Edge Functions
│   ├── create-yoco-checkout/   # Primary SA payment gateway
│   ├── whatsapp-webhook/       # WhatsApp bot conversation engine
│   ├── multi-parameter-search/ # Cross-source safety check
│   ├── import-opensanctions/   # Sanctions data import
│   ├── extract-gazette/        # Government Gazette parser
│   └── ...
└── config.toml         # Project configuration
```

---

## Critical Code Paths

### 1. Safety Check Flow
`SearchFormHonest.tsx` → `multi-parameter-search` (Edge Function) → `wanted_persons` + `saflii_judgments` + `gazette_records` → `riskScoring.ts` → `ResultsPageUpdated.tsx`

### 2. Evidence Documentation Flow
`JournalNew.tsx` → `hashUtils.generateStatementHash()` → `lock_journal_entry_statement` (DB function) → `pdfCertificate.ts` → Court-ready PDF

### 3. Payment Flow
`PricingSection.tsx` → `create-yoco-checkout` → Yoco hosted payment → `yoco-webhook` → credit allocation → `useCredits.ts` (realtime update)

---

## Payments

| Gateway | Market | Integration |
|---------|--------|-------------|
| Yoco | South Africa (primary) | Server-side checkout + webhook |
| PayFast | South Africa (alternative) | ITN callback |
| Stripe | International | Checkout Sessions + webhook |

Pricing: **R99 per safety check**. All other features (Journal, Affidavit Builder, Safety Tools) are **free**.

---

## Running Locally

```bash
git clone <repository-url>
cd redflaq
npm install
npm run dev
```

Requires environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## Deployment

- **Frontend**: Deployed via Lovable (publish button)
- **Backend**: Edge Functions deploy automatically on push
- **Database**: Migrations managed through Lovable Cloud

---

## Legal Disclaimer

RedFlaq searches **publicly available records only**. It does not determine guilt or innocence. Results are advisory and should be considered alongside other due diligence. Users are responsible for how they use the information provided.

---

## Contact

- **Product**: [redflaq.lovable.app](https://redflaq.lovable.app)
- **Support**: Available through the in-app help system

---

*Built with conviction in South Africa. Because knowing should come before trusting.*


# RedFlaq Application - Full Audit Report

## Application Overview
RedFlaq is a South African background check service targeting women for GBV (Gender-Based Violence) prevention. It allows users to check if a person is on the SAPS (South African Police Service) wanted persons list. The service is powered by "Setup A Startup (Pty) Ltd".

---

## WORKING FEATURES

### 1. Landing Page (Marketing)
| Component | Status | Notes |
|-----------|--------|-------|
| Hero Section | Working | Purple branding, animated stats counter, CTA button |
| About Section | Working | Company information |
| Trust Badges | Working | Business credentials display |
| Problem Section | Working | Pain points articulation |
| Solution Section | Working | Service benefits |
| Social Proof | Working | Testimonials & stats |
| Pricing Section | Working | 3 tiers (R50/R120/R180) |
| Guarantee Section | Working | Money-back guarantees |
| Urgency Section | Working | Scarcity messaging |
| FAQ Section | Working | Common questions |
| Final CTA | Working | Closing conversion |
| Footer | Working | Contact info, legal links |
| Sticky Elements | Partial | Exit intent modal, floating CTA |

### 2. Payment System
| Feature | Status | Notes |
|---------|--------|-------|
| Payment Modal | Working | Bank transfer details, package selection |
| Submit Payment | Working | Edge function saves to database |
| Manual Payments Table | Working | Stores payment records |
| Instant Access | Working | Users redirected immediately after submission |
| Admin Verification | Working | `/admin/verify-payments` for manual review |

### 3. Search System
| Feature | Status | Notes |
|---------|--------|-------|
| Search Form | Working | Person, Police Case, Protection Order, Court Case types |
| SA ID Validation | Working | Luhn checksum, date validation |
| Credit Deduction | Working | Recently fixed with RLS policy |
| Criminal Records Search | Working | Edge function queries `wanted_persons` table |
| Results Display | Working | Risk levels (RED/ORANGE/GREEN) |

### 4. Database
| Table | Records | Status |
|-------|---------|--------|
| `wanted_persons` | 69 active | Working - scraped from SAPS |
| `manual_payments` | 3 records | Working - payment tracking |
| `purchases` | 0 records | Legacy/unused (PayPal) |

### 5. Admin Tools
| Tool | Status | Notes |
|------|--------|-------|
| Admin Login | Working | Basic password auth (hardcoded: "admin123") |
| Admin Scraper | Working | Scrapes SAPS wanted persons list |
| Admin Import | Working | CSV/manual import of records |
| Admin Verify Payments | Working | Approve/reject payments |

### 6. Edge Functions
| Function | Status | Purpose |
|----------|--------|---------|
| `search-criminal-records` | Working | Searches wanted_persons table |
| `scrape-saps-wanted` | Working | Scrapes SAPS website |
| `import-wanted-persons` | Working | Bulk import records |
| `submit-payment` | Working | Creates payment records |

---

## NOT WORKING / MISSING FEATURES

### 1. Email Notifications (CRITICAL)
- **Issue**: No email sending functionality exists
- **Impact**: Users expect to receive search links via email after payment
- **Current state**: Payment modal says "We email your search link" but no edge function sends emails
- **Required**: Need to integrate email service (Resend, SendGrid, etc.)

---

## ✅ FIXED ISSUES (Completed)

1. ~~**PDF Report Generation**~~ - Now working with html2pdf.js
2. ~~**Sticky Elements Branding**~~ - Updated to purple (#8B5CF6)
3. ~~**Admin Security**~~ - Password now stored in ADMIN_PASSWORD secret
4. ~~**Receipt Page Verification**~~ - Now shows pending payments with appropriate status
5. ~~**"Search Another Person" Flow**~~ - Now passes payment_id for remaining credits
6. ~~**Footer Copyright Year**~~ - Now dynamic

### Still TODO: Missing Footer Pages
- **Issue**: Footer links to pages that don't exist
- **Missing routes**: `/about`, `/privacy`, `/terms`, `/refund`, `/contact`

---

## SECURITY WARNINGS

### Database Linter Findings
1. **Extension in Public** (WARN) - Extensions should be in separate schema
2. **RLS Policy Always True** (3x WARN) - Overly permissive policies:
   - `purchases` table: INSERT, UPDATE allow `true`
   - `manual_payments` table: INSERT allows `true`

### RLS Policy Analysis
| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `wanted_persons` | Public READ | Blocked | Blocked | Blocked |
| `manual_payments` | Public READ | Public | When verified | Blocked |
| `purchases` | Public READ | Public | Public | Blocked |

---

## RECOMMENDED FIXES (Priority Order)

### High Priority
1. **Implement Email Notifications**
   - Create `send-email` edge function
   - Integrate Resend or similar service
   - Send search link after payment submission

2. **Implement PDF Report Generation**
   - Add client-side PDF generation (html2pdf.js or similar)
   - Include search results, timestamp, disclaimer

3. **Fix Admin Security**
   - Move password to environment variable/secret
   - Or implement proper Supabase Auth for admin

4. **Fix StickyElements Branding**
   - Change all red references to purple (#8B5CF6)

### Medium Priority
5. **Create Missing Legal Pages**
   - Privacy Policy
   - Terms of Service
   - Refund Policy
   - About page
   - Contact page

6. **Fix "Search Another Person" Flow**
   - Pass payment_id to allow using remaining credits

7. **Fix Receipt Page**
   - Allow viewing receipt for pending payments
   - Or show different status message

### Low Priority
8. **Tighten RLS Policies**
   - Add email validation on insert
   - Add rate limiting consideration

9. **Update Footer Copyright Year**
   - Currently shows 2024, should be dynamic

---

## DATA STATISTICS

```text
Database Summary:
- Wanted Persons: 69 active records
- Manual Payments: 3 pending payments
- Purchases (legacy): 0 records

Payment Records (Recent):
1. tg@gmail.com - R50 (pending) - 2025-11-09
2. vc@gmail.com - R50 (pending) - 2025-11-09
3. mckevin.ayaba@gmail.com - R50 (pending) - 2025-11-09
```

---

## TECHNICAL DEBT

1. **Duplicate payment tables**: `purchases` (PayPal) vs `manual_payments` (EFT) - consider consolidation
2. **CSS Variables**: Some components still use hardcoded hex colors instead of CSS variables
3. **Unused PayPal integration**: PayPal secrets exist but not used
4. **No error tracking**: No Sentry or similar for production monitoring

---

## SUMMARY

**Working Well**: Core payment flow, search functionality, SAPS scraper, admin tools

**Critical Gaps**: Email notifications, PDF generation, admin security

**Branding**: 90% converted to purple, StickyElements still needs update

The application is functional for the core use case but lacks the transactional email capability that users expect based on the UI messaging.


# RedFlaq Application - Complete Audit

## 1. Application Overview

RedFlaq is a South Africa-focused background check platform that searches public criminal records (SAPS wanted persons, FIC sanctions) for personal safety decisions. Users pay via manual EFT, then get a search link to verify a person's name against public databases.

---

## 2. Pages and Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Landing page (Plinq design) | Working |
| `/search-form` | Search form (Honest version) | Working (requires valid payment_id) |
| `/results` | Results page (Updated version) | Partially working (see bugs below) |
| `/receipt` | Payment receipt | Built, untested |
| `/about` | About RedFlaq | Working |
| `/privacy` | Privacy Policy | Working |
| `/terms` | Terms of Service | Working |
| `/dispute` | Dispute a Record (info page) | Working |
| `/admin/login` | Admin login | Working |
| `/admin/import` | Admin data import | Working |
| `/admin/scraper` | Admin SAPS scraper | Built |
| `/admin/verify-payments` | Admin payment verification | Working |
| `/admin/merge-review` | Admin merge review | Built |

---

## 3. Backend Functions (Edge Functions)

| Function | Purpose | Status |
|----------|---------|--------|
| `submit-payment` | Creates a pending manual payment record | Working |
| `verify-admin` | Validates admin password | Working |
| `search-criminal-records` | Old multi-type search (person, case, warrant, etc.) | Working but NOT used by active search form |
| `multi-parameter-search` | New tiered search (case number, ID, name, fuzzy) | Working - this is what the active search form uses |
| `import-opensanctions` | Imports za_wanted + za_fic_sanctions datasets | Working but has a data issue (see below) |
| `import-wanted-persons` | Old CSV-based import | Legacy, not actively used |
| `scrape-saps-wanted` | SAPS scraper | Legacy |
| `scrape-saps-details` | SAPS detail page scraper | Legacy |

---

## 4. Database State

### Tables and Record Counts

| Table | Records | Notes |
|-------|---------|-------|
| `wanted_persons` | 1,173 total | Only 102 have `country = 'South Africa'`! |
| `manual_payments` | 17 | All status: pending (none verified) |
| `disputes` | 0 | Empty |
| `human_verification_requests` | 0 | Empty |
| `duplicate_name_groups` | Unknown | Analytics tracking |
| `admin_events` | Unknown | Event logging |
| `purchases` | Unknown | Old PayPal purchase system (not used) |
| `record_merge_log` | Unknown | Merge tracking |

---

## 5. Critical Bugs Found

### BUG 1: Database country data NOT cleaned up (HIGH SEVERITY)
The `import-opensanctions` function was updated to hardcode `country: 'South Africa'` for new imports. However, the existing data was never cleaned. Out of 1,173 records:
- Only **102** have `country = 'South Africa'`
- **450** za_wanted records have `country = 'za'` (lowercase country code, not "South Africa")
- **621** za_fic_sanctions records have various country codes (af, iq, kp, ir, etc.)

The `multi-parameter-search` function filters by `country = 'South Africa'`, which means **only 102 of 1,173 records are actually searchable**. The other 1,071 records are invisible to searches.

### BUG 2: Search results stored in sessionStorage only (MEDIUM SEVERITY)
Search results are saved to `sessionStorage` and retrieved on the results page. If the session expires, the tab is closed, or a user bookmarks/shares the results URL, the page falls back to showing fake "Test Person" data with no flags found. There is no database persistence of search results.

### BUG 3: Spacebar not working in full name field (LOW - fix planned)
The `sanitizeInput` function in `SearchFormHonest.tsx` was recently fixed to remove `.trim()` from the keystroke handler, but the old `SearchForm.tsx` (line 140) still has `.trim()` in its sanitize function. Since the app uses `SearchFormHonest.tsx` (mapped as `SearchForm` in App.tsx), the fix applies to the active form.

### BUG 4: Payment prices mismatch (LOW SEVERITY)
- `PaymentModal.tsx` shows prices: R99 / R249 / R399
- `submit-payment` edge function uses: R50 / R120 / R180
- The amounts stored in the database don't match what users see on the landing page

### BUG 5: No payment verification flow (MEDIUM SEVERITY)
All 17 payments are stuck in "pending" status. The admin verify-payments page exists, but the RLS policy on `manual_payments` only allows updates when `status = 'verified'` -- meaning the admin cannot update a pending payment to verified because the policy blocks it. This is a **deadlock**: you can only update verified records, but you can't verify pending ones.

### BUG 6: Credit deduction uses client-side Supabase (MEDIUM SEVERITY)
The search form deducts credits directly from the client using the anon key. The RLS policy on `manual_payments` only allows updates where `status = 'verified'`. This means credit deduction will FAIL for pending payments. Since all payments are pending, no searches can actually deduct credits successfully.

---

## 6. What IS Working

1. **Landing page** -- Full Plinq-style landing page with sections: Hero, Ticker, Trust Bar, Photo Grid, Reality, Barrier, Search Options, How It Works, Risk Levels, Pricing, Community, Why RedFlaq, FAQ, Final CTA, Footer
2. **Payment modal** -- Opens from landing page, shows bank details (FNB), collects email, creates payment record via edge function
3. **Search form** -- Validates payment_id, shows credit balance, collects name/DOB/province/case reference, calls `multi-parameter-search`
4. **Search engine** -- 4-tier search strategy (case number, ID number, name+filters, fuzzy name) working correctly against the database
5. **Results page** -- Displays results with identity confidence meter, multiple match selector, "What This Means" explainers, dispute button, PDF download
6. **Admin login** -- Password-based admin authentication via edge function
7. **Admin payment list** -- Shows all payments with filter options
8. **Static pages** -- About, Privacy, Terms, Dispute info pages all render correctly
9. **Data import pipeline** -- `import-opensanctions` function fetches and imports CSV data from OpenSanctions

---

## 7. What is NOT Working

1. **91% of records are unsearchable** -- Country field mismatch means searches miss most records
2. **No payments can be verified** -- RLS policy deadlock prevents admin from approving payments
3. **No credits can be deducted** -- Because payments are all "pending" and RLS blocks updates
4. **Results page breaks on revisit** -- No persistent storage of search results
5. **No user authentication** -- No signup/login system; everything is based on payment_id URLs
6. **No email notifications** -- No emails sent to users after payment or with search links
7. **No automated payment verification** -- Manual bank transfer requires human admin verification
8. **Admin pages have no auth guard** -- Anyone can access `/admin/*` routes directly (only localStorage check)

---

## 8. Security Concerns

1. **All RLS policies use `true`** -- Most tables allow anyone to read/write/update without authentication
2. **Admin auth is localStorage only** -- No server-side session; easily bypassed
3. **Service role key used in edge functions** -- Correct, but client-side credit deduction bypasses proper authorization
4. **No rate limiting** on search or payment endpoints
5. **Honeypot-only bot protection** -- No CAPTCHA or other measures

---

## 9. Unused / Legacy Code

- `SearchForm.tsx` (old multi-type search form) -- not used, replaced by `SearchFormHonest.tsx`
- `Results.tsx` (old results page) -- not used, replaced by `ResultsPageUpdated.tsx`
- `search-criminal-records` edge function -- not called by the active search form
- `purchases` table -- old PayPal system, not used
- `import-wanted-persons` edge function -- old CSV import, replaced by OpenSanctions
- `scrape-saps-wanted` / `scrape-saps-details` -- legacy scrapers
- Multiple landing page component variants (HeroHonest, HeroNew, NavbarHonest, etc.) -- only Plinq variants are used

---

## 10. Recommended Priority Fixes

1. **Fix the database**: Run `UPDATE wanted_persons SET country = 'South Africa'` to make all records searchable
2. **Fix RLS on manual_payments**: Allow admin updates on pending records (or move verification to an edge function using service role key)
3. **Move credit deduction server-side**: Handle in the search edge function, not client-side
4. **Persist search results**: Save results to the database so result URLs are shareable/bookmarkable
5. **Add proper admin authentication**: Server-side session or JWT-based admin access


# RedFlaq Application - Complete Audit

## 1. Application Overview

RedFlaq is a South Africa-focused background check platform that searches public criminal records (SAPS wanted persons, FIC sanctions) for personal safety decisions. Users pay via manual EFT, then get a search link to verify a person's name against public databases.

---

## 2. Pages and Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Landing page (Plinq design) | Working |
| `/search-form` | Search form (Honest version) | Working (requires valid payment_id) |
| `/results` | Results page (Updated version) | Partially working (sessionStorage only) |
| `/receipt` | Payment receipt | Built, untested |
| `/about` | About RedFlaq | Working |
| `/privacy` | Privacy Policy | Working |
| `/terms` | Terms of Service | Working |
| `/dispute` | Dispute a Record (info page) | Working |
| `/admin/login` | Admin login | Working |
| `/admin/import` | Admin data import | Working |
| `/admin/scraper` | Admin SAPS scraper | Built |
| `/admin/verify-payments` | Admin payment verification | ✅ FIXED - uses edge function |
| `/admin/merge-review` | Admin merge review | Built |

---

## 3. Backend Functions (Edge Functions)

| Function | Purpose | Status |
|----------|---------|--------|
| `submit-payment` | Creates a pending manual payment record | ✅ FIXED - prices aligned (R99/R249/R399) |
| `verify-admin` | Validates admin password | Working |
| `admin-verify-payment` | ✅ NEW - Server-side payment verification/rejection | Working |
| `multi-parameter-search` | Tiered search with server-side credit deduction | ✅ FIXED - credit deduction moved server-side |
| `import-opensanctions` | Imports za_wanted + za_fic_sanctions datasets | Working |
| `search-criminal-records` | Old multi-type search | Legacy, not used |
| `import-wanted-persons` | Old CSV-based import | Legacy |
| `scrape-saps-wanted` / `scrape-saps-details` | SAPS scrapers | Legacy |

---

## 4. Bugs Fixed (This Session)

### ✅ BUG 1: Database country data - FIXED
All 1,173 records updated to `country = 'South Africa'`. All records now searchable.

### ✅ BUG 4: Payment prices mismatch - FIXED
`submit-payment` edge function now uses R99/R249/R399 matching the frontend.

### ✅ BUG 5: No payment verification flow - FIXED
Created `admin-verify-payment` edge function using service role key. Bypasses RLS deadlock. Admin page updated to use it.

### ✅ BUG 6: Credit deduction client-side - FIXED
Credit deduction moved to `multi-parameter-search` edge function (server-side with service role key). Search form no longer touches `manual_payments` directly.

---

## 5. Remaining Issues

### BUG 2: Search results stored in sessionStorage only (MEDIUM)
Results page still relies on sessionStorage. No persistent storage of search results.

### BUG 3: Spacebar in old SearchForm.tsx (LOW)
Only affects unused legacy file.

### Security: RLS policies still use `true` for most tables
### Security: Admin auth is localStorage only
### No email notifications
### No user authentication system
### Legacy code cleanup needed

---

## 6. Recommended Next Steps

1. **Persist search results** to database for shareable/bookmarkable URLs
2. **Add proper admin authentication** (server-side session)
3. **Tighten RLS policies** across all tables
4. **Add email notifications** after payment verification
5. **Clean up legacy code** (unused components, edge functions, tables)

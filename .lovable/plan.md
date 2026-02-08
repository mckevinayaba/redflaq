
# Fix Non-Working Search Features - Implementation Plan

## Problem Analysis

After thorough investigation, I found the root causes of why protection order and court case searches return "green" (no match):

### Issue 1: Firecrawl Timeout (408 Error)
The SAPS website is blocking even Firecrawl requests, causing the scraper to fail when fetching individual detail pages. The edge function logs show:
- "Firecrawl error for https://www.saps.gov.za/crimestop/wanted/list.php: 408"

### Issue 2: Data Structure Mismatch
Looking at your screenshot, the SAPS website shows "CONTRAVENTION OF PROTECTION ORDER" as a **crime/charge type**, NOT as a separate protection order number field. The database is searching for:
- `protection_order_number` - expects "PO-2025-001"
- `court_case_number` - expects "CC-2025-001"

But these specific numbers don't exist in SAPS data - only the charge descriptions like "FAILED TO COMPLY WITH A COURT ORDER".

### Current Database State
| Field | Records with Data |
|-------|------------------|
| charges | 69 (100%) |
| case_number | 1 (1.4%) |
| police_station | 1 (1.4%) |
| protection_order_number | 0 (0%) |
| court_case_number | 0 (0%) |

---

## Proposed Solution

### Option A: Change Search to Match Charges (Recommended)

Transform the "Protection Order" and "Court Case" search types to search the `charges` field for relevant keywords instead of non-existent number fields.

**How it works:**
- Protection Order search → searches for "PROTECTION ORDER" in charges
- Court Case search → searches for "COURT" in charges

This will immediately return matches for entries like:
- "CONTRAVENTION OF PROTECTION ORDER" (matches protection order search)
- "FAILED TO COMPLY WITH A COURT ORDER" (matches court case search)

**Benefits:**
- Works immediately with existing data
- No manual data entry required
- Matches what SAPS actually provides

---

### Option B: Add All Data Entry Fields + Keep Current Logic

If you need to search by actual order NUMBERS (from court documents, not SAPS):
1. Expand manual entry form to include protection_order_number, court_case_number
2. Expand CSV import to support all fields
3. Manually enter data from court documents

**Benefits:**
- Precise number-based search
- Supports external data sources

**Drawbacks:**
- Requires manual data entry
- SAPS data won't populate these fields

---

## Implementation Details (Option A)

### Phase 1: Update Search Edge Function

Modify `supabase/functions/search-criminal-records/index.ts` to search the `charges` field:

```text
Protection Order Search:
- Instead of: .ilike('protection_order_number', '%value%')
- Change to:  .ilike('charges', '%protection%')

Court Case Search:
- Instead of: .ilike('court_case_number', '%value%')
- Change to:  .ilike('charges', '%court%')
```

### Phase 2: Update Search Form UI

Change the search form to accept descriptive keywords instead of case number format:
- Protection Order: "Enter keyword (e.g., 'protection order')"
- Court Case: "Enter keyword (e.g., 'court order', 'failed to comply')"

### Phase 3: Fix Scraper Timeout Issue

Modify scraper to handle Firecrawl failures gracefully:
1. Increase timeout from 2000ms to 10000ms
2. Add retry logic (3 attempts with exponential backoff)
3. Return partial results if list page succeeds but detail pages fail

---

## Files to Modify

| File | Changes |
|------|---------|
| supabase/functions/search-criminal-records/index.ts | Change protection_order and court_case search to query charges field |
| src/pages/SearchForm.tsx | Update validation and placeholder text for new search behavior |
| supabase/functions/scrape-saps-wanted/index.ts | Add retry logic and increase timeout to prevent 408 errors |

---

## Expected Outcome

After implementation:
- Protection Order search for "protection" will return "DAMIAN CLOETE - CONTRAVENTION OF PROTECTION ORDER"
- Court Case search for "court" will return "PATRICK MAHLAULE - FAILED TO COMPLY WITH A COURT ORDER"
- Scraper will be more resilient to SAPS blocking

---

## Alternative: Hybrid Approach

Combine both options:
1. Search charges field for matches (immediate results)
2. Also search specific number fields if they exist (future-proofing)
3. Add manual entry for specific case numbers when available from court documents

This gives the best of both worlds - immediate functionality with existing SAPS data, plus support for precise number searches when that data is manually entered.

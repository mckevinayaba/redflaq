

# Fix SAPS Scraper to Extract Court Case Numbers

## Problem Summary

You are correct - the SAPS detail pages DO contain case numbers, police stations, and court information. The screenshot shows:
- **Case Number**: 405/9/2021 2025/W/9734
- **Station**: Kleinvlei (Western Cape)
- **Crime Circumstances**: Court warrant info

The database already proves the scraper CAN work - one record (MCKEVIN AYABA DORMITHIENE) has both `case_number` and `police_station` populated. But 68 of 69 records are missing this data because:

1. **Firecrawl gets 408 timeout errors** from SAPS anti-bot protection
2. **Edge function times out** (60-second limit) when trying to fetch 69+ detail pages

---

## Solution: Incremental Batch Scraping

Split the scraper into smaller, resumable batches that work within edge function limits.

### Phase 1: Create a Batch Detail Scraper

Create a new edge function `scrape-saps-details` that:
- Fetches only 5 detail pages per invocation (stays under timeout)
- Tracks progress in database (which records need detail scraping)
- Uses exponential backoff for Firecrawl retries
- Can be run multiple times to complete all records

### Phase 2: Add "Needs Detail Scrape" Flag

Add a `needs_detail_scrape` column to track which records haven't had their detail pages fetched yet.

### Phase 3: Improve Regex Parsing

Update the `parseDetailPage` function to better match SAPS HTML structure based on the actual page format you showed:

```text
Current HTML structure on SAPS:
<td>Case Number:</td><td>405/9/2021 2025/W/9734</td>
<td>Station:</td><td>Kleinvlei (Western Cape)</td>
```

### Phase 4: Add Admin UI for Progress Tracking

Show how many records still need detail scraping and allow running batch updates.

---

## Implementation Details

### New Edge Function: scrape-saps-details

```text
supabase/functions/scrape-saps-details/index.ts

Purpose: Fetch detail pages for records that are missing case_number
- Query: SELECT records WHERE case_number IS NULL AND detail_page_url IS NOT NULL LIMIT 5
- Fetch each detail page via Firecrawl with 10-second waitFor
- Parse and update database
- Return count of updated records
```

### Updated Scraper Settings

| Setting | Current | New |
|---------|---------|-----|
| Batch size | 10 | 3 |
| Firecrawl waitFor | 2000ms | 10000ms |
| Retry attempts | 0 | 3 |
| Delay between batches | 1000ms | 3000ms |

### Admin UI Updates

Add to AdminScraper.tsx:
- Button: "Fetch Missing Details" - runs batch detail scraper
- Progress: "X of Y records have complete details"
- Status: Show Firecrawl success/failure rate

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| supabase/functions/scrape-saps-details/index.ts | CREATE | New incremental detail page scraper |
| supabase/functions/scrape-saps-wanted/index.ts | MODIFY | Increase Firecrawl timeout, add retries, reduce batch size |
| src/pages/AdminScraper.tsx | MODIFY | Add "Fetch Missing Details" button and progress indicator |

---

## Expected Outcome

After implementation:
1. Run main scraper to get list of all wanted persons (names, charges, photos)
2. Run detail scraper multiple times (5 records per run) until all records have case numbers
3. Court Case search for "405/9/2021" will find "Sherphered Chitukutuku"
4. Police Station search will work across all records

---

## Alternative: Manual Test First

Before implementing the full solution, we could test if the current scraper works with better Firecrawl settings by:
1. Updating waitFor to 10000ms
2. Adding retry logic with 3 attempts
3. Running on just 5 records to verify

This would confirm Firecrawl can bypass SAPS blocking before building the full batch system.


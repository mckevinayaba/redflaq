
# SAFLII Criminal Judgment Integration for RedFlaq

## Overview

Add SAFLII (saflii.org) as a new data source for RedFlaq, enabling searches against South Africa's free, open-access court judgment database covering all 9 provincial High Courts back to 2003.

## Architecture

The integration has 3 parts:
1. **Database table** to store indexed SAFLII criminal judgments
2. **Background indexer edge function** that crawls SAFLII court listing pages nightly
3. **Search integration** into the existing multi-parameter-search function

## Part 1 -- Database Table

Create a new `saflii_judgments` table with:

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid (PK) | Primary key |
| accused_name | text | Full name from case title |
| accused_surname | text | Extracted surname for matching |
| accused_first_name | text | Extracted first name |
| name_normalized | text | Lowercase, stripped for fuzzy match |
| charge_keywords | text[] | Extracted crime keywords (rape, assault, etc.) |
| court_code | text | e.g. ZAGPJHC |
| court_name | text | e.g. South Gauteng High Court |
| province | text | Mapped province |
| year | integer | Judgment year |
| case_number | text | e.g. SS 063/2016 |
| case_title | text | Full case title line |
| saflii_url | text | Direct link to judgment |
| is_criminal | boolean | Confirmed criminal matter |
| created_at | timestamptz | Indexing timestamp |

Indexes on `name_normalized`, `accused_surname`, `province`, and `year`. RLS policy: public SELECT only (same as `wanted_persons`).

## Part 2 -- Background Indexer Edge Function

New edge function: `supabase/functions/index-saflii/index.ts`

**How it works:**
1. Iterates through all 9 SA High Court codes and recent years (2020-2026 initially, expandable)
2. For each court/year, fetches the listing page at `https://www.saflii.org/za/cases/{COURT_CODE}/{YEAR}/`
3. Parses HTML to extract case title links
4. Filters for criminal matters using patterns: `S v `, `v S `, `v The State`, plus crime keywords
5. Extracts accused name from the case title (e.g. "S v Dlamini" yields "Dlamini")
6. Upserts into `saflii_judgments` table (deduplicated by `saflii_url`)
7. Respects SAFLII's 10-second crawl delay between requests
8. Processes in batches to stay within edge function timeout limits

**Court codes covered:**
- ZAGPJHC (South Gauteng / Johannesburg)
- ZAGPPHC (North Gauteng / Pretoria)
- ZAWCHC (Western Cape)
- ZAKZDHC (KZN Durban)
- ZAKZPHC (KZN Pietermaritzburg)
- ZAECGHC (Eastern Cape Grahamstown)
- ZAECMHC (Eastern Cape Mthatha)
- ZAFSHC (Free State)
- ZANCHC (Northern Cape)
- ZALMPHC (Limpopo)
- ZANWHC (North West)
- ZAMPHC (Mpumalanga)
- ZASCA (Supreme Court of Appeal)
- ZACC (Constitutional Court)

**Scheduling:** Set up as a nightly cron job. Each run processes one court/year combination to stay within timeout limits, cycling through all courts over multiple nights.

## Part 3 -- Search Integration

Modify `supabase/functions/multi-parameter-search/index.ts` to add a **Strategy 5: SAFLII Court Judgments** that runs alongside existing strategies:

- When a user searches by name, query `saflii_judgments` for normalized name matches and surname fuzzy matches
- When province is provided, filter by province
- SAFLII matches get a confidence score of 70 (court judgment = strong signal but name-only matching)
- Results are returned with `match_type: 'saflii_judgment'` and `source: 'SAFLII'`
- Include the `saflii_url` so the results page can show a "View judgment on SAFLII" button

## Part 4 -- Results Display Update

Update `ResultsPageUpdated.tsx` to handle SAFLII-sourced matches:
- Show "Court Judgment Found" label with a gavel icon
- Display: court name, province, year, charge keywords
- "View judgment on SAFLII" button linking directly to the source page
- Do NOT reproduce judgment text (link out only)

## Part 5 -- Landing Page Update

Update the "What We Search" section (`WhatWeSearchHonest.tsx`) to include SAFLII as a confirmed data source with its link.

## Technical Details

### Name extraction from case titles

```text
"S v Dlamini" -> accused: "Dlamini"
"S v Nkosi and Another" -> accused: "Nkosi"
"Dube and Others v S (SS 063/2016)" -> accused: "Dube"
"S v Mthembu (CC 12/2024)" -> accused: "Mthembu"
```

The parser handles `S v [Name]` and `[Name] v S` patterns, strips case numbers in parentheses, and handles "and Another/Others" suffixes.

### Court-to-province mapping

```text
ZAGPJHC / ZAGPPHC -> Gauteng
ZAWCHC -> Western Cape
ZAKZDHC / ZAKZPHC -> KwaZulu-Natal
ZAECGHC / ZAECMHC -> Eastern Cape
ZAFSHC -> Free State
ZANCHC -> Northern Cape
ZALMPHC -> Limpopo
ZANWHC -> North West
ZAMPHC -> Mpumalanga
```

### Crawl delay compliance

The indexer uses a 10-second `setTimeout` between each HTTP request to SAFLII, and processes only one court/year per invocation. This means the full index builds incrementally over days rather than in a single burst.

### Files to create
- `supabase/functions/index-saflii/index.ts` -- the background indexer
- Database migration for `saflii_judgments` table

### Files to modify
- `supabase/functions/multi-parameter-search/index.ts` -- add Strategy 5 (SAFLII search)
- `src/pages/ResultsPageUpdated.tsx` -- display SAFLII matches with "View on SAFLII" link
- `src/components/landing/WhatWeSearchHonest.tsx` -- add SAFLII as a listed data source
- `supabase/config.toml` -- register the new edge function

## Important Limitations (displayed to users)

- Only High Court and above (magistrate court convictions are not on SAFLII)
- Not every conviction produces a written judgment
- Name-only matching means some false positives are possible
- Courts may anonymise parties in certain cases

These limitations will be noted in the results UI when a SAFLII match is shown.

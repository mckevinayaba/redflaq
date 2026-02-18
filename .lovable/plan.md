

# Add sapswanted.netlify.app as Enrichment Source

## What We Found

- The site has **no JSON/CSV API** -- it's a Vue.js single-page app rendering HTML cards
- Each card contains: **full name**, **crime type** (e.g. "Rape", "Fraud", "Armed Robbery"), **status** (Wanted/Suspect), **SAPS photo URL**, and **SAPS detail page URL**
- About 9 persons are currently listed -- this is a small, curated subset of SAPS data
- Your database already has **450 za_wanted** + **723 za_fic_sanctions** records from OpenSanctions

## What This Source Adds

The sapswanted.netlify.app data gives you:
- **Cleaner crime wording** -- e.g. "Rape", "Attempted Murder", "Fraud" vs OpenSanctions' raw sanctions text
- **Wanted vs Suspect status** -- a distinction OpenSanctions doesn't make
- **Direct SAPS photo thumbnail URLs** -- `thumbnail.php?id=XXXXX`
- **Direct SAPS detail page URLs** -- `detail.php?bid=XXXXX` (clickable "View on official source" links)

It will NOT replace OpenSanctions -- it only enriches existing records or adds new ones that SAPS has but OpenSanctions hasn't picked up yet.

## Implementation Plan

### Step 1: Create `import-sapswanted` Edge Function

A new edge function that:
1. Uses Firecrawl (already connected) to fetch `https://sapswanted.netlify.app` HTML
2. Parses the structured card elements to extract per-person: name, crime, status, photo URL, SAPS detail URL
3. For each person, normalizes the name and checks for an existing record in `wanted_persons`
4. **If match found**: enriches the existing record with SAPS-specific fields (photo_url, detail_page_url, better crime wording in `charges`, status)
5. **If no match**: inserts a new record with `source_dataset = 'sapswanted_netlify'`
6. Never deletes or overwrites OpenSanctions data -- merge only

### Step 2: Deduplication Logic

Match strategy (same pattern as existing scrapers):
- Normalize name (`lowercase + strip spaces/special chars`)
- Compare against `name_normalized` in existing records
- If match: update only NULL or less-detailed fields (e.g. add photo_url if missing, add detail_page_url, append crime to `alleged_offenses`)
- If no match: insert new record

### Step 3: Admin Trigger

Add a "Import from SAPS Wanted" button on the existing Admin Scraper page (`/admin/scraper`) that calls this function. No automated cron needed given the small dataset size -- manual trigger is sufficient.

### Step 4: Wire Up Config

Add the new function to `supabase/config.toml` with `verify_jwt = false` (same as other import functions).

## Technical Details

### Files to Create
- `supabase/functions/import-sapswanted/index.ts` -- the edge function

### Files to Modify
- `supabase/config.toml` -- add function config entry
- `src/pages/AdminScraper.tsx` -- add import button for this source

### Edge Function Pseudocode

```text
1. Fetch HTML via Firecrawl (formats: ['html'])
2. Parse cards using regex on the structured HTML:
   - Name from: <span class="span-description">{name}</span> after "Name:"
   - Crime from: <span class="span-description">({crime})</span> after "Crime:"
   - Status from: <span class="span-description">{status}</span> after "Status:"
   - Photo from: <img src="{photo_url}">
   - Detail URL from: <a href="{saps_url}">More Details</a>
3. Skip entries with name = "Unknown Unknown"
4. For each person:
   a. Normalize name
   b. Query wanted_persons WHERE name_normalized = normalized
   c. If exists: UPDATE with enrichment fields (photo, detail URL, crime)
   d. If not: INSERT with source_dataset = 'sapswanted_netlify'
5. Return stats: { enriched, inserted, skipped, errors }
```

### Data Mapping

| sapswanted field | wanted_persons column | Behavior |
|-----------------|----------------------|----------|
| Name | full_name, first_name, surname, name_normalized | Only on new inserts |
| Crime | charges, alleged_offenses, offense_categories | Enrich/append |
| Status | legal_status ('wanted' or 'suspect') | Enrich if different |
| Photo URL | photo_url, photo_source = 'saps' | Enrich if NULL |
| Detail URL | detail_page_url, source_url | Enrich if NULL |


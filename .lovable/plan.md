

# Fix Broken Source Links in Search Results

## Problem
The `za_wanted` records (450 entries) store OpenSanctions entity URLs as their source links (e.g., `opensanctions.org/entities/za-wanted-20646/`). Many of these return 404 — OpenSanctions removes/rotates entity pages. Users clicking "View Official Source" see a broken page.

## Root Cause
The `import-opensanctions` function generates source URLs pointing to OpenSanctions entity pages. But the **actual** authoritative source is the SAPS detail page. OpenSanctions even links back to it: `https://www.saps.gov.za/crimestop/wanted/detail.php?bid=XXXXX` where the bid number is embedded in the entity ID (`za-wanted-XXXXX`).

## Data Audit by Dataset
| Dataset | Count | Current source_url | Status |
|---------|-------|--------------------|--------|
| `sapswanted_manual` | 40 | SAPS detail pages | Working |
| `sapswanted_netlify` | 7 | SAPS detail pages | Working |
| `za_wanted` | 450 | OpenSanctions entity URLs | **Many broken (404)** |
| `za_fic_sanctions` | 723 | OpenSanctions entity URLs | Working (stable IDs) |

## Fix Plan

### 1. Database migration — fix existing `za_wanted` records
Update all 450 `za_wanted` records to use SAPS detail URLs derived from the entity ID:
- Extract the bid number from source_url: `za-wanted-XXXXX` → `XXXXX`
- Set `detail_page_url` = `https://www.saps.gov.za/crimestop/wanted/detail.php?bid=XXXXX`
- Set `source_url` = same SAPS URL
- Update `source_urls` array accordingly

### 2. Update `import-opensanctions/index.ts` — fix future imports
For the `za_wanted` dataset, generate SAPS detail URLs instead of OpenSanctions URLs:
- Extract bid from entity ID (`za-wanted-XXXXX` → `XXXXX`)
- Store `detail_page_url` and `source_url` as SAPS detail page
- Keep OpenSanctions URL as a secondary reference in `source_urls`

### 3. Update `getOfficialSourceUrl` in `ResultsPageUpdated.tsx`
Add a safety fallback: if the source URL contains `opensanctions.org` and the dataset is `za_wanted`, derive the SAPS URL from the entity ID as a last resort. This protects against any records missed by the migration.

### 4. Update `getSourceLabel` for `za_fic_sanctions`
For FIC sanctions records, the OpenSanctions links work but the label should clarify the source. No URL changes needed for this dataset.

### Files to modify
- `supabase/functions/import-opensanctions/index.ts` — fix URL generation for future imports
- `src/pages/ResultsPageUpdated.tsx` — add fallback URL derivation
- New SQL migration — bulk-fix 450 existing `za_wanted` records


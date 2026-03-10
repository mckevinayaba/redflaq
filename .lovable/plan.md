

## Problem

The `getOfficialSourceUrl` function in `ResultsPageUpdated.tsx` (lines 101-121) converts OpenSanctions entity URLs (e.g., containing `za-wanted-20646`) into SAPS `detail.php?bid=20646` URLs. But these IDs don't match — the SAPS page comes up empty. This affects **both** live API results and bulk-imported records.

Additionally, the `import-opensanctions` bulk import function (line 117-121) saves broken SAPS URLs into the database during import.

## Fix

### 1. `src/pages/ResultsPageUpdated.tsx` — Remove broken SAPS URL conversion

Replace the `getOfficialSourceUrl` function to stop converting `za-wanted-XXXXX` IDs into SAPS `detail.php?bid=` URLs. Instead:
- If `detail_page_url` exists, use it (unchanged)
- If `source_url` contains `za-wanted-`, convert it to the OpenSanctions entity page (`https://www.opensanctions.org/entities/za-wanted-XXXXX/`) which has the full record with photos and verified details
- Same for `source_urls` array entries
- For `za_wanted` records with no usable URL, fall back to the SAPS **list** page (unchanged)

### 2. `supabase/functions/import-opensanctions/index.ts` — Fix bulk import URLs

Update lines 117-121 to save OpenSanctions entity URLs instead of broken SAPS `detail.php?bid=` URLs during bulk import. This fixes the root cause for locally stored records.

### 3. Database cleanup (optional, recommended)

Run a migration to update existing `wanted_persons` rows that have broken `saps.gov.za/crimestop/wanted/detail.php?bid=` URLs, converting them to their correct OpenSanctions entity page URLs.


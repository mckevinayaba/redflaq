

## Plan: Fix SAPS Detail Links (They Actually Work)

### Root Cause

The SAPS `detail.php?bid=` URLs **work correctly**. Image-81 proves it: `bid=20646` shows Mabila Nkosinathi with full crime details, station, case number, etc.

The OpenSanctions entity ID `za-wanted-20646` contains the **actual SAPS bid** (`20646`). We broke this in previous fixes by:

1. **`ResultsPageUpdated.tsx`** — The `isBrokenUrl` function blocks ALL `detail.php?bid=` URLs, forcing the fallback to the generic list page (image-80)
2. **`multi-parameter-search/index.ts`** — Strategy 7 no longer constructs the SAPS detail URL from the entity ID
3. **`import-opensanctions/index.ts`** — The bulk import saves the list page URL instead of constructing `detail.php?bid=` URLs

### Fix (3 files)

**1. `src/pages/ResultsPageUpdated.tsx`** — Remove the broken URL filter
- Delete the `isBrokenUrl` helper that blocks `detail.php?bid=` URLs
- Allow `detail_page_url` and `source_url` containing `detail.php?bid=` to pass through normally
- Keep filtering only `opensanctions.org/entities/za-wanted-` (those 404)

**2. `supabase/functions/multi-parameter-search/index.ts`** — Restore SAPS detail URL construction in Strategy 7
- For `za_wanted` results, extract the bid from entity ID (`za-wanted-XXXXX` → `XXXXX`)
- Set `sourceUrl` to `https://www.saps.gov.za/crimestop/wanted/detail.php?bid=XXXXX`

**3. `supabase/functions/import-opensanctions/index.ts`** — Fix bulk import URLs
- Construct `detail.php?bid=` URLs from the entity ID during import
- Store the correct detail URL in `source_url` and `detail_page_url`

**4. Database cleanup** — Update existing `wanted_persons` records from `source_dataset = 'za_wanted'` that have the list page as their `source_url`, reconstructing the detail URL where possible from any stored entity ID or name match.

### Result
Clicking "View on official source" for a SAPS result will open the person's actual SAPS detail page (like image-81) with photo, crime, station, case number — not the generic list.


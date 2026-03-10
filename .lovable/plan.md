

## Problem

The SAPS detail URL (`detail.php?bid=20646`) is constructed by extracting the number from the OpenSanctions entity ID (`za-wanted-20646`). But this number is OpenSanctions' internal ID — it does NOT correspond to the SAPS website's `bid` parameter. So the link opens a blank/empty SAPS page.

## Fix

**`supabase/functions/multi-parameter-search/index.ts`** — Remove the broken SAPS URL construction and use the OpenSanctions entity page as the source link instead. The OpenSanctions page (`opensanctions.org/entities/za-wanted-20646/`) actually contains the record details, photos, and links back to the original SAPS listing.

Specifically:
- Remove lines 703-707 (the `bidMatch` logic that builds the fake SAPS URL)
- For `za_wanted` results, set `sourceUrl` to the OpenSanctions entity page: `https://www.opensanctions.org/entities/${entity.id}/`
- Keep `source_dataset: 'za_wanted'` so the UI still shows "Official SAPS Database · TRUST: HIGH" branding
- Change the link label in `ResultsPageUpdated.tsx` from "View on official source" to "View record details" for `za_wanted` results sourced via API, so users aren't confused about landing on OpenSanctions instead of SAPS directly

This is the correct approach because OpenSanctions already verifies and links back to the original SAPS source on their entity pages.


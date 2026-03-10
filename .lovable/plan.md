

## Plan: Attribute OpenSanctions Live API Results to Their Original Source

### The Problem
The OpenSanctions API response includes a `datasets` field telling us exactly which source each record came from (e.g., `za_wanted`, `za_fic_sanctions`). Currently, Strategy 7 labels every API result as `source_dataset: 'opensanctions_live'`, so the results page shows "OpenSanctions — Verified API" instead of the actual originating source like "SAPS Wanted Persons."

### The Fix

**`supabase/functions/multi-parameter-search/index.ts`** — Update Strategy 7 (lines ~700-736):

- After extracting `datasets` from the API response, check if it contains a known South African source:
  - If `datasets` includes `za_wanted` → set `source_dataset: 'za_wanted'` (shows as "SAPS Wanted Persons")
  - If `datasets` includes `za_fic_sanctions` → set `source_dataset: 'za_fic_sanctions'` (shows as "FIC Sanctions")
  - Otherwise → keep `source_dataset: 'opensanctions_live'` (for PEPs, international sanctions, etc.)
- For `za_wanted` results, extract the entity ID to build the SAPS detail URL (`https://www.saps.gov.za/crimestop/wanted/detail.php?bid=XXXXX`) instead of linking to opensanctions.org
- Add `match_type: 'opensanctions_api'` to all results so we can still track they came via the live API (useful for analytics)

### What Changes for Users
- A `za_wanted` record found via live API will display identically to one from the local database: "🚔 Official SAPS Database · TRUST: HIGH" with a direct SAPS link
- International/PEP results that don't map to a known SA source will still show as "🌐 OpenSanctions — Verified API"
- No changes needed to `ResultsPageUpdated.tsx` — the existing `getSourceLabel` and `getSourceTrustBadge` functions already handle `za_wanted` and `za_fic_sanctions` correctly


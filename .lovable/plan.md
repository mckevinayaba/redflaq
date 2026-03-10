

## Plan: Integrate OpenSanctions Live Search API

### What This Does
Add a new "Strategy 7" to the `multi-parameter-search` edge function that queries the OpenSanctions `/match` API in real-time when a user runs a check. This runs alongside your existing local database searches, giving users the freshest possible data from 80+ datasets.

### How It Works

```text
User runs a check
    ├── Strategy 1-6: Search local DB (wanted_persons, saflii, gazette) ← existing
    └── Strategy 7 (NEW): Query OpenSanctions /match API live
         ├── Send name + birth date + nationality to API
         ├── Get back fuzzy-matched entities with scores
         ├── Filter for SA-relevant results (score > 0.5)
         ├── Merge into results, deduplicate against local matches
         └── Include source URLs and dataset info
```

### Technical Changes

**1. Store the API key as a secret**
- Use the secrets tool to save `OPENSANCTIONS_API_KEY` with the key from your screenshot.

**2. Update `multi-parameter-search/index.ts`**
- Add a new async function `queryOpenSanctionsLive(name, birthDate?)` that:
  - Calls `POST https://api.opensanctions.org/match/default` with `Authorization: ApiKey {key}`
  - Sends a query-by-example payload: `{ schema: "Person", properties: { name: [...], birthDate: [...], country: ["za"] } }`
  - Filters results by score threshold (>0.5) to avoid noise
  - Maps results to the same format as local matches with `source_dataset: 'opensanctions_live'` and `match_type: 'opensanctions_api'`
- Add "Strategy 7" block after the gazette search (Strategy 6) that calls this function when `full_name` is provided
- Deduplicate against existing local matches (by normalized name) to avoid showing the same person twice
- Confidence mapping: OpenSanctions score 0.9+ → 85 confidence, 0.7-0.9 → 65, 0.5-0.7 → 45

**3. Update results page (minor)**
- The `ResultsPageUpdated.tsx` already handles different `source_dataset` values — `opensanctions_live` results will display with appropriate source attribution
- Add "OpenSanctions API" as a recognized source label alongside existing SAPS/SAFLII/Gazette labels

**4. Update Data Sources page**
- Update the OpenSanctions entry on `/sources` to reflect it's now a live API integration (not just bulk import), and note the broader dataset coverage

### What We Keep
- The existing bulk CSV import (`import-opensanctions`) stays — it populates your local `wanted_persons` table for fast offline matching
- The live API acts as a supplementary layer catching anything the local database might miss

### API Usage
- With 25,000 req/month and one API call per user search, you can handle ~833 searches/day — more than enough for current scale
- Each search makes exactly 1 API call to the `/match` endpoint


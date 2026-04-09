

# Verification Audit: Why Records Show GREEN/YELLOW Instead of RED

## What's Wrong

I found **three critical bugs** causing the search engine to underreport risk:

### Bug 1: 96% of records have no actual charge data
- **1,220 total records** in the database
- **723 records** have completely **empty charges** ("")
- **450 records** have generic text **"Listed in za_wanted"**
- Only **47 records** (3.8%) have real charge data like "Murder", "Fraud", "Rape"
- The risk scoring engine scores based on charge text — so nearly all records score **0**, then get bumped to the minimum **10 (YELLOW)** instead of the correct RED

### Bug 2: Risk engine ignores "wanted" status entirely
- A person listed on the **SAPS Wanted List** is inherently high-risk
- But the scoring engine ONLY looks at charge keywords
- If charges say "Listed in za_wanted" or are empty, **no offense patterns match**, so the score stays at 10 (YELLOW)
- Someone who is actively **WANTED by SAPS** should be at minimum **ORANGE (25+)** or **RED (50+)**

### Bug 3: MCKEVIN AYABA DORMITHIENE specifically
- Record exists in database with `charges: "Listed in za_wanted"` — not "FRAUD" as originally imported
- The OpenSanctions import **overwrote** the original charge with a generic label
- Search for "Mckevin Ayaba" matches via fuzzy strategy (confidence: 25) → score: 10 → **YELLOW**
- Should be **RED** — this person is on the SAPS Wanted List

### "Kabelo Mokgadi" — Not in database
- This person has **zero records** in the `wanted_persons` table
- If they have a criminal record, it means their data hasn't been imported yet
- This is a **data gap**, not a scoring bug

---

## Fix Plan

### 1. Fix risk scoring engine — add "wanted status" baseline
In `multi-parameter-search/index.ts`, add scoring rules:
- If `legal_status = 'wanted'` → minimum score **50 (RED)**
- If `source_dataset = 'za_wanted'` → minimum score **50 (RED)**
- If `source_dataset = 'za_fic_sanctions'` → minimum score **50 (RED)**
- If `found_in_saps = true` → minimum score **40 (ORANGE)**
- If charges are empty or generic ("Listed in...") but person IS in wanted_persons → score **35 (ORANGE minimum)**

Also update the client-side `riskScoring.ts` to match.

### 2. Fix the charge data — backfill from original SAPS scrape
- Write a migration or edge function to update records where `charges` is empty or "Listed in za_wanted"
- Cross-reference with the original SAPS detail pages (stored in `source_urls`)
- For records that can't be backfilled, set charges to "Wanted by SAPS — specific charges not available" so the risk engine can at least flag them

### 3. Prevent future overwrites
- In the OpenSanctions import function, add a guard: if an existing record already has meaningful charges, don't overwrite with "Listed in za_wanted"

### 4. Add "Kabelo Mokgadi" manually (if you have the data)
- If you know this person's record details, I can add them to the database
- Otherwise, this requires importing from the correct data source

---

## Impact
- **Before fix**: ~96% of wanted persons show as YELLOW (score 10) instead of RED
- **After fix**: All SAPS wanted persons show as at minimum ORANGE (35+), most as RED (50+)
- Risk scoring becomes accurate regardless of whether specific charge text is available

## Files Changed
1. `supabase/functions/multi-parameter-search/index.ts` — risk scoring baseline rules
2. `src/utils/riskScoring.ts` — matching client-side logic
3. New database migration — backfill empty charges with descriptive text
4. `supabase/functions/import-opensanctions/index.ts` — prevent charge overwrites


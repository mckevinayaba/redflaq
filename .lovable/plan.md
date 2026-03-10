

## Plan: Remove only the "Active Legal Records" stat from StatsBar, keep the rest

The StatsBar has 4 stats. The screenshot shows "1220 Active Legal Records" which the user wants removed. The other 3 stats (`<60 sec Average Search Time`, `100% Public Sources`, `POPIA Compliant`) should remain.

**Changes:**

1. **`src/components/landing/StatsBar.tsx`**:
   - Remove the first stat `{ icon: Database, value: recordCount.toString(), label: "Active Legal Records" }` from the array
   - Remove the `useEffect` fetching `wanted_persons` count and the `recordCount` state (no longer needed)
   - Remove unused imports (`useEffect`, `useState`, `Database`, `supabase`)
   - Change grid from `grid-cols-2 md:grid-cols-4` to `grid-cols-3` so the 3 remaining stats display evenly

2. **`src/pages/Index.tsx`**: Re-add `<StatsBar />` back into the page (it was removed in the previous edit) after the TickerBar


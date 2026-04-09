

# Build Safety Habits Card + Saved Signals Bookmarking

## Summary
Two changes: (1) Add a Safety Habits card to the dashboard so users discover the existing `/dashboard/habit` page, and (2) build a Saved Signals feature with database tables, bookmark UI on signal cards, and a "Saved Signals" section on the dashboard.

## Database Migration

Create three tables: `signal_likes`, `signal_saves`, and update types:

```sql
-- Signal likes
CREATE TABLE public.signal_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(signal_id, user_id)
);
ALTER TABLE public.signal_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own likes" ON public.signal_likes
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Signal saves (bookmarks)
CREATE TABLE public.signal_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(signal_id, user_id)
);
ALTER TABLE public.signal_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saves" ON public.signal_saves
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## Dashboard Changes (`src/pages/Dashboard.tsx`)

Add two new cards to the Quick Actions grid (changing from 3-col to 4-col or adding a second row):

1. **Safety Habits** card — links to `/dashboard/habit`, shows a smiley/heart icon with "Build your daily safety ritual" subtitle
2. **Saved Signals** card — links to `/dashboard/saved-signals`, shows bookmark icon with count of saved signals

## New Page: Saved Signals (`src/pages/DashboardSavedSignals.tsx`)

- Fetches from `signal_saves` joined with `academy_articles` for the logged-in user
- Displays saved articles using `SignalCard` in a grid
- Empty state: "No saved signals yet. Browse Signals to save articles for later."
- Wrapped in `DashboardLayout`

## Route Addition (`src/App.tsx`)

Add `/dashboard/saved-signals` route pointing to the new page.

## Sidebar Update (`src/components/dashboard/DashboardSidebar.tsx`)

Add "Saved Signals" menu item with bookmark icon, positioned after "Signal Detection".

## SignalEngagement Already Works

The existing `SignalEngagement.tsx` already has like/save buttons. Once the tables exist, the `as any` casts will work against real tables. No changes needed there.

## Files Changed
1. New migration — `signal_likes` and `signal_saves` tables with RLS
2. `src/pages/Dashboard.tsx` — add Safety Habits + Saved Signals quick action cards
3. `src/pages/DashboardSavedSignals.tsx` — new page
4. `src/App.tsx` — add route
5. `src/components/dashboard/DashboardSidebar.tsx` — add Saved Signals menu item


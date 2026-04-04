-- ════════════════════════════════════════════════════════════════
-- SIGNALS BACKEND — ADDITIVE FIXES
--
-- What this migration adds:
--   1. Anon SELECT policy on signal_comments (moderated = true)
--      Current policy is authenticated-only; SignalModal fetches
--      comments for all users including signed-out visitors.
--   2. Count-sync triggers: signal_likes  → signals.like_count
--                           signal_comments → signals.comment_count
--      signal_id in engagement tables is TEXT (the article slug).
--      Join is on signals.slug = signal_likes.signal_id.
--   3. Missing index: signal_saves(signal_id)
--   4. reading_time column on signals table
--
-- What this migration does NOT do:
--   - Change signal_id from TEXT to UUID (kept as TEXT / slug-based)
--   - Drop or recreate any existing table
--   - Alter existing RLS policies on signal_likes or signal_saves
-- ════════════════════════════════════════════════════════════════


-- ────────────────────────────────────────────────────────────────
-- 1. Allow anon users to read moderated comments
--    Adds a second SELECT policy for the anon role alongside the
--    existing authenticated-only policy. Both remain active.
-- ────────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'signal_comments'
      AND policyname = 'Anon can read moderated comments'
  ) THEN
    CREATE POLICY "Anon can read moderated comments"
      ON signal_comments FOR SELECT TO anon
      USING (moderated = true);
  END IF;
END $$;


-- ────────────────────────────────────────────────────────────────
-- 2a. Count-sync: signals.like_count ← signal_likes
--     Fires after every INSERT or DELETE on signal_likes.
--     Recounts from the engagement table and writes to the
--     matching signals row (joined on slug = signal_id).
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sync_signal_like_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_slug TEXT;
BEGIN
  v_slug := COALESCE(NEW.signal_id, OLD.signal_id);

  UPDATE signals
     SET like_count = (
           SELECT COUNT(*)
             FROM signal_likes
            WHERE signal_id = v_slug
         )
   WHERE slug = v_slug;

  RETURN NULL; -- AFTER trigger; return value is ignored
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_signal_like_count ON signal_likes;
CREATE TRIGGER trg_sync_signal_like_count
  AFTER INSERT OR DELETE ON signal_likes
  FOR EACH ROW EXECUTE FUNCTION sync_signal_like_count();


-- ────────────────────────────────────────────────────────────────
-- 2b. Count-sync: signals.comment_count ← signal_comments
--     Only moderated = true rows are counted.
--     Fires on INSERT, DELETE, and UPDATE of the moderated column
--     so admin-approving a comment immediately increments the count.
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sync_signal_comment_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_slug TEXT;
BEGIN
  v_slug := COALESCE(NEW.signal_id, OLD.signal_id);

  UPDATE signals
     SET comment_count = (
           SELECT COUNT(*)
             FROM signal_comments
            WHERE signal_id = v_slug
              AND moderated = true
         )
   WHERE slug = v_slug;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_signal_comment_count ON signal_comments;
CREATE TRIGGER trg_sync_signal_comment_count
  AFTER INSERT OR DELETE OR UPDATE OF moderated ON signal_comments
  FOR EACH ROW EXECUTE FUNCTION sync_signal_comment_count();


-- ────────────────────────────────────────────────────────────────
-- 3. Missing index: signal_saves(signal_id)
--    Allows efficient save-count queries per signal.
--    (Only signal_saves had no signal_id index; the other tables
--    already have one.)
-- ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_signal_saves_signal_id
  ON signal_saves (signal_id);


-- ────────────────────────────────────────────────────────────────
-- 4. reading_time column on signals
--    Not yet used by the frontend (computed client-side in
--    SignalArticle.tsx), but aligns with the original spec and
--    allows CMS / admin tooling to set it explicitly.
-- ────────────────────────────────────────────────────────────────
ALTER TABLE signals
  ADD COLUMN IF NOT EXISTS reading_time text NOT NULL DEFAULT '4 min';

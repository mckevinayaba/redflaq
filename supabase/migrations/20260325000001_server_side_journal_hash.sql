-- ═══════════════════════════════════════════════════════════════════
-- FIX: Move SHA-256 journal hashing from client to server
-- ═══════════════════════════════════════════════════════════════════
--
-- PROBLEM
--   The previous lock_journal_entry_statement(entry_id, computed_hash)
--   function accepted the hash value as a caller-supplied parameter.
--   Any authenticated user could compute an arbitrary hash in their
--   browser (or in a script) using manipulated field values, then
--   pass that hash to the function. The stored hash would then "verify"
--   data that was never actually in the database. The hash proved
--   nothing except self-consistency at the moment of submission.
--
-- FIX
--   1. Enable pgcrypto for server-side digest computation.
--   2. Drop the old two-parameter function.
--   3. Create a new lock_journal_entry_statement(entry_id UUID) that
--      reads the entry fields DIRECTLY from the database using the
--      authoritative stored values, computes SHA-256 entirely inside
--      PostgreSQL, and stores both the hash and a lock flag.
--      The caller supplies only the entry UUID — no hash value.
--   4. Add verify_journal_entry_hash(entry_id UUID) which re-hashes
--      the stored fields on every call and returns TRUE/FALSE. Calling
--      this from the server (edge function or RPC) is the only way to
--      produce a verification that cannot be faked client-side.
--
-- TIMESTAMP FORMAT
--   The hash input is:
--     incident_description | entry_date | entry_time | user_id | created_at
--   created_at is formatted as ISO 8601 UTC with microsecond precision:
--     YYYY-MM-DDThh:mm:ss.UUUUUUZ
--   This format is stable, locale-independent, and defined solely by
--   the PostgreSQL server — no client clock or locale can influence it.
-- ═══════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop the old client-supplied-hash function.
-- The new function has a different signature (no computed_hash param),
-- so PostgreSQL requires an explicit drop rather than CREATE OR REPLACE.
DROP FUNCTION IF EXISTS public.lock_journal_entry_statement(UUID, TEXT);

-- ─────────────────────────────────────────────────────────────────
-- lock_journal_entry_statement
--   Reads entry fields from the database, computes SHA-256 server-side,
--   stores the hash and marks the entry as locked.
--   Returns the computed hash hex string.
--   Raises an exception if the entry does not belong to auth.uid().
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.lock_journal_entry_statement(entry_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entry  public.journal_entries%ROWTYPE;
  v_input  TEXT;
  v_hash   TEXT;
BEGIN
  SELECT * INTO v_entry
  FROM   public.journal_entries
  WHERE  id      = entry_id
    AND  user_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Entry not found or access denied';
  END IF;

  -- Build the canonical hash input from authoritative DB values.
  -- The caller cannot influence any of these fields at hash-time.
  v_input :=
    COALESCE(v_entry.incident_description, '') || '|' ||
    COALESCE(v_entry.entry_date::text, '')     || '|' ||
    COALESCE(v_entry.entry_time::text, '')     || '|' ||
    v_entry.user_id::text                      || '|' ||
    to_char(v_entry.created_at AT TIME ZONE 'UTC',
            'YYYY-MM-DD"T"HH24:MI:SS.US"Z"');

  v_hash := encode(digest(v_input, 'sha256'), 'hex');

  UPDATE public.journal_entries
  SET
    statement_hash    = v_hash,
    hash_generated_at = NOW(),
    statement_locked  = TRUE
  WHERE id      = entry_id
    AND user_id = auth.uid();

  RETURN v_hash;
END;
$$;

-- ─────────────────────────────────────────────────────────────────
-- verify_journal_entry_hash
--   Re-hashes the current DB values and compares to the stored hash.
--   Returns TRUE  — entry is intact (hash matches)
--          FALSE  — entry has been tampered with (hash mismatch)
--          NULL   — entry has not been locked yet
--   This is the ONLY trustworthy verification path; client-side
--   re-computation is no longer used for entries locked by this function.
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.verify_journal_entry_hash(entry_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entry      public.journal_entries%ROWTYPE;
  v_input      TEXT;
  v_recomputed TEXT;
BEGIN
  SELECT * INTO v_entry
  FROM   public.journal_entries
  WHERE  id      = entry_id
    AND  user_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Entry not found or access denied';
  END IF;

  IF v_entry.statement_hash IS NULL THEN
    RETURN NULL;
  END IF;

  v_input :=
    COALESCE(v_entry.incident_description, '') || '|' ||
    COALESCE(v_entry.entry_date::text, '')     || '|' ||
    COALESCE(v_entry.entry_time::text, '')     || '|' ||
    v_entry.user_id::text                      || '|' ||
    to_char(v_entry.created_at AT TIME ZONE 'UTC',
            'YYYY-MM-DD"T"HH24:MI:SS.US"Z"');

  v_recomputed := encode(digest(v_input, 'sha256'), 'hex');

  RETURN v_recomputed = v_entry.statement_hash;
END;
$$;

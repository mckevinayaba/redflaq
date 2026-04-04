-- ════════════════════════════════════════════════════════════════
-- SIGNALS TABLE
-- Purpose-built content table for the /signals page.
-- Replaces ad-hoc use of academy_articles for this content type.
-- signal_likes / signal_saves / signal_comments already exist and
-- reference signal_id as TEXT — cast signals.id::text to join them.
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS signals (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text        NOT NULL,
  slug          text        NOT NULL UNIQUE,
  excerpt       text,
  body          text,                             -- markdown / rich text
  category      text        NOT NULL DEFAULT 'behavioral-patterns',
                                                  -- allowed: behavioral-patterns | dating-relationships |
                                                  --          safety-habits | gbvf-evidence |
                                                  --          self-accountability | trust-denial
  author        text        NOT NULL DEFAULT 'RedFlaq Signals',
  published_at  timestamptz NOT NULL DEFAULT now(),
  is_featured   boolean     NOT NULL DEFAULT false,
  like_count    integer     NOT NULL DEFAULT 0,
  comment_count integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Keep updated_at current automatically
CREATE OR REPLACE FUNCTION set_signals_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER signals_updated_at
  BEFORE UPDATE ON signals
  FOR EACH ROW EXECUTE FUNCTION set_signals_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_signals_category        ON signals (category);
CREATE INDEX IF NOT EXISTS idx_signals_is_featured     ON signals (is_featured);
CREATE INDEX IF NOT EXISTS idx_signals_published_at    ON signals (published_at DESC);

-- RLS
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published signals"
  ON signals FOR SELECT
  USING (published_at <= now());

CREATE POLICY "Service role can manage signals"
  ON signals FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ════════════════════════════════════════════════════════════════
-- signal_comments: add display_name column if missing
-- (table created in 20260401000000_signals_engagement.sql)
-- ════════════════════════════════════════════════════════════════

ALTER TABLE signal_comments
  ADD COLUMN IF NOT EXISTS display_name text;

-- ════════════════════════════════════════════════════════════════
-- SEED: migrate existing academy_articles signals into signals table
-- ════════════════════════════════════════════════════════════════

INSERT INTO signals (
  slug, title, excerpt, body, category, author,
  published_at, is_featured, created_at, updated_at
)
SELECT
  slug,
  title,
  excerpt,
  content,
  category,
  COALESCE(author, 'RedFlaq Signals'),
  COALESCE(created_at::timestamptz, now()),
  false,
  COALESCE(created_at::timestamptz, now()),
  COALESCE(updated_at::timestamptz, now())
FROM academy_articles
WHERE category IN (
  'behavioral-patterns',
  'dating-relationships',
  'safety-habits',
  'gbvf-evidence',
  'trust-denial',
  'self-accountability'
)
ON CONFLICT (slug) DO NOTHING;

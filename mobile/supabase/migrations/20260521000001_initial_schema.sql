-- ── Extensions ─────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles (extends auth.users) ─────────────────────────────
CREATE TABLE public.profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name  TEXT,
  province      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_own ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ── Saved checks ───────────────────────────────────────────────
CREATE TABLE public.checks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  id_number   TEXT,
  province    TEXT,
  risk_level  TEXT NOT NULL CHECK (risk_level IN ('CLEAR','LOW','MEDIUM','HIGH')),
  risk_score  INTEGER NOT NULL DEFAULT 0,
  package     TEXT NOT NULL CHECK (package IN ('single','triple','family')),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY checks_own ON public.checks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX checks_user_id ON public.checks(user_id);

-- ── Journal entries (text encrypted client-side with AES-256-GCM) ──
CREATE TABLE public.journal_entries (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  encrypted_text  TEXT NOT NULL,
  iv              TEXT NOT NULL,
  tags            TEXT[] DEFAULT '{}' NOT NULL,
  entry_date      DATE NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY journal_own ON public.journal_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX journal_user_date ON public.journal_entries(user_id, entry_date DESC);

-- ── Quiz responses ─────────────────────────────────────────────
CREATE TABLE public.quiz_responses (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  answers             JSONB DEFAULT '{}' NOT NULL,
  completed_sections  TEXT[] DEFAULT '{}' NOT NULL,
  completed           BOOLEAN DEFAULT FALSE NOT NULL,
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY quiz_own ON public.quiz_responses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Saved signals ──────────────────────────────────────────────
CREATE TABLE public.saved_signals (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  signal_id       TEXT NOT NULL,
  title           TEXT NOT NULL,
  category        TEXT NOT NULL,
  category_label  TEXT NOT NULL,
  excerpt         TEXT NOT NULL,
  saved_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, signal_id)
);
ALTER TABLE public.saved_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY signals_own ON public.saved_signals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Group memberships ──────────────────────────────────────────
CREATE TABLE public.group_memberships (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  group_id  TEXT NOT NULL,
  status    TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending','approved','rejected')),
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, group_id)
);
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY memberships_own  ON public.group_memberships FOR ALL     USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY memberships_read ON public.group_memberships FOR SELECT  USING (auth.uid() IS NOT NULL);

-- ── Group chat messages ────────────────────────────────────────
CREATE TABLE public.messages (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id        TEXT NOT NULL,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name     TEXT NOT NULL,
  author_initial  TEXT NOT NULL,
  author_color    TEXT NOT NULL,
  text            TEXT NOT NULL,
  verified        BOOLEAN DEFAULT FALSE NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY messages_read   ON public.messages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY messages_insert ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX messages_group_id ON public.messages(group_id, created_at ASC);

-- Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ── Event RSVPs ───────────────────────────────────────────────
CREATE TABLE public.event_rsvps (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, event_id)
);
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY rsvps_own ON public.event_rsvps FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Event feedback ────────────────────────────────────────────
CREATE TABLE public.event_feedback (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id            UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id           TEXT NOT NULL,
  rating             INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  notes              TEXT,
  would_attend_again TEXT NOT NULL CHECK (would_attend_again IN ('yes','maybe','no')),
  created_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, event_id)
);
ALTER TABLE public.event_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY feedback_own ON public.event_feedback FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Evidence files ────────────────────────────────────────────
CREATE TABLE public.evidence_files (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  journal_entry_id  UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  file_name         TEXT NOT NULL,
  file_path         TEXT NOT NULL,
  file_size         INTEGER NOT NULL,
  mime_type         TEXT NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.evidence_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY evidence_own ON public.evidence_files FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Storage bucket (run this in Supabase Dashboard → Storage if not auto-created) ──
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('evidence', 'evidence', false, 52428800,
        ARRAY['image/jpeg','image/png','image/heic','image/webp','application/pdf','video/mp4'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY evidence_storage_own ON storage.objects
  FOR ALL USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ── Auto-create profile on signup ─────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, province)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'province'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── updated_at triggers ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER set_profiles_updated_at       BEFORE UPDATE ON public.profiles       FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER set_journal_updated_at        BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER set_quiz_updated_at           BEFORE UPDATE ON public.quiz_responses  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

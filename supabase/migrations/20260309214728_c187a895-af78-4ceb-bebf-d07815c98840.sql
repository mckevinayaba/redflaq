
-- Table 1: journal_entries
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL,
  entry_time TIME NOT NULL,
  incident_description TEXT NOT NULL,
  location TEXT,
  witnesses TEXT,
  injuries_damage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal entries" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own journal entries" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal entries" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal entries" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_entry_date ON public.journal_entries(entry_date DESC);

-- Table 2: journal_evidence
CREATE TABLE public.journal_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('photo', 'video', 'audio', 'document')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.journal_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own evidence" ON public.journal_evidence FOR SELECT USING (entry_id IN (SELECT id FROM public.journal_entries WHERE user_id = auth.uid()));
CREATE POLICY "Users can create own evidence" ON public.journal_evidence FOR INSERT WITH CHECK (entry_id IN (SELECT id FROM public.journal_entries WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own evidence" ON public.journal_evidence FOR DELETE USING (entry_id IN (SELECT id FROM public.journal_entries WHERE user_id = auth.uid()));

CREATE INDEX idx_journal_evidence_entry_id ON public.journal_evidence(entry_id);

-- Storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('journal-evidence', 'journal-evidence', false, 52428800, ARRAY['image/jpeg','image/png','image/gif','image/webp','video/mp4','video/quicktime','audio/mpeg','audio/mp4','audio/x-m4a','application/pdf']);

-- Storage policies
CREATE POLICY "Users can upload own evidence" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'journal-evidence' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view own evidence files" ON storage.objects FOR SELECT USING (bucket_id = 'journal-evidence' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own evidence files" ON storage.objects FOR DELETE USING (bucket_id = 'journal-evidence' AND (storage.foldername(name))[1] = auth.uid()::text);

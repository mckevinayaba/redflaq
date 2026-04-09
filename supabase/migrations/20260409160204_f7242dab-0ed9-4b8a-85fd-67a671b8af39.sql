
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

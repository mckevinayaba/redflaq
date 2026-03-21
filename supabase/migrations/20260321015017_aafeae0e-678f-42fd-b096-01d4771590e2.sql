
-- Habit check-ins table
CREATE TABLE public.habit_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date date NOT NULL DEFAULT CURRENT_DATE,
  responses jsonb NOT NULL DEFAULT '[]'::jsonb,
  score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, checkin_date)
);

ALTER TABLE public.habit_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own checkins" ON public.habit_checkins
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Habit streaks table
CREATE TABLE public.habit_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_checkin_date date,
  total_checkins integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.habit_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own streaks" ON public.habit_streaks
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Behavioral assessments table
CREATE TABLE public.behavioral_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type text NOT NULL DEFAULT 'questionnaire',
  responses jsonb NOT NULL DEFAULT '[]'::jsonb,
  free_text text,
  ai_analysis text,
  risk_level text NOT NULL DEFAULT 'low',
  risk_score integer NOT NULL DEFAULT 0,
  categories_detected text[] DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.behavioral_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own assessments" ON public.behavioral_assessments
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

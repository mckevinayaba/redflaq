
-- Academy articles table
CREATE TABLE public.academy_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'dating-safety',
  featured_image_url text,
  meta_description text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author text DEFAULT 'RedFlaq Team',
  related_tool_slug text
);
ALTER TABLE public.academy_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read published articles" ON public.academy_articles
  FOR SELECT USING (published = true);
CREATE POLICY "Admin can manage articles" ON public.academy_articles
  FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'owner'));

-- Partners table
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name text NOT NULL,
  org_type text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  website text,
  status text DEFAULT 'pending',
  referral_code text UNIQUE,
  checks_referred integer DEFAULT 0,
  revenue_referred numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  notes text
);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert partners" ON public.partners
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public view partners" ON public.partners
  FOR SELECT USING (true);
CREATE POLICY "Admin can manage partners" ON public.partners
  FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'owner'));

-- Referrals table
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL,
  referred_user_id uuid,
  referred_email text,
  status text DEFAULT 'clicked',
  converted_at timestamptz,
  reward_granted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_user_id);
CREATE POLICY "Allow public insert referrals" ON public.referrals
  FOR INSERT WITH CHECK (true);

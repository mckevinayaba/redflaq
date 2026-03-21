
-- WhatsApp conversations state table
CREATE TABLE public.whatsapp_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text UNIQUE NOT NULL,
  current_state text NOT NULL DEFAULT 'START',
  name_entered text,
  province_entered text,
  consent_given boolean DEFAULT false,
  last_generated_link text,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view whatsapp conversations" ON public.whatsapp_conversations
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));

-- WhatsApp message log
CREATE TABLE public.whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  message_text text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view whatsapp messages" ON public.whatsapp_messages
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));

-- WhatsApp openings (rotating messages)
CREATE TABLE public.whatsapp_openings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opening_text text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.whatsapp_openings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage whatsapp openings" ON public.whatsapp_openings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role));

CREATE POLICY "Service role can read openings" ON public.whatsapp_openings
  FOR SELECT TO anon
  USING (active = true);

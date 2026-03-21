
-- Allow service role to insert into whatsapp tables (for edge functions)
CREATE POLICY "Service role can insert conversations" ON public.whatsapp_conversations
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can insert messages" ON public.whatsapp_messages
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

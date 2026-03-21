-- Add UPDATE policy to allow credit deduction when payment is verified
CREATE POLICY "Allow update credits when verified" ON public.manual_payments
  FOR UPDATE
  USING (status = 'verified')
  WITH CHECK (status = 'verified');
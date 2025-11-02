-- Fix search_path security issue by dropping and recreating with proper settings
DROP TRIGGER IF EXISTS update_wanted_persons_updated_at ON public.wanted_persons;
DROP FUNCTION IF EXISTS public.update_wanted_persons_updated_at();

CREATE OR REPLACE FUNCTION public.update_wanted_persons_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_wanted_persons_updated_at
BEFORE UPDATE ON public.wanted_persons
FOR EACH ROW
EXECUTE FUNCTION public.update_wanted_persons_updated_at();
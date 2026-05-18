
CREATE TABLE public.vagas_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  remaining_slots integer NOT NULL DEFAULT 4,
  initial_slots integer NOT NULL DEFAULT 4,
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vagas_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vagas" ON public.vagas_config FOR SELECT USING (true);
CREATE POLICY "Admins can update vagas" ON public.vagas_config FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert vagas" ON public.vagas_config FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Service role manages vagas" ON public.vagas_config FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO public.vagas_config (remaining_slots, initial_slots) VALUES (4, 4);

CREATE OR REPLACE FUNCTION public.decrement_vaga()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_value integer;
BEGIN
  UPDATE public.vagas_config
  SET remaining_slots = GREATEST(remaining_slots - 1, 0),
      updated_at = now()
  WHERE singleton = true
  RETURNING remaining_slots INTO new_value;
  RETURN new_value;
END;
$$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.vagas_config;
ALTER TABLE public.vagas_config REPLICA IDENTITY FULL;

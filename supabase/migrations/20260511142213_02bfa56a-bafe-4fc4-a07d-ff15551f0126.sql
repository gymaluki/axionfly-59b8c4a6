
CREATE TABLE IF NOT EXISTS public.system_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  level text NOT NULL DEFAULT 'error',
  message text NOT NULL,
  stack text,
  source text,
  url text,
  user_agent text,
  user_id uuid,
  user_email text,
  context jsonb,
  resolved boolean NOT NULL DEFAULT false
);

ALTER TABLE public.system_errors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can report errors" ON public.system_errors;
CREATE POLICY "Anyone can report errors"
ON public.system_errors FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Owner can view errors" ON public.system_errors;
CREATE POLICY "Owner can view errors"
ON public.system_errors FOR SELECT
TO authenticated
USING (lower(coalesce(auth.jwt() ->> 'email','')) = 'andreyhenriquev4@gmail.com');

DROP POLICY IF EXISTS "Owner can update errors" ON public.system_errors;
CREATE POLICY "Owner can update errors"
ON public.system_errors FOR UPDATE
TO authenticated
USING (lower(coalesce(auth.jwt() ->> 'email','')) = 'andreyhenriquev4@gmail.com');

DROP POLICY IF EXISTS "Owner can delete errors" ON public.system_errors;
CREATE POLICY "Owner can delete errors"
ON public.system_errors FOR DELETE
TO authenticated
USING (lower(coalesce(auth.jwt() ->> 'email','')) = 'andreyhenriquev4@gmail.com');

CREATE INDEX IF NOT EXISTS system_errors_created_at_idx ON public.system_errors (created_at DESC);

ALTER TABLE public.system_errors REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.system_errors;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

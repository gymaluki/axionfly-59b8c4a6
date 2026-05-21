CREATE TABLE IF NOT EXISTS public.user_cakto_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_cakto_credentials ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_user_cakto_credentials_updated_at ON public.user_cakto_credentials;
CREATE TRIGGER update_user_cakto_credentials_updated_at
BEFORE UPDATE ON public.user_cakto_credentials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.user_cakto_credentials (user_id, client_id, client_secret)
SELECT user_id, cakto_client_id, cakto_client_secret
FROM public.profiles
WHERE COALESCE(cakto_client_id, '') <> ''
  AND COALESCE(cakto_client_secret, '') <> ''
ON CONFLICT (user_id) DO UPDATE
SET client_id = EXCLUDED.client_id,
    client_secret = EXCLUDED.client_secret,
    updated_at = now();

ALTER TABLE public.profiles
DROP COLUMN IF EXISTS cakto_client_id,
DROP COLUMN IF EXISTS cakto_client_secret;

DROP POLICY IF EXISTS "Users can view their own licenses" ON public.hyperbuild_licenses;
DROP POLICY IF EXISTS "Users can view their own logs" ON public.hyperbuild_license_logs;

DROP POLICY IF EXISTS "Users can update their own sites" ON public.user_sites;
CREATE POLICY "Users can update their own sites"
ON public.user_sites
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
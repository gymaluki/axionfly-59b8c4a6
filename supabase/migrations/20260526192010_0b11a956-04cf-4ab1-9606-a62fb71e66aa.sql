
-- site_settings: key/value público para configurações da landing
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins insert site_settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins update site_settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins delete site_settings"
  ON public.site_settings FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Bucket público para vídeos da landing
INSERT INTO storage.buckets (id, name, public)
VALUES ('landing-videos', 'landing-videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Acesso público de leitura
DROP POLICY IF EXISTS "Public read landing-videos" ON storage.objects;
CREATE POLICY "Public read landing-videos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'landing-videos');

DROP POLICY IF EXISTS "Admins upload landing-videos" ON storage.objects;
CREATE POLICY "Admins upload landing-videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'landing-videos' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins update landing-videos" ON storage.objects;
CREATE POLICY "Admins update landing-videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'landing-videos' AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'landing-videos' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins delete landing-videos" ON storage.objects;
CREATE POLICY "Admins delete landing-videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'landing-videos' AND public.is_admin(auth.uid()));

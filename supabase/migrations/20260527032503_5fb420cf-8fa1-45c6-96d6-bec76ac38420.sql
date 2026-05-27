ALTER TABLE public.admin_users DROP COLUMN IF EXISTS email;

DROP POLICY IF EXISTS "Public read landing-videos" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can subscribe to vagas_config broadcasts" ON realtime.messages;
CREATE POLICY "Anyone can subscribe to vagas_config broadcasts"
  ON realtime.messages
  FOR SELECT
  TO authenticated, anon
  USING (
    extension IN ('broadcast', 'postgres_changes')
    AND realtime.topic() = 'vagas_config'
  );
CREATE POLICY "Admins can receive system error broadcasts"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.messages.extension = 'broadcast'
  AND realtime.topic() = 'system-errors-live'
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can send system error broadcasts"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  realtime.messages.extension = 'broadcast'
  AND realtime.topic() = 'system-errors-live'
  AND public.is_admin(auth.uid())
);
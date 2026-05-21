CREATE POLICY "Service role manages user cakto credentials"
ON public.user_cakto_credentials
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view their own licenses" ON public.hyperbuild_licenses;
CREATE POLICY "Users can view their own licenses"
ON public.hyperbuild_licenses
FOR SELECT
TO authenticated
USING (used_by = auth.uid());

DROP POLICY IF EXISTS "Users can view their own logs" ON public.hyperbuild_license_logs;
CREATE POLICY "Users can view their own logs"
ON public.hyperbuild_license_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
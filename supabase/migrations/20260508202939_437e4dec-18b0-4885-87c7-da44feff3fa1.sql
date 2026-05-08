
-- 1) Profiles: restrict SELECT to own row
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 2) Admin users: remove public read; admins can read via is_admin() function
DROP POLICY IF EXISTS "Authenticated can read admin_users" ON public.admin_users;
CREATE POLICY "Admins can read admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 3) Replace inline admin_users subselects in RLS with is_admin() helper
-- subscriptions
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- pending_payments
DROP POLICY IF EXISTS "Admins can view pending_payments" ON public.pending_payments;
CREATE POLICY "Admins can view pending_payments"
  ON public.pending_payments FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- hyperbuild_licenses
DROP POLICY IF EXISTS "Admin can do everything on licenses" ON public.hyperbuild_licenses;
CREATE POLICY "Admin can do everything on licenses"
  ON public.hyperbuild_licenses FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- hyperbuild_license_logs
DROP POLICY IF EXISTS "Admins can view all logs" ON public.hyperbuild_license_logs;
CREATE POLICY "Admins can view all logs"
  ON public.hyperbuild_license_logs FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- videos (admin policies)
DROP POLICY IF EXISTS "Admins can insert videos" ON public.videos;
CREATE POLICY "Admins can insert videos"
  ON public.videos FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update videos" ON public.videos;
CREATE POLICY "Admins can update videos"
  ON public.videos FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete videos" ON public.videos;
CREATE POLICY "Admins can delete videos"
  ON public.videos FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

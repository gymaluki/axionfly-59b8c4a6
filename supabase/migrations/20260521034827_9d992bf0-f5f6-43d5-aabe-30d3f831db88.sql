DROP POLICY IF EXISTS "Admins can manage affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Admins can view affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Admins can insert affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Admins can update affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Admins can delete affiliates" ON public.affiliates;

CREATE POLICY "Admins can view affiliates"
ON public.affiliates
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert affiliates"
ON public.affiliates
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update affiliates"
ON public.affiliates
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete affiliates"
ON public.affiliates
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view platform sales" ON public.platform_sales;
CREATE POLICY "Admins can view platform sales"
ON public.platform_sales
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;
CREATE POLICY "Admins can manage modules"
ON public.modules
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;
CREATE POLICY "Admins can manage lessons"
ON public.lessons
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Owner can view errors" ON public.system_errors;
DROP POLICY IF EXISTS "Owner can update errors" ON public.system_errors;
DROP POLICY IF EXISTS "Owner can delete errors" ON public.system_errors;

CREATE POLICY "Admins can view system errors"
ON public.system_errors
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update system errors"
ON public.system_errors
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete system errors"
ON public.system_errors
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));
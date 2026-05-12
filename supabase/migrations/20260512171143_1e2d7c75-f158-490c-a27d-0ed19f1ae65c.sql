-- Configura search_path para funções
ALTER FUNCTION public.is_admin(uuid) SET search_path = public;
ALTER FUNCTION public.check_user_access(uuid) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.activate_pending_payment() SET search_path = public;
ALTER FUNCTION public.claim_pending_access() SET search_path = public;
ALTER FUNCTION public.claim_hyperbuild_license() SET search_path = public;

-- Garante que admin_users só pode ser lido por admins ou service_role
DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;
CREATE POLICY "Admins can read admin_users" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (public.is_admin(auth.uid()));

-- Garante que perfis podem ser vistos por todos autenticados (necessário para nomes no dashboard)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Garante que o service_role tem acesso total a tudo para webhooks
ALTER TABLE public.subscriptions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.pending_payments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.platform_sales FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Service role can manage subscriptions" 
ON public.subscriptions 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can manage pending_payments" ON public.pending_payments;
CREATE POLICY "Service role can manage pending_payments" 
ON public.pending_payments 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can manage platform_sales" ON public.platform_sales;
CREATE POLICY "Service role can manage platform_sales" 
ON public.platform_sales 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
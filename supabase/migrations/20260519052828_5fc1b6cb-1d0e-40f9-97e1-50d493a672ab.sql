
-- 1. PROFILES: remove policy permissiva que vazava credenciais Cakto
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 2. AFFILIATES: remove visualização pública (que expunha e-mails) e cria view sem e-mail
DROP POLICY IF EXISTS "Public can view affiliate info by slug" ON public.affiliates;

CREATE OR REPLACE VIEW public.affiliates_public
WITH (security_invoker = on) AS
SELECT id, slug, name, lifetime_url, monthly_url, quarterly_url
FROM public.affiliates;

GRANT SELECT ON public.affiliates_public TO anon, authenticated;

-- Política de leitura para autenticados na tabela base, apenas colunas não sensíveis via view
-- (mantém admin policy ALL já existente). Para suportar a view com security_invoker,
-- permitimos SELECT na base table somente para admins (já coberto pela policy ALL).
-- A view com security_invoker exige que o usuário tenha SELECT na tabela base.
-- Solução: trocar a view para SECURITY DEFINER controlada.
DROP VIEW IF EXISTS public.affiliates_public;

CREATE OR REPLACE FUNCTION public.get_affiliate_by_slug(_slug text)
RETURNS TABLE (id uuid, slug text, name text, lifetime_url text, monthly_url text, quarterly_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, slug, name, lifetime_url, monthly_url, quarterly_url
  FROM public.affiliates
  WHERE slug = _slug
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_affiliate_by_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_affiliate_by_slug(text) TO anon, authenticated;

-- 3. LESSONS / MODULES: restringir a assinantes ativos
DROP POLICY IF EXISTS "Anyone can view lessons" ON public.lessons;
DROP POLICY IF EXISTS "Anyone can view modules" ON public.modules;

CREATE POLICY "Subscribers can view lessons"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (public.check_user_access(auth.uid()));

CREATE POLICY "Subscribers can view modules"
  ON public.modules FOR SELECT
  TO authenticated
  USING (public.check_user_access(auth.uid()));

-- 4. SYSTEM_ERRORS: remove do realtime para impedir vazamento de stacks/emails
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'system_errors'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.system_errors';
  END IF;
END$$;

-- 5. SECURITY DEFINER: revogar execução pública/anon de funções sensíveis
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.check_user_access(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.claim_hyperbuild_license() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.claim_pending_access() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.decrement_vaga() FROM anon, public;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_access(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_hyperbuild_license() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_pending_access() TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_vaga() TO service_role;

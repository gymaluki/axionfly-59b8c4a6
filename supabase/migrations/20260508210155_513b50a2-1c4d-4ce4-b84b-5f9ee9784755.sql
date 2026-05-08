
CREATE OR REPLACE FUNCTION public.claim_hyperbuild_license()
 RETURNS TABLE(license_key text, expires_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    target_key TEXT;
    target_expiry TIMESTAMP WITH TIME ZONE;
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Acesso negado. Você precisa estar autenticado.';
    END IF;

    IF NOT public.check_user_access(current_user_id) THEN
        RAISE EXCEPTION 'Acesso restrito a membros com assinatura ativa.';
    END IF;

    SELECT key, public.hyperbuild_licenses.expires_at INTO target_key, target_expiry
    FROM public.hyperbuild_licenses
    WHERE used_by = current_user_id
    LIMIT 1;

    IF target_key IS NOT NULL THEN
        INSERT INTO public.hyperbuild_license_logs (user_id, license_key, action, details)
        VALUES (current_user_id, target_key, 'view', 'User retrieved existing license');
        RETURN QUERY SELECT target_key, target_expiry;
        RETURN;
    END IF;

    SELECT key, public.hyperbuild_licenses.expires_at INTO target_key, target_expiry
    FROM public.hyperbuild_licenses
    WHERE used_by IS NULL AND status = 'active'
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    IF target_key IS NULL THEN
        INSERT INTO public.hyperbuild_license_logs (user_id, action, details)
        VALUES (current_user_id, 'error', 'No licenses available in stock');
        RAISE EXCEPTION 'Não há licenças disponíveis no momento. Entre em contato com o suporte.';
    END IF;

    UPDATE public.hyperbuild_licenses
    SET used_by = current_user_id, used_at = now(), status = 'used'
    WHERE key = target_key;

    INSERT INTO public.hyperbuild_license_logs (user_id, license_key, action, details)
    VALUES (current_user_id, target_key, 'claim', 'New license claimed from stock');

    RETURN QUERY SELECT target_key, target_expiry;
END;
$function$;


ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE public.pending_payments ADD COLUMN IF NOT EXISTS expires_at timestamptz;

CREATE OR REPLACE FUNCTION public.check_user_access(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = check_user_id
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  ) OR EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN auth.users u ON u.email = au.email
    WHERE u.id = check_user_id
  );
$function$;


-- 1. Add user_id + is_owner to admin_users
ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS is_owner boolean NOT NULL DEFAULT false;

-- Backfill user_id from auth.users by current email
UPDATE public.admin_users au
SET user_id = u.id
FROM auth.users u
WHERE lower(u.email) = lower(au.email)
  AND au.user_id IS NULL;

-- Mark owner
UPDATE public.admin_users
SET is_owner = true
WHERE lower(email) = 'andreyhenriquev4@gmail.com';

CREATE UNIQUE INDEX IF NOT EXISTS admin_users_user_id_key
  ON public.admin_users(user_id) WHERE user_id IS NOT NULL;

-- 2. Rewrite is_admin to use user_id (UUID), no email join
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id
  );
$$;

-- 3. Rewrite check_user_access to use user_id-based admin lookup
CREATE OR REPLACE FUNCTION public.check_user_access(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = check_user_id
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  ) OR EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id
  );
$$;

-- 4. is_owner function (UUID-based)
CREATE OR REPLACE FUNCTION public.is_owner(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id AND is_owner = true
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_owner(uuid) TO authenticated, anon;

-- 5. Restrict system_errors to owner only (drop old admin policies)
DROP POLICY IF EXISTS "Admins can view system errors" ON public.system_errors;
DROP POLICY IF EXISTS "Admins can update system errors" ON public.system_errors;
DROP POLICY IF EXISTS "Admins can delete system errors" ON public.system_errors;

CREATE POLICY "Owner can view system errors"
  ON public.system_errors FOR SELECT
  USING (public.is_owner(auth.uid()));

CREATE POLICY "Owner can update system errors"
  ON public.system_errors FOR UPDATE
  USING (public.is_owner(auth.uid()));

CREATE POLICY "Owner can delete system errors"
  ON public.system_errors FOR DELETE
  USING (public.is_owner(auth.uid()));

-- 6. Replace storage videos policies to use is_admin() (now UUID-based)
DROP POLICY IF EXISTS "Admins can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update video objects" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete video files" ON storage.objects;

CREATE POLICY "Admins can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'videos' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update video objects"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'videos' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete video files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'videos' AND public.is_admin(auth.uid()));

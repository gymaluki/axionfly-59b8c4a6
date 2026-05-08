-- Secure the function
ALTER FUNCTION public.claim_hyperbuild_license() SET search_path = public;

-- Revoke all permissions from public
REVOKE EXECUTE ON FUNCTION public.claim_hyperbuild_license() FROM PUBLIC;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.claim_hyperbuild_license() TO authenticated;
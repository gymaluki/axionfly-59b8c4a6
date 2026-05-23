REVOKE ALL ON FUNCTION public.activate_pending_payment() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.activate_pending_payment() FROM anon;
REVOKE ALL ON FUNCTION public.activate_pending_payment() FROM authenticated;

REVOKE ALL ON FUNCTION public.claim_pending_access() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_pending_access() TO authenticated;
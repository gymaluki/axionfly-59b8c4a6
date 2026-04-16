CREATE OR REPLACE FUNCTION public.claim_pending_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  current_email text := lower(COALESCE(auth.jwt() ->> 'email', ''));
  pending_record public.pending_payments%ROWTYPE;
BEGIN
  IF current_user_id IS NULL OR current_email = '' THEN
    RETURN false;
  END IF;

  SELECT *
  INTO pending_record
  FROM public.pending_payments
  WHERE status = 'active'
    AND (
      lower(email) = current_email
      OR email = '*'
    )
  ORDER BY
    CASE WHEN lower(email) = current_email THEN 0 ELSE 1 END,
    created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  INSERT INTO public.subscriptions (user_id, status, payment_provider, transaction_id, plan)
  VALUES (
    current_user_id,
    'active',
    COALESCE(pending_record.payment_provider, 'manual'),
    pending_record.transaction_id,
    COALESCE(pending_record.plan, 'lifetime')
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    status = EXCLUDED.status,
    payment_provider = EXCLUDED.payment_provider,
    transaction_id = EXCLUDED.transaction_id,
    plan = EXCLUDED.plan,
    updated_at = now();

  UPDATE public.pending_payments
  SET status = 'processed', updated_at = now()
  WHERE id = pending_record.id;

  RETURN true;
END;
$$;
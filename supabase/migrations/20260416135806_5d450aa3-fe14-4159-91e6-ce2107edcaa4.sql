
CREATE OR REPLACE FUNCTION public.activate_pending_payment()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  pending RECORD;
BEGIN
  -- Buscar pagamento pendente pelo email do novo usuário
  SELECT * INTO pending
  FROM public.pending_payments
  WHERE (lower(email) = lower(NEW.email) OR email = '*')
    AND status = 'active'
  ORDER BY 
    CASE WHEN lower(email) = lower(NEW.email) THEN 0 ELSE 1 END,
    created_at DESC
  LIMIT 1;

  IF FOUND THEN
    INSERT INTO public.subscriptions (user_id, status, payment_provider, transaction_id, plan)
    VALUES (NEW.id, 'active', pending.payment_provider, pending.transaction_id, pending.plan)
    ON CONFLICT (user_id) DO UPDATE SET
      status = 'active',
      payment_provider = EXCLUDED.payment_provider,
      transaction_id = EXCLUDED.transaction_id,
      plan = EXCLUDED.plan,
      updated_at = now();

    UPDATE public.pending_payments
    SET status = 'processed', updated_at = now()
    WHERE id = pending.id;
  END IF;

  RETURN NEW;
END;
$function$;

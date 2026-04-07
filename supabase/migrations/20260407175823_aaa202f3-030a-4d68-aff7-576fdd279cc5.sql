
-- Tabela para armazenar pagamentos de usuários que ainda não se cadastraram
CREATE TABLE public.pending_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  payment_provider text DEFAULT 'perfectpay',
  transaction_id text,
  plan text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS: apenas service_role pode gerenciar
ALTER TABLE public.pending_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage pending_payments"
  ON public.pending_payments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pending_payments_updated_at
  BEFORE UPDATE ON public.pending_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função que roda quando novo usuário se registra
-- Verifica se há pagamento pendente e ativa a subscription automaticamente
CREATE OR REPLACE FUNCTION public.activate_pending_payment()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
DECLARE
  pending RECORD;
BEGIN
  -- Buscar pagamento pendente pelo email do novo usuário
  SELECT * INTO pending
  FROM public.pending_payments
  WHERE lower(email) = lower(NEW.email)
    AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    -- Criar subscription ativa para o novo usuário
    INSERT INTO public.subscriptions (user_id, status, payment_provider, transaction_id, plan)
    VALUES (NEW.id, 'active', pending.payment_provider, pending.transaction_id, pending.plan)
    ON CONFLICT (user_id) DO UPDATE SET
      status = 'active',
      payment_provider = EXCLUDED.payment_provider,
      transaction_id = EXCLUDED.transaction_id,
      plan = EXCLUDED.plan,
      updated_at = now();

    -- Marcar pagamento pendente como processado
    UPDATE public.pending_payments
    SET status = 'processed', updated_at = now()
    WHERE id = pending.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger no auth.users para ativar acesso ao cadastrar
CREATE TRIGGER on_auth_user_created_activate_payment
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.activate_pending_payment();

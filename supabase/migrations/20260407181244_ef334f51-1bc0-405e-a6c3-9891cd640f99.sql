
-- Admins podem ver pending_payments
CREATE POLICY "Admins can view pending_payments"
  ON public.pending_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Admins podem ver todas as assinaturas (não apenas a própria)
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );


-- Table to track user subscriptions/payments
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive',
  payment_provider TEXT DEFAULT 'perfectpay',
  transaction_id TEXT,
  plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the admin email
INSERT INTO public.admin_users (email) VALUES ('andreyhenriquev4@gmail.com');

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Subscriptions: users can read their own subscription
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admin users: anyone authenticated can check if they are admin
CREATE POLICY "Authenticated can read admin_users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (true);

-- Service role can insert/update subscriptions (for webhook)
CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to check if user has access (paid or admin)
CREATE OR REPLACE FUNCTION public.check_user_access(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions WHERE user_id = check_user_id AND status = 'active'
  ) OR EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN auth.users u ON u.email = au.email
    WHERE u.id = check_user_id
  );
$$;

-- Create affiliates table
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    monthly_url TEXT,
    quarterly_url TEXT,
    lifetime_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- Create platform_sales table to track every sale attempt and conversion
CREATE TABLE IF NOT EXISTS public.platform_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT UNIQUE,
    email TEXT NOT NULL,
    amount DECIMAL(10, 2),
    status TEXT NOT NULL, -- 'pending', 'paid', 'canceled', 'refunded'
    payment_method TEXT, -- 'pix', 'credit_card', 'boleto'
    plan TEXT, -- 'monthly', 'quarterly', 'lifetime'
    affiliate_slug TEXT REFERENCES public.affiliates(slug),
    payload JSONB, -- Store full webhook payload for debugging
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_sales ENABLE ROW LEVEL SECURITY;

-- Add affiliate_slug to existing tables
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS affiliate_slug TEXT;
ALTER TABLE public.pending_payments ADD COLUMN IF NOT EXISTS affiliate_slug TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_sales_affiliate_slug ON public.platform_sales(affiliate_slug);
CREATE INDEX IF NOT EXISTS idx_platform_sales_email ON public.platform_sales(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_affiliate_slug ON public.subscriptions(affiliate_slug);

-- RLS Policies for Admins
-- We already have an admin_users table. Let's use it.
CREATE POLICY "Admins can manage affiliates" 
ON public.affiliates
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE email = auth.jwt() ->> 'email'
    )
);

CREATE POLICY "Admins can view platform sales" 
ON public.platform_sales
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE email = auth.jwt() ->> 'email'
    )
);

-- Public can view affiliate basic info if needed, but for now let's keep it restricted or add specific rules if needed.
-- Actually, the frontend needs to list them or find them by slug.
CREATE POLICY "Public can view affiliate info by slug" 
ON public.affiliates
FOR SELECT
USING (true);

-- Insert the first affiliate: Matheus
INSERT INTO public.affiliates (slug, name, monthly_url, lifetime_url)
VALUES (
    'z', 
    'Matheus', 
    'https://pay.cakto.com.br/6u886t8_849513?affiliate=Lghn3ieU', 
    'https://pay.cakto.com.br/wcv2cko_849541?affiliate=LEGLH5Bd'
)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    monthly_url = EXCLUDED.monthly_url,
    lifetime_url = EXCLUDED.lifetime_url;

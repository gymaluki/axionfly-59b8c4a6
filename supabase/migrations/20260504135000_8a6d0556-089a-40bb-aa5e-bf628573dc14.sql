-- Create a table for license audit logs
CREATE TABLE IF NOT EXISTS public.hyperbuild_license_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    license_key TEXT,
    action TEXT NOT NULL, -- 'claim', 'view', 'error'
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on logs
ALTER TABLE public.hyperbuild_license_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view all logs, users can view their own
CREATE POLICY "Users can view their own logs" ON public.hyperbuild_license_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all logs" ON public.hyperbuild_license_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Drop existing function to change return type
DROP FUNCTION IF EXISTS public.claim_hyperbuild_license();

-- Update the claim function to be more robust and log actions
CREATE OR REPLACE FUNCTION public.claim_hyperbuild_license()
RETURNS TABLE (license_key TEXT, expires_at TIMESTAMP WITH TIME ZONE) AS $$
DECLARE
    target_key TEXT;
    target_expiry TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Check if user already has an active license
    SELECT key, public.hyperbuild_licenses.expires_at INTO target_key, target_expiry
    FROM public.hyperbuild_licenses
    WHERE used_by = auth.uid()
    LIMIT 1;

    IF target_key IS NOT NULL THEN
        -- Log that the user viewed their existing license
        INSERT INTO public.hyperbuild_license_logs (user_id, license_key, action, details)
        VALUES (auth.uid(), target_key, 'view', 'User retrieved existing license');
        
        RETURN QUERY SELECT target_key, target_expiry;
        RETURN;
    END IF;

    -- Find an available license
    SELECT key, public.hyperbuild_licenses.expires_at INTO target_key, target_expiry
    FROM public.hyperbuild_licenses
    WHERE used_by IS NULL AND status = 'active'
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    IF target_key IS NULL THEN
        -- Log failure
        INSERT INTO public.hyperbuild_license_logs (user_id, action, details)
        VALUES (auth.uid(), 'error', 'No licenses available in stock');
        
        RAISE EXCEPTION 'Não há licenças disponíveis no momento. Entre em contato com o suporte.';
    END IF;

    -- Assign the license
    UPDATE public.hyperbuild_licenses
    SET used_by = auth.uid(),
        used_at = now(),
        status = 'used'
    WHERE key = target_key;

    -- Log successful claim
    INSERT INTO public.hyperbuild_license_logs (user_id, license_key, action, details)
    VALUES (auth.uid(), target_key, 'claim', 'New license claimed from stock');

    RETURN QUERY SELECT target_key, target_expiry;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cakto_client_id TEXT,
ADD COLUMN IF NOT EXISTS cakto_client_secret TEXT;

-- Garantir que as colunas sejam acessíveis conforme as políticas de RLS já existentes na profiles
-- Geralmente perfis permitem que o próprio usuário veja e edite seus dados.

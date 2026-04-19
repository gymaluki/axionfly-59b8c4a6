
-- Histórico de buscas
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  query TEXT NOT NULL,
  nicho TEXT,
  location TEXT,
  results_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own search history"
ON public.search_history FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own search history"
ON public.search_history FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own search history"
ON public.search_history FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_search_history_user_created ON public.search_history(user_id, created_at DESC);

-- Leads contatados
CREATE TABLE public.contacted_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lead_name TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  source_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'contatado',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contacted_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own contacted leads"
ON public.contacted_leads FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own contacted leads"
ON public.contacted_leads FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own contacted leads"
ON public.contacted_leads FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own contacted leads"
ON public.contacted_leads FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_contacted_leads_user_created ON public.contacted_leads(user_id, created_at DESC);

CREATE TRIGGER update_contacted_leads_updated_at
BEFORE UPDATE ON public.contacted_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  url TEXT NOT NULL,
  site_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_sites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sites" 
ON public.user_sites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sites" 
ON public.user_sites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sites" 
ON public.user_sites 
FOR DELETE 
USING (auth.uid() = user_id);

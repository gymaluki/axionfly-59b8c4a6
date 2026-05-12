-- Create modules table
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Create lessons table (replacing/extending videos concept)
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration TEXT,
  "order" INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS for user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for modules
CREATE POLICY "Anyone can view modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Admins can manage modules" ON public.modules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Policies for lessons
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Admins can manage lessons" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Policies for user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- Insert a default module for existing videos
DO $$
DECLARE
    default_module_id UUID;
BEGIN
    INSERT INTO public.modules (title, description, "order")
    VALUES ('Primeiros Passos', 'Aulas iniciais da plataforma', 1)
    RETURNING id INTO default_module_id;

    -- Migrate existing videos to lessons
    INSERT INTO public.lessons (title, description, video_url, module_id, created_at)
    SELECT title, description, video_url, default_module_id, created_at
    FROM public.videos;
END $$;

-- Create function to update updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update trigger for modules
CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for lessons
CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

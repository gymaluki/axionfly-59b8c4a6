
-- Create videos table for members area
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- All authenticated users with access can view videos
CREATE POLICY "Authenticated users can view videos"
ON public.videos
FOR SELECT
TO authenticated
USING (public.check_user_access(auth.uid()));

-- Only admins can insert videos
CREATE POLICY "Admins can insert videos"
ON public.videos
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Only admins can update videos
CREATE POLICY "Admins can update videos"
ON public.videos
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Only admins can delete videos
CREATE POLICY "Admins can delete videos"
ON public.videos
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Storage policies: admins can upload
CREATE POLICY "Admins can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Anyone authenticated with access can view video files
CREATE POLICY "Authenticated can view video files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'videos');

-- Admins can delete video files
CREATE POLICY "Admins can delete video files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'videos'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);


-- Make videos bucket private
UPDATE storage.buckets SET public = false WHERE id = 'videos';

-- Add SELECT policy on storage.objects for videos bucket - require active subscription/access
CREATE POLICY "Users with access can view video files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'videos' AND public.check_user_access(auth.uid()));

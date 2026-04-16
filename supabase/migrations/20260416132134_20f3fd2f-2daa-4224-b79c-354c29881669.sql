
-- Drop and recreate to avoid conflicts
DROP POLICY IF EXISTS "Admins can upload videos" ON storage.objects;

CREATE POLICY "Admins can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- These may have been created partially, ensure they exist
DROP POLICY IF EXISTS "Admins can update video objects" ON storage.objects;
CREATE POLICY "Admins can update video objects"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'videos'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Admins can delete video objects" ON storage.objects;
CREATE POLICY "Admins can delete video objects"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'videos'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

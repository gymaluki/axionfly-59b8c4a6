
-- Remove broad public SELECT policies on storage.objects
DROP POLICY IF EXISTS "public_select_videos" ON storage.objects;
DROP POLICY IF EXISTS "Public access to videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access on videos" ON storage.objects;

-- List all SELECT policies to find the problematic one
-- The bucket is already private, but there may be old permissive policies
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND cmd = 'SELECT'
    AND policyname NOT IN ('Authenticated with access can read videos')
  LOOP
    -- Only drop policies that are for the videos bucket or overly broad
    IF pol.policyname LIKE '%video%' OR pol.policyname LIKE '%public%' OR pol.policyname LIKE '%Public%' THEN
      EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END IF;
  END LOOP;
END $$;

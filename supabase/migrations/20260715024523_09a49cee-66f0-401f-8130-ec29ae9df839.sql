
-- 1) Schema: add ownership, status, and thumbnail URL
ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS img_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$ BEGIN
  ALTER TABLE public.assets ADD CONSTRAINT assets_status_check CHECK (status IN ('draft','published'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS assets_owner_id_idx ON public.assets(owner_id);
CREATE INDEX IF NOT EXISTS assets_status_idx ON public.assets(status);

-- 2) RLS: public reads only published; owners full access to their own rows
DROP POLICY IF EXISTS "Assets are publicly readable" ON public.assets;

CREATE POLICY "Public reads published assets" ON public.assets
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Owners read own assets" ON public.assets
  FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners insert own assets" ON public.assets
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners update own assets" ON public.assets
  FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners delete own assets" ON public.assets
  FOR DELETE TO authenticated
  USING (auth.uid() = owner_id);

GRANT INSERT, UPDATE, DELETE ON public.assets TO authenticated;

-- updated_at trigger
DROP TRIGGER IF EXISTS assets_set_updated_at ON public.assets;
CREATE TRIGGER assets_set_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Storage policies for asset-thumbnails bucket
CREATE POLICY "Thumbnails readable by anyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'asset-thumbnails');

CREATE POLICY "Users upload own thumbnails"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'asset-thumbnails'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users update own thumbnails"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'asset-thumbnails'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users delete own thumbnails"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'asset-thumbnails'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

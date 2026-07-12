
CREATE TABLE public.creators (
  handle text PRIMARY KEY,
  name text NOT NULL,
  bio text NOT NULL DEFAULT '',
  followers text NOT NULL DEFAULT '0',
  following text NOT NULL DEFAULT '0',
  sales text NOT NULL DEFAULT '$0',
  total_sales integer NOT NULL DEFAULT 0,
  published integer NOT NULL DEFAULT 0,
  rating numeric(3,2) NOT NULL DEFAULT 0,
  verified boolean NOT NULL DEFAULT false,
  joined text NOT NULL DEFAULT '',
  response_time text NOT NULL DEFAULT '',
  tint text NOT NULL DEFAULT 'cyan',
  website text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  achievements text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.creators TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.creators TO authenticated;
GRANT ALL ON public.creators TO service_role;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators are publicly readable" ON public.creators FOR SELECT USING (true);

CREATE TABLE public.assets (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  tc text NOT NULL DEFAULT '00:00:00:00',
  kind text NOT NULL,
  title text NOT NULL,
  handle text NOT NULL REFERENCES public.creators(handle) ON DELETE CASCADE,
  creator text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  original_price numeric(10,2),
  rating numeric(3,2) NOT NULL DEFAULT 0,
  reviews integer NOT NULL DEFAULT 0,
  downloads text NOT NULL DEFAULT '0',
  size text NOT NULL DEFAULT '',
  software text[] NOT NULL DEFAULT '{}',
  updated text NOT NULL DEFAULT '',
  version text NOT NULL DEFAULT '1.0.0',
  img_key text NOT NULL DEFAULT 'lightleaks',
  tint text NOT NULL DEFAULT 'cyan',
  category text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  staff_pick boolean NOT NULL DEFAULT false,
  best_seller boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  flash_deal boolean NOT NULL DEFAULT false,
  description text NOT NULL DEFAULT '',
  search_vector tsvector,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.assets_search_vector_update() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.title,'') || ' ' ||
    coalesce(NEW.description,'') || ' ' ||
    coalesce(NEW.category,'') || ' ' ||
    coalesce(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END; $$;

CREATE TRIGGER assets_search_vector_trg
BEFORE INSERT OR UPDATE ON public.assets
FOR EACH ROW EXECUTE FUNCTION public.assets_search_vector_update();

CREATE INDEX assets_category_idx ON public.assets(category);
CREATE INDEX assets_handle_idx ON public.assets(handle);
CREATE INDEX assets_search_idx ON public.assets USING gin (search_vector);

GRANT SELECT ON public.assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT ALL ON public.assets TO service_role;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Assets are publicly readable" ON public.assets FOR SELECT USING (true);

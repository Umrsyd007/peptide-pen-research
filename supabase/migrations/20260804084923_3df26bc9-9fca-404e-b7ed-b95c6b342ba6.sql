CREATE OR REPLACE FUNCTION public.gen_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE candidate text;
BEGIN
  LOOP
    candidate := lpad((floor(random() * 900000) + 100000)::int::text, 6, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = candidate);
  END LOOP;
  RETURN candidate;
END;
$$;

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE DEFAULT public.gen_order_number(),
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  ship_name TEXT,
  ship_address1 TEXT,
  ship_address2 TEXT,
  ship_city TEXT,
  ship_region TEXT,
  ship_postal TEXT,
  ship_country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

REVOKE EXECUTE ON FUNCTION public.gen_order_number() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.gen_order_number() TO anon, authenticated, service_role;

GRANT SELECT, INSERT ON public.orders TO anon;
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create an order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  variant TEXT,
  price NUMERIC(10,2) NOT NULL,
  qty INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO anon;
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can view items on their orders" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

CREATE INDEX orders_order_number_idx ON public.orders (order_number);
CREATE INDEX order_items_order_id_idx ON public.order_items (order_id);
CREATE TABLE public.cart_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid,
  event_type text NOT NULL,
  product_id text NOT NULL,
  variant text,
  qty integer NOT NULL DEFAULT 0,
  unit_price numeric,
  currency text NOT NULL DEFAULT 'GBP',
  cart_snapshot jsonb NOT NULL DEFAULT '[]'::jsonb,
  ip text,
  country text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cart_events TO authenticated;
GRANT ALL ON public.cart_events TO service_role;
ALTER TABLE public.cart_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_read_cart_events ON public.cart_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));
CREATE INDEX cart_events_created_idx ON public.cart_events (created_at DESC);
CREATE INDEX cart_events_session_idx ON public.cart_events (session_id, created_at DESC);
ALTER TABLE public.orders ADD COLUMN cart_session_id text;
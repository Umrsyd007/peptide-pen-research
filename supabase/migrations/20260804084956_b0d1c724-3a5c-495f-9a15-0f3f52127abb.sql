DROP POLICY "Anyone can create an order" ON public.orders;
DROP POLICY "Anyone can insert order items" ON public.order_items;

REVOKE INSERT ON public.orders FROM anon, authenticated;
REVOKE INSERT ON public.order_items FROM anon, authenticated;
REVOKE SELECT ON public.orders FROM anon;
REVOKE SELECT ON public.order_items FROM anon;

REVOKE EXECUTE ON FUNCTION public.gen_order_number() FROM PUBLIC, anon, authenticated;
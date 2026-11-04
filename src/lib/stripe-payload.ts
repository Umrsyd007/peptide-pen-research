// Pure builder for the minimal data Stripe receives. Only an opaque order
// number, a single total, and currency — no product names, PII, or DB IDs.
export function buildStripePayload(
  order: { order_number: string; currency: string | null; shipping: number | string | null },
  items: { price: number | string; qty: number }[],
  origin: string,
) {
  const currency = (order.currency || "GBP").toLowerCase();
  const itemsCents = items.reduce(
    (s, it) => s + Math.round(Number(it.price) * 100) * it.qty,
    0,
  );
  const shippingCents = Math.round(Number(order.shipping || 0) * 100);
  const ref = order.order_number;
  return {
    mode: "payment" as const,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: itemsCents + shippingCents,
          product_data: { name: `Order #${ref}` },
        },
      },
    ],
    billing_address_collection: "auto" as const,
    client_reference_id: ref,
    metadata: { ref },
    payment_intent_data: { metadata: { ref } },
    return_url: `${origin}/checkout/success/${ref}?session_id={CHECKOUT_SESSION_ID}`,
  };
}

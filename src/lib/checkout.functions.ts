import { createServerFn } from "@tanstack/react-start";
import { getRequestHost, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

export const getStripePublishableKey = createServerFn({
  method: "GET",
}).handler(async () => {
  const key = process.env["STRIPE_PUBLISHABLE_KEY"];
  if (!key) throw new Error("Stripe publishable key is not configured");
  return { key };
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) =>
    z.object({ orderId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id,order_number,email,total,currency,shipping,status")
      .eq("id", data.orderId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("Order not found");
    if (order.status === "paid") throw new Error("Order already paid");

    const { data: items, error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .select("price,qty")
      .eq("order_id", data.orderId);
    if (itemsErr) throw new Error(itemsErr.message);
    if (!items || items.length === 0) throw new Error("Order has no items");

    const secret = process.env["STRIPE_SECRET_KEY"];
    if (!secret) throw new Error("Stripe is not configured");
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secret);

    const forwardedHost = getRequestHeader("x-forwarded-host");
    const host = forwardedHost || getRequestHost();
    const proto = getRequestHeader("x-forwarded-proto") || "https";
    let origin = `${proto}://${host}`;
    if (!host || /^(localhost|127\.0\.0\.1)/i.test(host)) {
      const originHeader = getRequestHeader("origin");
      const referer = getRequestHeader("referer");
      if (originHeader) origin = originHeader;
      else if (referer) {
        try {
          origin = new URL(referer).origin;
        } catch {
          /* keep */
        }
      }
    }

    // Data minimization: Stripe only ever sees an opaque order reference —
    // no product names, doses, or catalog metadata. Every line collapses
    // into a single one-time charge.
    const currency = (order.currency || "USD").toLowerCase();
    const shippingAmount = Math.round(Number(order.shipping) * 100);
    const totalCents = items.reduce(
      (s, it) => s + Math.round(Number(it.price) * 100) * it.qty,
      0,
    );

    type LineItem =
      import("stripe").Stripe.Checkout.SessionCreateParams.LineItem;
    const lineItems: LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: totalCents,
          product_data: { name: `Order #${order.order_number}` },
        },
      },
    ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode:
        "embedded" as import("stripe").Stripe.Checkout.SessionCreateParams.UiMode,
      line_items: lineItems,
      customer_email: order.email,
      client_reference_id: order.order_number,
      metadata: { ref: order.order_number },
      payment_intent_data: { metadata: { ref: order.order_number } },
      return_url: `${origin}/checkout/success/${order.order_number}?session_id={CHECKOUT_SESSION_ID}`,
      ...(shippingAmount > 0
        ? {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount" as const,
                  display_name: "Standard shipping",
                  fixed_amount: { amount: shippingAmount, currency },
                },
              },
            ],
          }
        : {}),
    });

    if (!session.client_secret)
      throw new Error("Stripe did not return a checkout client secret");
    return { clientSecret: session.client_secret, sessionId: session.id };
  });

export const verifyCheckoutSession = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) =>
    z.object({ sessionId: z.string().min(1) }).parse(raw),
  )
  .handler(async ({ data }) => {
    const secret = process.env["STRIPE_SECRET_KEY"];
    if (!secret) throw new Error("Stripe is not configured");
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secret);

    const session = await stripe.checkout.sessions.retrieve(data.sessionId);
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return { paid: false, orderNumber: null as string | null };
    }

    const ref = session.metadata?.["ref"] || session.client_reference_id;
    if (ref) {
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      await supabaseAdmin
        .from("orders")
        .update({ status: "paid" })
        .eq("order_number", ref);
    }

    return { paid: true, orderNumber: ref ?? null };
  });

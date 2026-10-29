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

    const { buildStripePayload } = await import("@/lib/stripe-payload");
    const payload = buildStripePayload(order, items, origin);
    const session = await stripe.checkout.sessions.create({
      ...payload,
      ui_mode:
        "embedded_page" as import("stripe").Stripe.Checkout.SessionCreateParams.UiMode,
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

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_SECRET_KEY"];
        const whSecret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secret || !whSecret) {
          return new Response("Stripe not configured", { status: 500 });
        }

        const sig = request.headers.get("stripe-signature");
        if (!sig) return new Response("Missing signature", { status: 400 });

        const body = await request.text();
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(secret);

        let event: import("stripe").Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(
            body,
            sig,
            whSecret,
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : "bad signature";
          return new Response(`Webhook Error: ${msg}`, { status: 400 });
        }

        const paidEvents = [
          "checkout.session.completed",
          "checkout.session.async_payment_succeeded",
        ];
        const failedEvents = [
          "checkout.session.async_payment_failed",
          "checkout.session.expired",
        ];

        if (paidEvents.includes(event.type) || failedEvents.includes(event.type)) {
          const session = event.data
            .object as import("stripe").Stripe.Checkout.Session;
          const ref = session.metadata?.["ref"] || session.client_reference_id;
          if (ref) {
            const { supabaseAdmin } = await import(
              "@/integrations/supabase/client.server"
            );
            const paid = paidEvents.includes(event.type);
            // Never downgrade an already-paid order (e.g. a late expiry event).
            let q = supabaseAdmin
              .from("orders")
              .update({ status: paid ? "paid" : "failed" })
              .eq("order_number", ref);
            if (!paid) q = q.neq("status", "paid");
            await q;
            if (paid && session.payment_status !== "unpaid") {
              const { notifyOrderPaid } = await import("@/lib/email/order-paid.server");
              await notifyOrderPaid(supabaseAdmin, ref);
            }
          }
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { signOrderToken, verifyOrderToken } from "@/lib/order-token.server";
import { PAYMENT_METHODS, applyDiscount, normalizePhone } from "@/lib/checkout-rules";

const ItemSchema = z.object({
  productId: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  variant: z.string().max(120).optional().default(""),
  price: z.number().min(0).max(100000),
  qty: z.number().int().min(1).max(50),
});

const CreateOrderSchema = z.object({
  email: z.string().trim().email().max(255),
  phone: z.string().max(40).refine((p) => normalizePhone(p) !== null, "Please enter a valid WhatsApp number"),
  payment_method: z.enum(PAYMENT_METHODS),
  discount_code: z.string().trim().max(40).optional().default(""),
  ship_name: z.string().min(1).max(120),
  ship_address1: z.string().min(1).max(200),
  ship_address2: z.string().max(200).optional().default(""),
  ship_city: z.string().min(1).max(120),
  ship_region: z.string().max(120).optional().default(""),
  ship_postal: z.string().min(1).max(30),
  ship_country: z.string().min(2).max(60),
  items: z.array(ItemSchema).min(1).max(50),
  currency: z.enum(["GBP", "USD", "EUR", "CAD", "AUD"]).optional().default("GBP"),
});

export type CreateOrderInput = z.input<typeof CreateOrderSchema>;

export const SHIPPING_FLAT = 0;

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => CreateOrderSchema.parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    // Never trust browser-submitted prices: resolve each line from the catalog.
    const { PRODUCTS } = await import("@/lib/products");
    const { PRODUCT_VARIANTS } = await import("@/lib/product-variants");
    const gbpLines = data.items.map((i) => {
      const product = PRODUCTS.find((p) => p.id === i.productId);
      const variant = PRODUCT_VARIANTS[i.productId]?.find(
        (v) => v.name === i.variant,
      );
      if (!product || !variant) throw new Error("An item in your cart is no longer available. Please re-add it.");
      return { productId: product.id, name: product.name, variant: variant.name, priceGbp: variant.priceNum, qty: i.qty };
    });

    // Catalog is in GBP; convert server-side at the current rate for USD/EUR.
    const { convertGbp } = await import("@/lib/currency");
    let rates: Record<string, number> | null = null;
    if (data.currency !== "GBP") {
      const j = await fetch("https://open.er-api.com/v6/latest/GBP").then((r) => r.json()).catch(() => null);
      rates = j?.rates ?? null;
      if (!rates?.[data.currency]) throw new Error("We couldn't get today's exchange rate. Please try again or pay in GBP.");
    }
    const currency = data.currency;
    const lines = gbpLines.map((l) => ({ ...l, price: convertGbp(l.priceGbp, currency, rates).amount }));
    const subtotal =
      Math.round(lines.reduce((s, i) => s + i.price * i.qty, 0) * 100) / 100;
    const shipping = 0;
    let discountCode: string | null = null;
    let pct = 0;
    if (data.discount_code) {
      const { data: dc } = await supabaseAdmin.from("discount_codes").select("code,percent_off")
        .eq("code", data.discount_code.toUpperCase()).eq("active", true).maybeSingle();
      if (!dc) throw new Error("That discount code isn't valid.");
      discountCode = dc.code; pct = Number(dc.percent_off);
    }
    const { discount, total: afterDiscount } = applyDiscount(subtotal, pct);
    const total = Math.round((afterDiscount + shipping) * 100) / 100;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        email: data.email,
        phone: normalizePhone(data.phone),
        payment_method: data.payment_method,
        discount_code: discountCode,
        discount,
        status: "pending",
        subtotal,
        shipping,
        total,
        currency,
        ship_name: data.ship_name,
        ship_address1: data.ship_address1,
        ship_address2: data.ship_address2 || null,
        ship_city: data.ship_city,
        ship_region: data.ship_region || null,
        ship_postal: data.ship_postal,
        ship_country: data.ship_country,
      })
      .select("id, total, order_number")
      .single();

    if (error || !order) throw new Error(error?.message || "Order failed");

    const rows = lines.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      name: i.name,
      variant: i.variant || null,
      price: i.price,
      qty: i.qty,
    }));
    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .insert(rows);
    if (itemsErr) throw new Error(itemsErr.message);

    const { notifyOrderPending } = await import("@/lib/email/order-paid.server");
    await notifyOrderPending(supabaseAdmin, order.id);

    return {
      id: order.id as string,
      total: Number(order.total),
      currency,
      orderNumber: order.order_number as string,
      token: await signOrderToken(order.id as string),
    };
  });

export const checkDiscountCode = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => z.object({ code: z.string().trim().min(1).max(40) }).parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: dc } = await supabaseAdmin.from("discount_codes").select("code,percent_off")
      .eq("code", data.code.toUpperCase()).eq("active", true).maybeSingle();
    return dc ? { valid: true as const, code: dc.code, percentOff: Number(dc.percent_off) } : { valid: false as const };
  });

export const getPlacedOrder = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => z.object({ id: z.string().uuid(), token: z.string().min(1).max(200) }).parse(raw))
  .handler(async ({ data }) => {
    if (!(await verifyOrderToken(data.id, data.token))) throw new Error("Order not found");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: o } = await supabaseAdmin.from("orders")
      .select("order_number,email,phone,payment_method,ship_name,ship_address1,ship_address2,ship_city,ship_region,ship_postal,ship_country,subtotal,discount,discount_code,shipping,total,currency,order_items(name,variant,price,qty)")
      .eq("id", data.id).maybeSingle();
    if (!o) throw new Error("Order not found");
    return {
      ...o,
      subtotal: Number(o.subtotal), discount: Number(o.discount), shipping: Number(o.shipping), total: Number(o.total),
      order_items: (o.order_items ?? []).map((i) => ({ ...i, price: Number(i.price) })),
    };
  });

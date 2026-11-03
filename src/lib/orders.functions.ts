import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ItemSchema = z.object({
  productId: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  variant: z.string().max(120).optional().default(""),
  price: z.number().min(0).max(100000),
  qty: z.number().int().min(1).max(50),
});

const CreateOrderSchema = z.object({
  email: z.string().email().max(255),
  ship_name: z.string().min(1).max(120),
  ship_address1: z.string().min(1).max(200),
  ship_address2: z.string().max(200).optional().default(""),
  ship_city: z.string().min(1).max(120),
  ship_region: z.string().min(1).max(120),
  ship_postal: z.string().min(1).max(30),
  ship_country: z.string().min(2).max(60),
  items: z.array(ItemSchema).min(1).max(50),
});

export type CreateOrderInput = z.input<typeof CreateOrderSchema>;

export const SHIPPING_FLAT = 0;

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => CreateOrderSchema.parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const subtotal =
      Math.round(data.items.reduce((s, i) => s + i.price * i.qty, 0) * 100) /
      100;
    const shipping = 0;
    const total = Math.round((subtotal + shipping) * 100) / 100;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        email: data.email,
        status: "pending",
        subtotal,
        shipping,
        total,
        currency: "USD",
        ship_name: data.ship_name,
        ship_address1: data.ship_address1,
        ship_address2: data.ship_address2 || null,
        ship_city: data.ship_city,
        ship_region: data.ship_region,
        ship_postal: data.ship_postal,
        ship_country: data.ship_country,
      })
      .select("id, total, order_number")
      .single();

    if (error || !order) throw new Error(error?.message || "Order failed");

    const rows = data.items.map((i) => ({
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
      orderNumber: order.order_number as string,
    };
  });

export const getOrderByNumber = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) =>
    z.object({ number: z.string().regex(/^\d{6}$/) }).parse(raw),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id,order_number,email,status,subtotal,shipping,total,currency,ship_name,ship_city,ship_region,ship_postal,ship_country,created_at",
      )
      .eq("order_number", data.number)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) return null;
    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("product_id,name,variant,price,qty")
      .eq("order_id", order.id);
    return { order, items: items || [] };
  });

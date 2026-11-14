import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { catalogPrice, clientIpFrom, CART_EVENTS_PER_MINUTE } from "@/lib/cart-events";

const Line = z.object({ productId: z.string().max(120), variant: z.string().max(120), qty: z.number().int().min(0).max(50) });
const EventSchema = z.object({
  sessionId: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
  type: z.enum(["add", "update", "remove"]),
  productId: z.string().min(1).max(120),
  variant: z.string().max(120),
  qty: z.number().int().min(0).max(50),
  currency: z.enum(["GBP", "USD", "EUR"]).default("GBP"),
  cart: z.array(Line).max(50),
});

export const logCartEvent = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => EventSchema.parse(raw))
  .handler(async ({ data }) => {
    const price = catalogPrice(data.productId, data.variant);
    if (price === null) return { ok: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - 60_000).toISOString();
    const { count } = await supabaseAdmin.from("cart_events").select("id", { count: "exact", head: true })
      .eq("session_id", data.sessionId).gte("created_at", since);
    if ((count ?? 0) >= CART_EVENTS_PER_MINUTE) return { ok: false };
    const snapshot = data.cart
      .map((l) => ({ ...l, priceGbp: catalogPrice(l.productId, l.variant) }))
      .filter((l) => l.priceGbp !== null);
    const { error } = await supabaseAdmin.from("cart_events").insert({
      session_id: data.sessionId,
      user_id: data.userId ?? null,
      event_type: data.type,
      product_id: data.productId,
      variant: data.variant,
      qty: data.qty,
      unit_price: price,
      currency: "GBP",
      cart_snapshot: snapshot,
      ip: clientIpFrom((n) => getRequestHeader(n)),
      country: getRequestHeader("cf-ipcountry")?.slice(0, 8) ?? null,
      user_agent: getRequestHeader("user-agent")?.slice(0, 400) ?? null,
    });
    if (error) console.error("[cart-events]", error.message);
    return { ok: !error };
  });

const ListSchema = z.object({ search: z.string().max(100).default(""), page: z.number().int().min(1).max(10000).default(1) });

export const listCartEvents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => ListSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const { data: role } = await sb.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!role) throw new Error("Forbidden");
    let q = sb.from("cart_events")
      .select("id, created_at, session_id, event_type, product_id, variant, qty, unit_price, cart_snapshot, ip, country, user_agent", { count: "exact" })
      .order("created_at", { ascending: false });
    const s = data.search.trim().replace(/[%,()*]/g, "");
    if (s) q = q.or(`ip.ilike.%${s}%,product_id.ilike.%${s}%,session_id.ilike.%${s}%,variant.ilike.%${s}%`);
    const from = (data.page - 1) * 50;
    const { data: rows, count, error } = await q.range(from, from + 49);
    if (error) throw new Error(error.message);
    return { rows: (rows ?? []).map((r) => ({ ...r, unit_price: r.unit_price == null ? null : Number(r.unit_price), cart_snapshot: r.cart_snapshot as any })), total: count ?? 0 };
  });

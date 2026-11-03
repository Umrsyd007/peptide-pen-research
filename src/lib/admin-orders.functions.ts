import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { periodStart, summarizeOrders } from "@/lib/admin-orders";

const PAGE_SIZE = 25;

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

const ListSchema = z.object({
  period: z.enum(["today", "7d", "30d"]),
  status: z.enum(["all", "paid", "pending", "failed"]),
  search: z.string().max(100).default(""),
  page: z.number().int().min(1).max(10000).default(1),
});

export const listAdminOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => ListSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    await assertAdmin(sb, context.userId);
    const since = periodStart(data.period).toISOString();

    // Summary cards: all orders in period.
    const { data: periodRows, error: e1 } = await sb
      .from("orders")
      .select("status, total, order_items(qty)")
      .gte("created_at", since)
      .limit(10000);
    if (e1) throw new Error(e1.message);
    const summary = summarizeOrders(
      (periodRows ?? []).map((o: any) => ({
        status: o.status,
        total: Number(o.total),
        items: (o.order_items ?? []).reduce((s: number, i: any) => s + i.qty, 0),
      })),
    );

    let q = sb
      .from("orders")
      .select(
        "id, order_number, created_at, email, ship_name, ship_address1, ship_address2, ship_city, ship_region, ship_postal, ship_country, status, subtotal, shipping, total, currency, order_items(name, variant, price, qty)",
        { count: "exact" },
      )
      .gte("created_at", since)
      .order("created_at", { ascending: false });
    if (data.status === "failed") q = q.in("status", ["failed", "expired"]);
    else if (data.status !== "all") q = q.eq("status", data.status);
    const s = data.search.trim().replace(/[%,()*]/g, "");
    if (s) q = q.or(`order_number.ilike.%${s}%,email.ilike.%${s}%,ship_name.ilike.%${s}%`);
    const from = (data.page - 1) * PAGE_SIZE;
    const { data: rows, count, error } = await q.range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);

    return {
      summary,
      orders: (rows ?? []).map((o: any) => ({
        ...o,
        subtotal: Number(o.subtotal),
        shipping: Number(o.shipping),
        total: Number(o.total),
        order_items: (o.order_items ?? []).map((i: any) => ({ ...i, price: Number(i.price) })),
      })) as AdminOrder[],
      total: count ?? 0,
      pageCount: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
    };
  });

export type AdminOrder = {
  id: string;
  order_number: string;
  created_at: string;
  email: string;
  ship_name: string | null;
  ship_address1: string | null;
  ship_address2: string | null;
  ship_city: string | null;
  ship_region: string | null;
  ship_postal: string | null;
  ship_country: string | null;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  order_items: { name: string; variant: string | null; price: number; qty: number }[];
};

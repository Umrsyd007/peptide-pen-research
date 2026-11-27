import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import md5 from "npm:js-md5@0.7.3";

function timingSafeEqualHex(a: string, b: string): boolean {
  const left = a.trim().toLowerCase();
  const right = b.trim().toLowerCase();
  if (left.length === 0 || left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i++) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const privateKey = Deno.env.get("MOUNODE_PRIVATE_KEY") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!privateKey || !supabaseUrl || !serviceRoleKey) {
      return new Response("Server Misconfigured", { status: 500 });
    }

    const url = new URL(req.url);
    const receivedVt = url.searchParams.get("vt") ?? "";

    const rawText = await req.text();
    const params = new URLSearchParams(rawText);
    const orderId = (params.get("order_id") ?? "").trim();
    const isSuccess = (params.get("is_success") ?? "").trim();

    if (!orderId) {
      return new Response("Missing order_id", { status: 400 });
    }

    const expectedVt = md5(`${orderId}${privateKey}`).toLowerCase();
    if (!timingSafeEqualHex(receivedVt, expectedVt)) {
      return new Response("Forbidden", { status: 403 });
    }

    if (isSuccess === "1") {
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      const { error } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("order_number", orderId)
        .eq("status", "pending");

      if (error) {
        return new Response("Database Error", { status: 500 });
      }
    }

    return new Response("200", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new Response("Error", { status: 500 });
  }
});
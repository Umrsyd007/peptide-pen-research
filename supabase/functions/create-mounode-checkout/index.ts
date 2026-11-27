import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import md5 from "npm:js-md5@0.7.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function sanitizeOrderNumber(raw?: string): string {
  const cleaned = (raw || "").replace(/[^A-Za-z0-9_]/g, "");
  if (cleaned.length >= 4) return cleaned;
  const rand = crypto.randomUUID().replace(/[^A-Za-z0-9]/g, "").slice(0, 8).toUpperCase();
  return `ORD_${Date.now()}_${rand}`;
}

function splitName(fullName?: string): { firstName: string; lastName: string } {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Customer", lastName: "Order" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "Customer" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function getClientIp(req: Request, bodyIp?: string): string {
  const cfIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;
  const xff = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (xff) return xff;
  return (bodyIp || "").trim() || "0.0.0.0";
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const apiUser = Deno.env.get("MOUNODE_API_USER") ?? "";
    const privateKey = Deno.env.get("MOUNODE_PRIVATE_KEY") ?? "";
    const gatewayUrl =
      Deno.env.get("MOUNODE_GATEWAY_URL") ?? "https://hearmonic.com/create_payment/custom";
    const siteADomain = Deno.env.get("SITE_A_DOMAIN") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!apiUser || !privateKey || !siteADomain || !supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Missing server configuration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const orderNumber = sanitizeOrderNumber(payload.order_number);
    const currency = String(payload.currency || "USD").toUpperCase();
    const subtotalNum = Number(payload.subtotal ?? payload.total ?? 0);
    const shippingNum = Number(payload.shipping ?? 0);
    const discountNum = Number(payload.discount ?? 0);
    const totalNum = Number(payload.total ?? subtotalNum + shippingNum - discountNum);
    const formattedAmount = totalNum.toFixed(2);

    const { firstName, lastName } = splitName(payload.ship_name);
    const email = String(payload.email || "").trim();
    const items = Array.isArray(payload.items) ? payload.items : [];

    const { error: dbError } = await supabase
      .from("orders")
      .upsert(
        {
          user_id: payload.user_id ?? null,
          order_number: orderNumber,
          email,
          status: "pending",
          subtotal: subtotalNum,
          shipping: shippingNum,
          discount: discountNum,
          discount_code: payload.discount_code ?? null,
          total: totalNum,
          currency,
          ship_name: payload.ship_name || `${firstName} ${lastName}`,
          ship_address1: payload.ship_address1 || "",
          ship_address2: payload.ship_address2 || "",
          ship_city: payload.ship_city || "",
          ship_region: payload.ship_region || "",
          ship_postal: payload.ship_postal || "",
          ship_country: payload.ship_country || "US",
          phone: payload.phone || "",
          payment_method: "paypal",
          cart_session_id: payload.cart_session_id ?? null,
        },
        { onConflict: "order_number" },
      );

    if (dbError) {
      return new Response(JSON.stringify({ error: dbError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sign = md5(`${apiUser}${privateKey}${currency}${formattedAmount}${orderNumber}`).toLowerCase();
    const vt = md5(`${orderNumber}${privateKey}`).toLowerCase();

    const projectRefMatch = supabaseUrl.match(/^https:\/\/([^.]+)\.supabase\.co/);
    const projectRef = projectRefMatch ? projectRefMatch[1] : "";
    const notifyUrl = `https://${projectRef}.supabase.co/functions/v1/mounode-notify?vt=${vt}`;
    const successUrl =
      payload.order_success_uri || `https://${siteADomain}/checkout/success?order=${orderNumber}`;
    const returnUrl = payload.order_return_uri || `https://${siteADomain}/checkout/cancel`;

    const formBody = new URLSearchParams({
      api_user: apiUser,
      website: siteADomain,
      order_id: orderNumber,
      order_currency: currency,
      order_amount: formattedAmount,
      pay: "paypal",
      sign,
      order_product: JSON.stringify(items),
      order_return_uri: returnUrl,
      order_success_uri: successUrl,
      order_notify_uri: notifyUrl,
      ip: getClientIp(req, payload.ip),
      billing_first_name: firstName,
      billing_last_name: lastName,
      billing_address1: String(payload.ship_address1 || ""),
      billing_city: String(payload.ship_city || ""),
      billing_country: String(payload.ship_country || "US"),
      billing_zip: String(payload.ship_postal || ""),
      billing_email: email,
      reorder: "reorder",
      jump: "1",
    });

    const gwRes = await fetch(gatewayUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody.toString(),
    });

    const gwData = await gwRes.json();
    if (Number(gwData?.code) === 1 && gwData?.linkform) {
      return new Response(
        JSON.stringify({ linkform: gwData.linkform, order_number: orderNumber }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ error: gwData?.msg || "Gateway rejected order", details: gwData }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
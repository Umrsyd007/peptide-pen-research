import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import md5 from "js-md5";

export type MouNodeCheckoutInput = {
  order_number: string;
  email: string;
  phone?: string;
  ship_name: string;
  ship_address1: string;
  ship_address2?: string;
  ship_city: string;
  ship_region?: string;
  ship_postal: string;
  ship_country: string;
  subtotal: number;
  shipping?: number;
  discount?: number;
  total: number;
  currency?: string;
  items: Array<{
    productId?: string;
    name: string;
    variant?: string;
    price: string | number;
    qty: number;
  }>;
  order_success_uri?: string;
  order_return_uri?: string;
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

function getClientIp(headers: Headers): string {
  const cfIp = headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;
  const xff = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (xff) return xff;
  return "0.0.0.0";
}

export const createMouNodeCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: MouNodeCheckoutInput) => data)
  .handler(async ({ data: payload }) => {
    const apiUser = process.env.MOUNODE_API_USER ?? "";
    const privateKey = process.env.MOUNODE_PRIVATE_KEY ?? "";
    const gatewayUrl =
      process.env.MOUNODE_GATEWAY_URL ?? "https://hearmonic.com/create_payment/custom";
    const siteADomain = process.env.SITE_A_DOMAIN ?? "getpeptidepen.com";

    if (!apiUser || !privateKey) {
      throw new Error("Missing MOUNODE_API_USER or MOUNODE_PRIVATE_KEY on server.");
    }

    const orderNumber = sanitizeOrderNumber(payload.order_number);
    const currency = String(payload.currency || "USD").toUpperCase();
    const totalNum = Number(payload.total ?? payload.subtotal ?? 0);
    const formattedAmount = totalNum.toFixed(2);
    const { firstName, lastName } = splitName(payload.ship_name);
    const email = String(payload.email || "").trim();
    const items = Array.isArray(payload.items) ? payload.items : [];

    const sign = md5(`${apiUser}${privateKey}${currency}${formattedAmount}${orderNumber}`).toLowerCase();
    const vt = md5(`${orderNumber}${privateKey}`).toLowerCase();

    const notifyUrl = `https://${siteADomain}/api/mounode-notify?vt=${vt}`;
    const successUrl =
      payload.order_success_uri || `https://${siteADomain}/checkout/success/${orderNumber}`;
    const returnUrl = payload.order_return_uri || `https://${siteADomain}/checkout/cancel`;

    const headers = getRequestHeaders();

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
      ip: getClientIp(headers),
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
      return {
        linkform: String(gwData.linkform),
        order_number: orderNumber,
      };
    }

    throw new Error(gwData?.msg || "Gateway rejected order");
  });
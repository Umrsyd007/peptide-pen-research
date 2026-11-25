// Server-only HMAC tokens proving the caller created a given order.
async function key() {
  const secret = process.env["ORDER_TOKEN_SECRET"] || process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!secret) throw new Error("Order token secret is not configured");
  return crypto.subtle.importKey("raw", new TextEncoder().encode(`order-token:${secret}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
const toHex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

export async function signOrderToken(orderId: string): Promise<string> {
  return toHex(await crypto.subtle.sign("HMAC", await key(), new TextEncoder().encode(orderId)));
}

export async function verifyOrderToken(orderId: string, token: string): Promise<boolean> {
  if (!/^[0-9a-f]{64}$/.test(token)) return false;
  const bytes = new Uint8Array(token.match(/../g)!.map((h) => parseInt(h, 16)));
  return crypto.subtle.verify("HMAC", await key(), bytes, new TextEncoder().encode(orderId));
}

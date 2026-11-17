import { isDisposableEmail } from "./email-check";

async function hasRecord(name: string, type: "MX" | "A"): Promise<boolean> {
  const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, {
    headers: { accept: "application/dns-json" },
  });
  if (!r.ok) throw new Error("dns");
  const j = (await r.json()) as { Status: number; Answer?: { type: number; data: string }[] };
  const code = type === "MX" ? 15 : 1;
  return (j.Answer ?? []).some((a) => a.type === code && !(type === "MX" && /^0\s+\.?$/.test(a.data.trim())));
}

/** null when OK, otherwise a customer-facing reason. Lookup failures let the address through. */
export async function checkEmailDeliverable(email: string): Promise<string | null> {
  if (isDisposableEmail(email)) return "Please use a permanent email address, not a temporary one.";
  const domain = email.trim().toLowerCase().split("@")[1];
  if (!domain) return "Please enter a valid email address";
  try {
    if (await hasRecord(domain, "MX")) return null;
    if (await hasRecord(domain, "A")) return null;
    return "This email address can't receive mail. Please check it.";
  } catch {
    return null;
  }
}

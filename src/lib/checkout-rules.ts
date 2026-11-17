import { z } from "zod";

export const PAYMENT_METHODS = ["whatsapp", "card", "bank", "usdt"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  whatsapp: "Pay via WhatsApp",
  card: "Debit/Credit Card",
  bank: "Bank Transfer",
  usdt: "USDT (Crypto)",
};

/** International phone: optional +, 8–15 digits once spaces, dashes, dots and brackets are removed. */
export function normalizePhone(raw: string): string | null {
  const t = raw.trim();
  if (!/^\+?[\d\s\-().]+$/.test(t)) return null;
  const digits = t.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15 || digits.startsWith("0") && !t.startsWith("+") && digits.length < 10) return null;
  return (t.startsWith("+") ? "+" : "") + digits;
}

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters").max(120),
  email: z.string().trim().max(255).email("Please enter a valid email address")
    .refine((e) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e), "Please enter a valid email address"),
  phone: z.string().refine((p) => normalizePhone(p) !== null, "Please enter a valid WhatsApp number"),
});

export const addressSchema = z.object({
  address1: z.string().trim().min(1, "Address is required").max(200),
  address2: z.string().trim().max(200),
  city: z.string().trim().min(1, "City is required").max(120),
  postal: z.string().trim().min(1, "Postcode/Zip is required").max(30),
  country: z.string().trim().min(2, "Please select a country").max(60),
});

/** Percent discount rounded to pennies; never below zero. */
export function applyDiscount(subtotal: number, percentOff: number) {
  const pct = Math.min(100, Math.max(0, percentOff));
  const discount = Math.round(subtotal * pct) / 100;
  return { discount, total: Math.max(0, Math.round((subtotal - discount) * 100) / 100) };
}

import { z } from "zod";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

export const PAYMENT_METHODS = ["whatsapp", "card", "bank", "usdt"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  whatsapp: "Pay via WhatsApp",
  card: "Debit/Credit Card",
  bank: "Bank Transfer",
  usdt: "USDT (Crypto)",
};

/** Local number + country -> full international number (E.164), or null if invalid for that country. */
export function normalizePhone(country: string, national: string): string | null {
  if (!/^[\d\s\-().+]+$/.test(national.trim())) return null;
  const p = parsePhoneNumberFromString(national, country.toUpperCase() as CountryCode);
  return p && p.isValid() ? p.number : null;
}

/** Already-international number (as stored/sent to the server). */
export function isValidIntlPhone(e164: string): boolean {
  const p = parsePhoneNumberFromString(e164);
  return !!p && p.isValid() && p.number === e164;
}

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters").max(120),
  email: z.string().trim().max(255).email("Please enter a valid email address")
    .refine((e) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e), "Please enter a valid email address"),
  phoneCountry: z.string().length(2, "Choose your country code"),
  phone: z.string(),
}).superRefine((v, ctx) => {
  if (normalizePhone(v.phoneCountry, v.phone) === null)
    ctx.addIssue({ code: "custom", path: ["phone"], message: "Please enter a valid phone number for this country" });
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

import type { PaymentMethod } from "@/lib/checkout-rules";

export const MESSAGE_METHOD_LABEL: Record<PaymentMethod, string> = {
  whatsapp: "WhatsApp",
  card: "Card / Payment Link",
  bank: "Bank Transfer",
  usdt: "USDT (Crypto)",
};

export const MESSAGE_CLOSING: Record<PaymentMethod, string> = {
  whatsapp: "I'd like to arrange payment for this order.",
  card: "Please send the secure payment link for this order.",
  bank: "Please send the bank transfer details for this order.",
  usdt: "Please send the USDT wallet address and amount for this order.",
};

export type MessageOrder = {
  order_number: string;
  total: number;
  currency: string;
  order_items: { qty: number }[];
};

/** Pre-filled chat message (WhatsApp or SMS). Never includes product names. */
export function buildOrderMessage(o: MessageOrder, method: PaymentMethod, fmt: (n: number, c: string) => string, paymentLink?: string | null): string {
  const n = o.order_items.reduce((s, i) => s + i.qty, 0);
  return [
    `Order #${o.order_number}`,
    `${n} item${n === 1 ? "" : "s"}`,
    "",
    `Total ${fmt(o.total, o.currency)}`,
    `Payment method: ${MESSAGE_METHOD_LABEL[method] ?? method}`,
    ...(paymentLink ? [`Payment link: ${paymentLink}`] : []),
    "____________________",
    MESSAGE_CLOSING[method] ?? MESSAGE_CLOSING.card,
  ].join("\n");
}

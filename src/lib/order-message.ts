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
  order_items: { qty: number; name: string; variant?: string | null; price: number }[];
};

/** Pre-filled chat message sent to the store after checkout (WhatsApp or SMS). */
export function buildOrderMessage(o: MessageOrder, method: PaymentMethod, fmt: (n: number, c: string) => string): string {
  const items = o.order_items.map((i) => ` • ${i.qty}x ${i.name}${i.variant ? ` ${i.variant}` : ""} ${fmt(i.price * i.qty, o.currency)}`);
  return [
    `Order #${o.order_number}`,
    ...items,
    "",
    `Total ${fmt(o.total, o.currency)}`,
    `Payment method: ${MESSAGE_METHOD_LABEL[method] ?? method}`,
    "____________________",
    MESSAGE_CLOSING[method] ?? MESSAGE_CLOSING.card,
  ].join("\n");
}

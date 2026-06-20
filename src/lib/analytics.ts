// GA4 / GTM dataLayer helpers. Safe to call from anywhere; no-op on SSR.
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

function push(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

// Direct GA4 send (in addition to the dataLayer push) so events reach GA4
// even when the GTM container has no matching custom-event trigger.
function gtagEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
  currency?: string;
}

export function trackPageView(args: { path: string; title?: string }) {
  push({ ecommerce: null });
  push({
    event: "page_view",
    page_path: args.path,
    page_location: typeof window !== "undefined" ? window.location.href : args.path,
    page_title: args.title ?? (typeof document !== "undefined" ? document.title : ""),
  });
}

export function trackViewItem(item: AnalyticsItem) {
  push({ ecommerce: null });
  push({
    event: "view_item",
    ecommerce: {
      currency: item.currency ?? "USD",
      value: (item.price ?? 0) * (item.quantity ?? 1),
      items: [{ ...item, quantity: item.quantity ?? 1 }],
    },
  });
}

export function trackAddToCart(item: AnalyticsItem) {
  push({ ecommerce: null });
  push({
    event: "add_to_cart",
    ecommerce: {
      currency: item.currency ?? "USD",
      value: (item.price ?? 0) * (item.quantity ?? 1),
      items: [{ ...item, quantity: item.quantity ?? 1 }],
    },
  });
}

export function trackBeginCheckout(args: {
  items: AnalyticsItem[];
  value: number;
  currency?: string;
}) {
  push({ ecommerce: null });
  push({
    event: "begin_checkout",
    ecommerce: {
      currency: args.currency ?? "USD",
      value: args.value,
      items: args.items,
    },
  });
}

export function trackPurchase(args: {
  transaction_id: string;
  items: AnalyticsItem[];
  value: number;
  currency?: string;
}) {
  push({ ecommerce: null });
  push({
    event: "purchase",
    ecommerce: {
      transaction_id: args.transaction_id,
      currency: args.currency ?? "USD",
      value: args.value,
      items: args.items,
    },
  });
}

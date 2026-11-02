import { permission } from "./tracking-consent";

export const GOOGLE_ADS_ID = "AW-18256993745";
export const GOOGLE_PURCHASE_EVENT = "conversion_event_purchase_1";
const GA4_ID = "G-1LLX7CCVZL";
let installed = false;
let analyticsConfigured = false;
let adsConfigured = false;
export function syncGoogleTracking() {
  const analytics = permission("analytics");
  const advertising = permission("advertising");
  window.dataLayer ??= [];
  window.gtag ??= function (..._args: unknown[]) {
    // Google requires Arguments objects rather than arrays in its queue.
    window.dataLayer?.push(arguments as unknown as Record<string, unknown>);
  };
  if (!installed) {
    window.gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
    window.gtag("set", "ads_data_redaction", true);
  }
  window.gtag("consent", "update", { analytics_storage: analytics ? "granted" : "denied", ad_storage: advertising ? "granted" : "denied", ad_user_data: advertising ? "granted" : "denied", ad_personalization: "denied" });
  if (!analytics && !advertising) return;
  if (!installed) {
    installed = true;
    window.gtag("js", new Date());
    window.gtag("set", "developer_id.dZjgwMW", true);
    const script = document.createElement("script");
    script.id = "google-tracking";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analytics ? GA4_ID : GOOGLE_ADS_ID}`;
    document.head.appendChild(script);
  }
  if (analytics && !analyticsConfigured) {
    analyticsConfigured = true;
    window.gtag("config", GA4_ID, { send_page_view: false, allow_google_signals: false });
  }
  if (advertising && !adsConfigured) {
    adsConfigured = true;
    // GT-KVFVCLQ4 is an alias of this destination, not a second installation.
    window.gtag("config", GOOGLE_ADS_ID, { allow_ad_personalization_signals: false });
  }
}
export function sendAnalytics(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined" || !permission("analytics")) return;
  window.gtag?.("event", name, { ...params, send_to: GA4_ID });
}
export function sendPaidPurchase(args: { transaction_id: string; value: number; currency: string; permittedAtPayment: boolean }) {
  if (typeof window === "undefined" || !args.permittedAtPayment || !permission("advertising") || typeof window.gtag !== "function") return false;
  const key = `google-purchase:${args.transaction_id}`;
  if (localStorage.getItem(key)) return false;
  window.gtag("event", GOOGLE_PURCHASE_EVENT, { transaction_id: args.transaction_id, value: args.value, currency: args.currency, send_to: GOOGLE_ADS_ID });
  localStorage.setItem(key, "sent");
  return true;
}
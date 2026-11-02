import { beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_KEY, CONSENT_VERSION, measurementPermission, permission, consentContext } from "./tracking-consent";
import { sendAnalytics, sendPaidPurchase, syncGoogleTracking } from "./google-tracking";

describe("limited cookieless measurement", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => store.set(key, value) });
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("window", { gtag: vi.fn() });
    vi.stubGlobal("document", { createElement: () => ({}), head: { appendChild: vi.fn() } });
  });
  function refuse() {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ visitor: "test", version: CONSENT_VERSION, analytics: false, advertising: false }));
  }
  it("allows limited signals before choice but not cookie storage in an unresolved region", () => {
    expect(permission("analytics")).toBe(false);
    expect(permission("advertising")).toBe(false);
    expect(measurementPermission("analytics")).toBe(true);
    expect(consentContext().measurement).toBe(true);
    syncGoogleTracking();
    expect(window.gtag).toHaveBeenCalledWith("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
    expect(document.head.appendChild).toHaveBeenCalledTimes(1);
  });
  it("omits item detail from pre-choice shopping signals", () => {
    sendAnalytics("add_to_cart", { currency: "USD", value: 165.29, items: [{ item_name: "private product" }] });
    expect(window.gtag).toHaveBeenCalledExactlyOnceWith("event", "add_to_cart", { currency: "USD", value: 165.29, send_to: "G-1LLX7CCVZL" });
  });
  it("sends an eligible paid cookieless purchase once with its actual amount", () => {
    const args = { transaction_id: "482913", value: 165.29, currency: "USD", permittedAtPayment: true };
    expect(sendPaidPurchase(args)).toBe(true);
    expect(sendPaidPurchase(args)).toBe(false);
    expect(window.gtag).toHaveBeenCalledExactlyOnceWith("event", "conversion_event_purchase_1", { transaction_id: "482913", value: 165.29, currency: "USD", send_to: "AW-18256993745" });
  });
  it("blocks cookieless events after explicit refusal", () => {
    refuse();
    sendAnalytics("page_view", {});
    expect(measurementPermission("advertising")).toBe(false);
    expect(sendPaidPurchase({ transaction_id: "482913", value: 165.29, currency: "USD", permittedAtPayment: true })).toBe(false);
    expect(window.gtag).not.toHaveBeenCalled();
  });
  it("honors browser opt-outs before any choice", () => {
    vi.stubGlobal("navigator", { globalPrivacyControl: true });
    expect(measurementPermission("analytics")).toBe(false);
    expect(measurementPermission("advertising")).toBe(false);
  });
  it("does not replay a purchase blocked at payment", () => {
    expect(sendPaidPurchase({ transaction_id: "482913", value: 165.29, currency: "USD", permittedAtPayment: false })).toBe(false);
    expect(window.gtag).not.toHaveBeenCalled();
  });
});
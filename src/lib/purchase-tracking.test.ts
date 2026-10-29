import { describe, it, expect, vi, beforeEach } from "vitest";
import { paidPurchase } from "./paid-purchase";
import { requiresConsent, CONSENT_KEY, CONSENT_VERSION } from "./tracking-consent";
import { sendPaidPurchase } from "./google-tracking";
const paid = { payment_status: "paid", metadata: { ref: "482913" }, amount_total: 16529, currency: "usd" };
describe("purchase measurement", () => {
  beforeEach(() => {
    const store = new Map<string,string>();
    vi.stubGlobal("localStorage", { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => store.set(key, value) });
    vi.stubGlobal("window", { gtag: vi.fn() });
    vi.stubGlobal("navigator", {});
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ visitor: "test", version: CONSENT_VERSION, analytics: true, advertising: true }));
  });
  it("reports the real paid amount, currency and opaque reference", () => { expect(paidPurchase(paid)).toEqual({ transaction_id: "482913", value: 165.29, currency: "USD" }); });
  it("does not report an unpaid completed session", () => { expect(paidPurchase({ ...paid, payment_status: "unpaid" })).toBeNull(); });
  it("uses the exact supplied Google purchase event once per order", () => {
    const args = { transaction_id: "482913", value: 165.29, currency: "USD", permittedAtPayment: true };
    expect(sendPaidPurchase(args)).toBe(true);
    expect(sendPaidPurchase(args)).toBe(false);
    expect(window.gtag).toHaveBeenCalledExactlyOnceWith("event", "conversion_event_purchase_1", { transaction_id: "482913", value: 165.29, currency: "USD", send_to: "AW-18256993745" });
  });
  it("never replays a purchase blocked at confirmation", () => { expect(sendPaidPurchase({ transaction_id: "482913", value: 165.29, currency: "USD", permittedAtPayment: false })).toBe(false); expect(window.gtag).not.toHaveBeenCalled(); });
  it("honors advertising withdrawal", () => { localStorage.setItem(CONSENT_KEY, JSON.stringify({ visitor: "test", version: CONSENT_VERSION, analytics: true, advertising: false })); expect(sendPaidPurchase({ transaction_id: "482913", value: 165.29, currency: "USD", permittedAtPayment: true })).toBe(false); });
  it("requires consent in regulated and unresolved regions", () => { expect(requiresConsent("DE")).toBe(true); expect(requiresConsent("XX")).toBe(true); expect(requiresConsent("T1")).toBe(true); expect(requiresConsent("US")).toBe(false); });
});
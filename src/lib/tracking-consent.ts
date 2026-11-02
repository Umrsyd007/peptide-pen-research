export const CONSENT_VERSION = "2026-10-29-v1";
export const CONSENT_NOTICE = "Google Analytics measures visits and shopping activity. Google Ads receives page visits, advertising click identifiers, and paid purchase references, amounts and currencies for advertising measurement and optimization. No customer matching is enabled. You can reject optional tracking or change your choice in Cookie settings.";
export const CONSENT_KEY = "peptidepen-consent";
const REQUIRED = new Set("AT BE BG HR CY CZ DK EE FI FR DE GR HU IS IE IT LV LI LT LU MT NL NO PL PT RO SK SI ES SE GB CH".split(" "));
export interface ConsentRecord {
  visitor: string;
  at: string;
  version: string;
  notice: string;
  region: string;
  analytics: boolean;
  advertising: boolean;
}
let region = "XX";
let lookup: Promise<string> | undefined;

export function requiresConsent(country: string) {
  return !/^[A-Z]{2}$/.test(country) || country === "XX" || country === "T1" || REQUIRED.has(country);
}
export function readConsent(): ConsentRecord | undefined {
  if (typeof window === "undefined") return;
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    if (!raw || typeof raw !== "object") return;
    const r = raw as Partial<ConsentRecord>;
    if (r.version !== CONSENT_VERSION || typeof r.analytics !== "boolean" || typeof r.advertising !== "boolean" || typeof r.visitor !== "string") return;
    return r as ConsentRecord;
  } catch { return; }
}
export function permission(kind: "analytics" | "advertising") {
  if (typeof window === "undefined") return false;
  if (navigator.globalPrivacyControl === true) return false;
  const choice = readConsent();
  return choice ? choice[kind] : !requiresConsent(region);
}
export function consentContext() {
  return { region, choice: readConsent() ?? null, advertising: permission("advertising") };
}
export function saveConsent(analytics: boolean, advertising: boolean) {
  const previous = readConsent();
  const record: ConsentRecord = { visitor: previous?.visitor ?? crypto.randomUUID(), at: new Date().toISOString(), version: CONSENT_VERSION, notice: CONSENT_NOTICE, region, analytics, advertising };
  // Preserve acceptance evidence when a visitor later withdraws.
  const history: ConsentRecord[] = JSON.parse(localStorage.getItem(`${CONSENT_KEY}-history`) || "[]");
  localStorage.setItem(`${CONSENT_KEY}-history`, JSON.stringify([...history, record]));
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  window.dispatchEvent(new Event("tracking-consent-change"));
}
export function resolveRegion() {
  lookup ??= (async () => {
    try {
      const response = await fetch("/cdn-cgi/trace", { signal: AbortSignal.timeout(2000) });
      if (!response.ok) return region;
      const fields = Object.fromEntries((await response.text()).trim().split("\n").map(line => line.split("=")));
      if (fields["h"] !== window.location.host) return region;
      const country = fields["loc"] ?? "XX";
      region = /^[A-Z]{2}$/.test(country) ? country : "XX";
    } catch { /* Unknown location requires consent. */ }
    return region;
  })();
  return lookup;
}

declare global { interface Navigator { globalPrivacyControl?: boolean } }
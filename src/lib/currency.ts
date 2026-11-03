import { create } from "zustand";
import { useEffect } from "react";

const REGION_CURRENCY: Record<string, string> = {
  US: "USD", CA: "CAD", GB: "GBP", AU: "AUD", NZ: "NZD", JP: "JPY", CN: "CNY", IN: "INR",
  CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN", CZ: "CZK", HU: "HUF", MX: "MXN",
  BR: "BRL", ZA: "ZAR", SG: "SGD", HK: "HKD", KR: "KRW", AE: "AED", SA: "SAR", IL: "ILS",
  TR: "TRY", TH: "THB", MY: "MYR", PH: "PHP", ID: "IDR", AR: "ARS", CL: "CLP", CO: "COP",
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR", AT: "EUR", IE: "EUR",
  PT: "EUR", FI: "EUR", GR: "EUR", SK: "EUR", SI: "EUR", LT: "EUR", LV: "EUR", EE: "EUR",
  LU: "EUR", MT: "EUR", CY: "EUR", HR: "EUR",
};

/** Pure helper: USD amount -> local amount. Falls back to USD when no rate. */
export function convertUsd(usd: number, currency: string, rates: Record<string, number> | null) {
  if (currency === "USD") return { amount: usd, currency: "USD" };
  const rate = rates?.[currency];
  if (!rate) return { amount: usd, currency: "USD" };
  return { amount: usd * rate, currency };
}

export function currencyForLocale(locale: string | undefined) {
  const region = locale?.split("-")[1]?.toUpperCase();
  return (region && REGION_CURRENCY[region]) || "USD";
}

// Time zone is a better location signal than language (many UK/EU devices are
// set to en-US), so it's checked first. Unlisted zones fall back to language.
const ZONE_REGION: Record<string, string> = {
  "Europe/London": "GB", "Europe/Belfast": "GB", "Europe/Jersey": "GB", "Europe/Guernsey": "GB", "Europe/Isle_of_Man": "GB",
  "Europe/Dublin": "IE", "Europe/Paris": "FR", "Europe/Berlin": "DE", "Europe/Madrid": "ES", "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL", "Europe/Brussels": "BE", "Europe/Vienna": "AT", "Europe/Lisbon": "PT", "Europe/Helsinki": "FI",
  "Europe/Athens": "GR", "Europe/Luxembourg": "LU", "Europe/Malta": "MT", "Europe/Zurich": "CH", "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO", "Europe/Copenhagen": "DK", "Europe/Warsaw": "PL", "Europe/Prague": "CZ", "Europe/Budapest": "HU",
  "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA", "America/Winnipeg": "CA", "America/Halifax": "CA",
  "America/Mexico_City": "MX", "America/Sao_Paulo": "BR",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU", "Australia/Perth": "AU", "Australia/Adelaide": "AU",
  "Pacific/Auckland": "NZ", "Asia/Dubai": "AE", "Asia/Singapore": "SG", "Asia/Hong_Kong": "HK", "Asia/Tokyo": "JP",
  "Asia/Kolkata": "IN", "Africa/Johannesburg": "ZA",
};

export function currencyForVisitor(timeZone: string | undefined, locale: string | undefined) {
  const region = timeZone ? ZONE_REGION[timeZone] : undefined;
  if (region && REGION_CURRENCY[region]) return REGION_CURRENCY[region];
  return currencyForLocale(locale);
}

type State = { currency: string; rates: Record<string, number> | null; init: () => void };

let started = false;
export const useCurrencyStore = create<State>((set) => ({
  currency: "USD",
  rates: null,
  init: () => {
    if (started || typeof window === "undefined") return;
    started = true;
    let zone: string | undefined;
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { /* ignore */ }
    const currency = currencyForVisitor(zone, navigator.languages?.[0] ?? navigator.language);
    if (currency === "USD") return;
    set({ currency });
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((j) => j?.rates && set({ rates: j.rates }))
      .catch(() => {});
  },
}));

export function useLocalPrice() {
  const { currency, rates, init } = useCurrencyStore();
  useEffect(() => init(), [init]);
  const active = currency !== "USD" && !!rates?.[currency];
  const format = (usd: number) => {
    const c = convertUsd(usd, currency, rates);
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: c.currency }).format(c.amount);
    } catch {
      return `$${usd.toFixed(2)}`;
    }
  };
  return { format, currency: active ? currency : "USD", converted: active };
}

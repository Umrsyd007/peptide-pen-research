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

/** Country (from the visitor's location) wins; browser language is the fallback. */
export function currencyForVisitor(country: string | null | undefined, locale: string | undefined) {
  const c = country?.toUpperCase();
  if (c && REGION_CURRENCY[c]) return REGION_CURRENCY[c];
  if (c) return "USD";
  return currencyForLocale(locale);
}

const RATES_KEY = "pp-usd-rates-v1";
const RATES_TTL = 60 * 60 * 1000;

async function loadRates(): Promise<Record<string, number> | null> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(RATES_KEY) || "null");
    if (cached && Date.now() - cached.at < RATES_TTL) return cached.rates;
  } catch {}
  const j = await fetch("https://open.er-api.com/v6/latest/USD").then((r) => r.json());
  if (!j?.rates) return null;
  try { sessionStorage.setItem(RATES_KEY, JSON.stringify({ at: Date.now(), rates: j.rates })); } catch {}
  return j.rates;
}

type State = { currency: string; rates: Record<string, number> | null; init: () => void };

let started = false;
export const useCurrencyStore = create<State>((set) => ({
  currency: "USD",
  rates: null,
  init: () => {
    if (started || typeof window === "undefined") return;
    started = true;
    const locale = navigator.languages?.[0] ?? navigator.language;
    import("./currency.functions")
      .then((m) => m.getVisitorCountry())
      .then((r) => r.country, () => null)
      .then(async (country) => {
        const currency = currencyForVisitor(country, locale);
        if (currency === "USD") return;
        set({ currency });
        const rates = await loadRates();
        if (rates) set({ rates });
      })
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

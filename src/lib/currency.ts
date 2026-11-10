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

type State = { currency: string; rates: Record<string, number> | null; init: () => void };

let started = false;
export const useCurrencyStore = create<State>((set) => ({
  currency: "USD",
  rates: null,
  init: () => {
    if (started || typeof window === "undefined") return;
    started = true;
    const currency = currencyForLocale(navigator.languages?.[0] ?? navigator.language);
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

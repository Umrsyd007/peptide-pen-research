import { create } from "zustand";
import { useEffect } from "react";

/** Catalog prices are stored in GBP; shoppers may pick one of these to view and pay in. */
export const BASE_CURRENCY = "GBP";
export const CURRENCIES = ["GBP", "USD", "EUR", "CAD", "AUD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export function isCurrency(c: unknown): c is Currency {
  return typeof c === "string" && (CURRENCIES as readonly string[]).includes(c);
}

/** Pure helper: GBP amount -> chosen currency, rounded to pence/cents. Falls back to GBP when no rate. */
export function convertGbp(gbp: number, currency: string, rates: Record<string, number> | null) {
  if (currency === BASE_CURRENCY) return { amount: gbp, currency: BASE_CURRENCY };
  const rate = rates?.[currency];
  if (!rate) return { amount: gbp, currency: BASE_CURRENCY };
  return { amount: Math.round(gbp * rate * 100) / 100, currency };
}

const EURO = new Set(["AT","BE","HR","CY","EE","FI","FR","DE","GR","IE","IT","LV","LT","LU","MT","NL","PT","SK","SI","ES"]);
/** Default currency for a visitor's two-letter country code; GBP when unknown. */
export function currencyForCountry(country: string | null | undefined): Currency {
  const c = (country || "").toUpperCase();
  if (c === "US") return "USD";
  if (c === "CA") return "CAD";
  if (c === "AU") return "AUD";
  if (EURO.has(c)) return "EUR";
  return "GBP";
}

export function formatIn(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currencyDisplay: currency === "CAD" || currency === "AUD" ? "symbol" : "narrowSymbol", currency }).format(amount);
  } catch {
    return `£${amount.toFixed(2)}`;
  }
}

const RATES_KEY = "pp-gbp-rates-v1";
const CHOICE_KEY = "pp-currency-v1";
const RATES_TTL = 60 * 60 * 1000;

async function loadRates(): Promise<Record<string, number> | null> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(RATES_KEY) || "null");
    if (cached && Date.now() - cached.at < RATES_TTL) return cached.rates;
  } catch {}
  const j = await fetch("https://open.er-api.com/v6/latest/GBP").then((r) => r.json()).catch(() => null);
  if (!j?.rates) return null;
  try { sessionStorage.setItem(RATES_KEY, JSON.stringify({ at: Date.now(), rates: j.rates })); } catch {}
  return j.rates;
}

type State = {
  currency: Currency;
  rates: Record<string, number> | null;
  init: () => void;
  setCurrency: (c: Currency) => void;
};

let started = false;
export const useCurrencyStore = create<State>((set, get) => ({
  currency: "GBP",
  rates: null,
  init: () => {
    if (started || typeof window === "undefined") return;
    started = true;
    const saved = localStorage.getItem(CHOICE_KEY);
    const apply = (c: Currency) => {
      if (c === "GBP") return;
      set({ currency: c });
      loadRates().then((rates) => rates && set({ rates }));
    };
    if (isCurrency(saved)) return apply(saved);
    // First visit: default from the visitor's country (edge header), not saved until they pick.
    import("./currency.functions")
      .then((m) => m.getVisitorCountry())
      .then((country) => { if (!localStorage.getItem(CHOICE_KEY)) apply(currencyForCountry(country)); })
      .catch(() => {});
  },
  setCurrency: (c) => {
    try { localStorage.setItem(CHOICE_KEY, c); } catch {}
    set({ currency: c });
    if (c !== "GBP" && !get().rates) loadRates().then((rates) => rates && set({ rates }));
  },
}));

/** Formats GBP catalog amounts in the shopper's chosen currency. */
export function useMoney() {
  const { currency, rates, init } = useCurrencyStore();
  useEffect(() => init(), [init]);
  const active: Currency = currency !== "GBP" && rates?.[currency] ? currency : "GBP";
  const convert = (gbp: number) => convertGbp(gbp, active, rates).amount;
  const format = (gbp: number) => formatIn(convert(gbp), active);
  return { format, convert, currency: active };
}

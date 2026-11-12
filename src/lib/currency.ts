import { create } from "zustand";
import { useEffect } from "react";

/** Catalog prices are stored in GBP; shoppers may pick one of these to view and pay in. */
export const BASE_CURRENCY = "GBP";
export const CURRENCIES = ["GBP", "USD", "EUR"] as const;
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

export function formatIn(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currencyDisplay: "narrowSymbol", currency }).format(amount);
  } catch {
    return `£${amount.toFixed(2)}`;
  }
}

const EUROZONE = new Set(["AT","BE","HR","CY","EE","FI","FR","DE","GR","IE","IT","LV","LT","LU","MT","NL","PT","SK","SI","ES","MC","SM","VA","AD","ME","XK"]);

/** Default currency for a visitor country: UK→GBP, eurozone→EUR, unknown→GBP, else USD. */
export function currencyForCountry(country: string | null | undefined): Currency {
  if (!country) return "GBP";
  const c = country.toUpperCase();
  if (c === "GB" || c === "UK") return "GBP";
  if (EUROZONE.has(c)) return "EUR";
  return "USD";
}

/** A saved manual choice always beats location. */
export function pickInitialCurrency(saved: unknown, country: string | null | undefined): Currency {
  return isCurrency(saved) ? saved : currencyForCountry(country);
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
    const apply = (c: Currency) => {
      if (c === "GBP") return;
      set({ currency: c });
      loadRates().then((rates) => rates && set({ rates }));
    };
    const saved = localStorage.getItem(CHOICE_KEY);
    if (isCurrency(saved)) return apply(saved);
    import("./currency.functions")
      .then(({ getVisitorCountry }) => getVisitorCountry())
      .then(({ country }) => {
        if (isCurrency(localStorage.getItem(CHOICE_KEY))) return; // shopper picked meanwhile
        apply(pickInitialCurrency(null, country));
      })
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

import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";

const names = typeof Intl !== "undefined" && "DisplayNames" in Intl
  ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

export const flag = (iso: string) =>
  String.fromCodePoint(...[...iso.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

export const countryName = (iso: string) => names?.of(iso) ?? iso;

export const PHONE_COUNTRIES = getCountries()
  .map((iso) => ({ iso, name: countryName(iso), dial: `+${getCountryCallingCode(iso)}` }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const isPhoneCountry = (iso: string | null | undefined): iso is CountryCode =>
  !!iso && PHONE_COUNTRIES.some((c) => c.iso === iso.toUpperCase());

import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

/** Visitor country from the hosting edge (Cloudflare adds cf-ipcountry). */
export const getVisitorCountry = createServerFn({ method: "GET" }).handler(async () => {
  const c = getRequestHeader("cf-ipcountry")?.toUpperCase();
  return { country: c && /^[A-Z]{2}$/.test(c) && c !== "XX" ? c : null };
});

import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

/** Visitor's country from the hosting edge (free, no third-party lookup). */
export const getVisitorCountry = createServerFn({ method: "GET" }).handler(async () => {
  return getRequestHeader("cf-ipcountry") ?? null;
});

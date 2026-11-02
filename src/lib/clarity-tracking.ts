import { permission } from "./tracking-consent";

// Microsoft Clarity project ID (Clarity → Settings → Setup). Empty = disabled.
export const CLARITY_PROJECT_ID = "";

let installed = false;

/** Loads Clarity once analytics permission exists; tells Clarity the current choice. */
export function syncClarity() {
  if (typeof window === "undefined" || !CLARITY_PROJECT_ID) return;
  const allowed = permission("analytics");
  if (!allowed && !installed) return;
  if (!installed) {
    installed = true;
    const w = window as unknown as { clarity?: { (...a: unknown[]): void; q?: unknown[][] } };
    w.clarity ??= Object.assign(function (...a: unknown[]) { (w.clarity!.q ??= []).push(a); }, {});
    const script = document.createElement("script");
    script.id = "clarity-tracking";
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
    document.head.appendChild(script);
  }
  (window as unknown as { clarity: (...a: unknown[]) => void }).clarity("consent", allowed);
}

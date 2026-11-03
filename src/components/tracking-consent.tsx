import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CONSENT_NOTICE, readConsent, requiresConsent, resolveRegion, saveConsent } from "@/lib/tracking-consent";
import { syncGoogleTracking } from "@/lib/google-tracking";
import { trackPageView } from "@/lib/analytics";

export function TrackingConsent() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [advertising, setAdvertising] = useState(true);
  const [customising, setCustomising] = useState(false);
  useEffect(() => {
    let active = true;
    const sync = () => { syncGoogleTracking(); };
    const storage = (event: StorageEvent) => { if (event.key?.startsWith("peptidepen-consent")) sync(); };
    window.addEventListener("tracking-consent-change", sync);
    window.addEventListener("storage", storage);
    void resolveRegion().then(country => {
      if (!active) return;
      const choice = readConsent();
      setOpen(!choice && requiresConsent(country));
      setAnalytics(choice?.analytics ?? true);
      setAdvertising(choice?.advertising ?? true);
      sync();
      trackPageView({ path: window.location.pathname });
    });
    return () => { active = false; window.removeEventListener("tracking-consent-change", sync); window.removeEventListener("storage", storage); };
  }, []);
  const save = (a: boolean, ad: boolean) => { saveConsent(a, ad); setAnalytics(a); setAdvertising(ad); setOpen(false); setCustomising(false); };
  return <>
    <div className="border-t border-border bg-background px-4 py-3 flex justify-center gap-4 text-xs">
      <Button variant="link" size="sm" onClick={() => { const choice = readConsent(); setAnalytics(choice?.analytics ?? true); setAdvertising(choice?.advertising ?? true); setOpen(true); }}>Cookie settings</Button>
      <Link to="/privacy-policy" className="self-center underline">Privacy policy</Link>
    </div>
    {open && <section role="dialog" aria-label="Our cookies" className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background px-4 py-3 shadow-lg">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 space-y-1">
          <h2 className="text-sm font-bold">Our cookies</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">We use cookies to make the site work, personalise content and measure traffic. By clicking “Accept all” you agree to the uses explained in our <Link to="/privacy-policy" className="underline">Privacy policy</Link>. “Reject all” blocks non-essential cookies.</p>
          {customising && <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <label className="flex gap-2 items-center"><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} />Analytics</label>
            <label className="flex gap-2 items-center"><input type="checkbox" checked={advertising} onChange={e => setAdvertising(e.target.checked)} />Advertising measurement</label>
            <Button size="sm" className="h-7 rounded-full text-xs" onClick={() => save(analytics, advertising)}>Save my choices</Button>
          </div>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" className="text-xs font-semibold underline underline-offset-4 px-2" onClick={() => setCustomising(c => !c)}>Let me choose</button>
          <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold" onClick={() => save(false, false)}>Reject all</Button>
          <Button size="sm" className="rounded-full text-xs font-semibold" onClick={() => save(true, true)}>Accept all</Button>
        </div>
      </div>
    </section>}
  </>;
}
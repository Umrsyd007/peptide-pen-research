import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CONSENT_NOTICE, readConsent, requiresConsent, resolveRegion, saveConsent } from "@/lib/tracking-consent";
import { syncGoogleTracking } from "@/lib/google-tracking";
import { syncClarity } from "@/lib/clarity-tracking";
import { trackPageView } from "@/lib/analytics";

export function TrackingConsent() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  useEffect(() => {
    let active = true;
    const sync = () => { syncGoogleTracking(); syncClarity(); };
    const storage = (event: StorageEvent) => { if (event.key?.startsWith("peptidepen-consent")) sync(); };
    window.addEventListener("tracking-consent-change", sync);
    window.addEventListener("storage", storage);
    void resolveRegion().then(country => {
      if (!active) return;
      const choice = readConsent();
      setOpen(!choice && requiresConsent(country));
      setAnalytics(choice?.analytics ?? false);
      setAdvertising(choice?.advertising ?? false);
      sync();
      trackPageView({ path: window.location.pathname });
    });
    return () => { active = false; window.removeEventListener("tracking-consent-change", sync); window.removeEventListener("storage", storage); };
  }, []);
  const save = (a: boolean, ad: boolean) => { saveConsent(a, ad); setAnalytics(a); setAdvertising(ad); setOpen(false); };
  return <>
    <div className="border-t border-border bg-background px-4 py-3 flex justify-center gap-4 text-xs">
      <Button variant="link" size="sm" onClick={() => { const choice = readConsent(); setAnalytics(choice?.analytics ?? false); setAdvertising(choice?.advertising ?? false); setOpen(true); }}>Cookie settings</Button>
      <Link to="/privacy-policy" className="self-center underline">Privacy policy</Link>
    </div>
    {open && <section aria-label="Cookie preferences" className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background p-5 shadow-lg">
      <div className="mx-auto max-w-3xl space-y-3">
        <h2 className="text-lg font-semibold">Your privacy choices</h2>
        <p className="text-sm text-muted-foreground">{CONSENT_NOTICE} <Link to="/privacy-policy" className="underline">Privacy policy</Link></p>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex gap-2 items-center"><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} />Analytics</label>
          <label className="flex gap-2 items-center"><input type="checkbox" checked={advertising} onChange={e => setAdvertising(e.target.checked)} />Advertising measurement</label>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => save(false, false)}>Reject optional</Button>
          <Button variant="outline" onClick={() => save(true, true)}>Accept optional</Button>
          <Button variant="outline" onClick={() => save(analytics, advertising)}>Save choices</Button>
        </div>
      </div>
    </section>}
  </>;
}
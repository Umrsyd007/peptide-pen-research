import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CONSENT_NOTICE, readConsent, requiresConsent, resolveRegion, saveConsent } from "@/lib/tracking-consent";
import { syncGoogleTracking } from "@/lib/google-tracking";
import { trackPageView } from "@/lib/analytics";

export function TrackingConsent() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
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
    {open && <section aria-label="Cookie preferences" className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background p-6 shadow-lg">
      <div className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">We value your privacy</h2>
        <p className="text-base leading-relaxed">We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies. <Link to="/privacy-policy" className="underline">Privacy policy</Link></p>
        {customising && <div className="flex flex-wrap items-center gap-6 text-sm">
          <label className="flex gap-2 items-center"><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} />Analytics</label>
          <label className="flex gap-2 items-center"><input type="checkbox" checked={advertising} onChange={e => setAdvertising(e.target.checked)} />Advertising measurement</label>
          <Button size="sm" variant="outline" onClick={() => save(analytics, advertising)}>Save choices</Button>
        </div>}
        <div className="grid gap-3 sm:grid-cols-3">
          <Button variant="outline" className="h-12 border-2 border-foreground text-base font-bold" onClick={() => setCustomising(c => !c)}>Customise</Button>
          <Button className="h-12 text-base font-bold" onClick={() => save(false, false)}>Reject All</Button>
          <Button className="h-12 text-base font-bold" onClick={() => save(true, true)}>Accept All</Button>
        </div>
      </div>
    </section>}
  </>;
}
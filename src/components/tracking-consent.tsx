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
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <section role="dialog" aria-label="Our cookies" className="w-full max-w-2xl rounded-3xl bg-background p-8 text-center shadow-2xl space-y-6">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our cookies</h2>
        <p className="text-sm md:text-base leading-relaxed">Our website uses small bits of data (known as cookies) to make the website work, remember who you are, personalise content and provide a safer experience on our site. Some of these cookies are essential for the website to function while others can be switched on or off. By clicking “Accept all” you agree to the uses explained in our <Link to="/privacy-policy" className="underline">Privacy policy</Link>. If you click “Reject all” we’ll block all non-essential cookies but those crucial to the website’s operation will still be used. To set your cookie preferences, click “Let me choose”.</p>
        {customising && <div className="space-y-3 rounded-2xl border border-border p-4 text-left text-sm">
          <label className="flex gap-2 items-center"><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} />Analytics</label>
          <label className="flex gap-2 items-center"><input type="checkbox" checked={advertising} onChange={e => setAdvertising(e.target.checked)} />Advertising measurement</label>
          <Button size="sm" className="rounded-full" onClick={() => save(analytics, advertising)}>Save my choices</Button>
        </div>}
        <div className="grid gap-3 sm:grid-cols-3 items-center">
          <button type="button" className="text-base font-bold underline underline-offset-4" onClick={() => setCustomising(c => !c)}>Let me choose</button>
          <Button variant="outline" className="h-12 rounded-full border-2 border-foreground text-base font-bold" onClick={() => save(false, false)}>Reject all</Button>
          <Button variant="outline" className="h-12 rounded-full border-2 border-foreground text-base font-bold" onClick={() => save(true, true)}>Accept all</Button>
        </div>
      </section>
    </div>}
  </>;
}
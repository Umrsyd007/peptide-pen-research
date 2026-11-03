import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { PRODUCT_ID, PRODUCT_NAME, VARIANTS, formatGbp } from "@/lib/injector";
import injectorImg from "@/assets/injector-device.jpg";

const TITLE = "Needle-Free Injector | PeptidePen";
const DESCRIPTION =
  "A reusable needle-free injector that delivers with a quick, gentle pulse instead of a needle. From £164 with free UK delivery in 3–7 days.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://getpeptidepen.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getpeptidepen.com/" }],
  }),
  component: HomePage,
});

const BENEFITS = [
  { title: "No needle", body: "A fine, high-speed stream passes through the skin, so there's no sharp to see, handle or dispose of." },
  { title: "Done in a second", body: "Load, place and press. Delivery takes a fraction of a second, with no fiddly plunger to push." },
  { title: "Built to reuse", body: "One durable device with replaceable nozzles and adapters, so you're not throwing hardware away." },
];

const STEPS = [
  { n: "01", title: "Load", body: "Attach a fresh nozzle and draw your dose up through the adapter." },
  { n: "02", title: "Place", body: "Rest the tip flat against clean skin at a right angle." },
  { n: "03", title: "Press", body: "Press the release button. A quick pulse and you're finished." },
];

const IN_THE_BOX = [
  "Needle-free injector device",
  "Starter set of sterile nozzles",
  "Vial and ampoule adapters",
  "Reset tool and carry case",
  "Illustrated quick-start guide",
];

const FAQ = [
  { q: "Does it hurt?", a: "Most people describe a brief snap or pressure rather than a needle prick. Everyone's skin is different, so sensation varies." },
  { q: "How long does delivery take?", a: "Orders ship within 3–7 days, and UK delivery is free. We'll email your tracking number once it's on the way." },
  { q: "Can I return it?", a: "Yes. Unused devices in their original packaging can be returned. See our refund policy for the details." },
  { q: "How often do nozzles need replacing?", a: "Nozzles are single-use. The starter set gets you going, and replacements are available from us." },
];

function HomePage() {
  const from = Math.min(...VARIANTS.map((v) => v.price));
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full blur-3xl opacity-25 bg-[image:var(--gradient-flame)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> New
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95]">
              {PRODUCT_NAME}.{" "}
              <span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">Skip the needle.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              A reusable device that delivers with a quick, gentle pulse, so there's no needle to see, handle or throw away.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/products/$productId"
                params={{ productId: PRODUCT_ID }}
                className="inline-flex h-14 px-8 items-center rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:bg-foreground hover:text-background transition-colors"
              >
                Order now
              </Link>
              <p className="text-sm text-muted-foreground">
                From <span className="text-foreground font-black text-xl">{formatGbp(from)}</span>
              </p>
            </div>
          </div>
          <div className="aspect-square rounded-3xl bg-card border border-border shadow-[var(--shadow-glow)] overflow-hidden">
            <img src={injectorImg} alt={PRODUCT_NAME} width={1024} height={1024} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid gap-5 md:grid-cols-3">
        {BENEFITS.map((b) => (
          <div key={b.title} className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-black uppercase tracking-tight">{b.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="bg-muted/40 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-10">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">How it works</h2>
          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-2xl bg-background border border-border p-6 space-y-3">
                <span className="text-sm font-black text-primary">{s.n}</span>
                <h3 className="text-xl font-black uppercase">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* In the box + options */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <h2 className="text-3xl font-black uppercase tracking-tight">What's in the box</h2>
          <ul className="space-y-3">
            {IN_THE_BOX.map((i) => (
              <li key={i} className="flex items-center gap-3 text-base">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-black">✓</span>
                {i}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Free UK delivery, shipped within 3–7 days.{" "}
            <Link to="/refund-policy" className="underline hover:text-foreground">Refund policy</Link>
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {VARIANTS.map((v) => (
            <div key={v.sku} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3">
              <h3 className="text-lg font-black uppercase">{v.name}</h3>
              <p className="text-3xl font-black">{formatGbp(v.price)}</p>
              <p className="text-sm text-muted-foreground flex-1">{v.note}</p>
              <Link
                to="/products/$productId"
                params={{ productId: PRODUCT_ID }}
                state={{ option: v.sku }}
                className="inline-flex h-11 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors"
              >
                Choose {v.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tight">Common questions</h2>
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card p-5">
              <summary className="cursor-pointer list-none font-bold flex justify-between">
                {f.q} <span className="text-primary group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

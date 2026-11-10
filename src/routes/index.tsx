import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { INJECTOR_PRODUCTS, PRODUCT_ID } from "@/lib/injector";
import { Price } from "@/components/price";
import { PEPTICOOL_IMAGE } from "@/components/pepticool-page";
import injectorImg from "@/assets/injector/g1-hero-800.webp";

const COOLER_ID = "1b0959b6";
const NAVY = "#0E2A47";
const BLUE = "#1E7FD6";

const TITLE = "PeptidePen | Needle-Free Injector & PeptiCool Travel Cooler";
const DESCRIPTION =
  "A reusable needle-free injector and the PeptiCool™ active travel cooler for GLP-1 pens and vials. Free UK delivery in 3–7 days.";

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
    links: [
      { rel: "canonical", href: "https://getpeptidepen.com/" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  component: HomePage,
});

const injector = INJECTOR_PRODUCTS.find((p) => p.id === PRODUCT_ID)!;
const cooler = INJECTOR_PRODUCTS.find((p) => p.id === COOLER_ID)!;
const fromPrice = (p: typeof injector) => Math.min(...p.variants.map((v) => v.price));

const SHOP = [
  {
    id: injector.id,
    name: injector.name,
    blurb: "Reusable device with single-use sterile nozzles, adapters and a carry case.",
    price: fromPrice(injector),
    from: injector.variants.length > 1,
    img: injectorImg,
    imgBg: "bg-[#F4F1EA]",
    tag: "Single or 2-Pack",
  },
  {
    id: cooler.id,
    name: cooler.name,
    blurb: "Active 2–8°C cooling for pens and vials, with a touchscreen readout and USB-C power.",
    price: fromPrice(cooler),
    from: false,
    img: PEPTICOOL_IMAGE,
    imgBg: "bg-[#0B0E14]",
    tag: "No ice packs",
  },
];

const BENEFITS = [
  { title: "No needle", body: "A fine, high-pressure stream passes through the skin, so there's no sharp to see, handle or dispose of." },
  { title: "Done in a second", body: "Load, place and press. Delivery takes a fraction of a second, with no plunger to push." },
  { title: "Built to reuse", body: "One durable device with replaceable nozzles and adapters, so you're not throwing hardware away." },
];

const STEPS = [
  { n: "1", title: "Load", body: "Attach a fresh nozzle and draw your dose up through the adapter." },
  { n: "2", title: "Place", body: "Rest the tip flat against clean skin at a right angle." },
  { n: "3", title: "Press", body: "Press the release button. A quick pulse and you're finished." },
];

const COOLER_STATS = [
  { big: "2–8°C", small: "Precise temperature with a live touchscreen readout" },
  { big: "7–9 hrs", small: "Cordless cooling per charged Power Cell" },
  { big: "USB-C", small: "Runs from a power bank, laptop or plane seat" },
];

const FAQ = [
  { q: "Does the injector hurt?", a: "Most people describe a brief snap or pressure rather than a needle prick. Everyone's skin is different, so sensation varies." },
  { q: "How often do nozzles need replacing?", a: "Nozzles are single-use. The starter set gets you going, and replacements are available from us." },
  { q: "Does the PeptiCool need ice packs?", a: "No. It uses active thermoelectric cooling with a built-in battery, so there's nothing to freeze or melt." },
  { q: "How long does delivery take?", a: "Orders ship within 3–7 days, and UK delivery is free. We'll email your tracking number once it's on the way." },
  { q: "Can I return it?", a: "Yes. Unused products in their original packaging can be returned. See our refund policy for the details." },
];

function Tick() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M4 10.5l3.5 3.5L16 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: light ? "#7DBBF0" : BLUE }}>{children}</p>;
}

function HomePage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SiteShell>
      <div className="bg-white" style={{ fontFamily: "Inter, sans-serif", color: NAVY }}>
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#EEF6FC] to-white px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-[1180px] mx-auto grid gap-10 lg:grid-cols-[1.1fr_1fr] items-center">
            <div className="min-w-0 space-y-6">
              <Eyebrow>Needle-free · Kept cold</Eyebrow>
              <h1 className="text-[40px] sm:text-[56px] font-extrabold leading-[1.02] tracking-[-0.035em]">
                Skip the needle.<br />
                <span style={{ color: BLUE }}>Keep it cold.</span>
              </h1>
              <p className="text-[17px] leading-relaxed text-[#4A5D70] max-w-lg">
                A reusable needle-free injector, and the PeptiCool™ travel cooler that holds your pens and vials at 2–8°C wherever you go.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products/$productId" params={{ productId: injector.id }} className="inline-flex h-14 items-center rounded-full px-7 text-[15px] font-bold text-white hover:opacity-90" style={{ background: BLUE }}>
                  Shop the injector
                </Link>
                <Link to="/products/$productId" params={{ productId: cooler.id }} className="inline-flex h-14 items-center rounded-full border-2 border-[#0E2A47] px-7 text-[15px] font-bold hover:bg-[#0E2A47] hover:text-white transition-colors">
                  Shop the cooler
                </Link>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#4A5D70]">
                {["Free UK delivery", "Ships in 3–7 days", "Easy returns"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><span style={{ color: BLUE }}><Tick /></span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 grid grid-cols-2 gap-4">
              <Link to="/products/$productId" params={{ productId: injector.id }} className="aspect-[4/5] overflow-hidden rounded-[24px] bg-[#F4F1EA] shadow-[0_20px_60px_rgba(14,42,71,0.10)] translate-y-6">
                <img src={injectorImg} alt={injector.name} className="h-full w-full object-cover" />
              </Link>
              <Link to="/products/$productId" params={{ productId: cooler.id }} className="aspect-[4/5] overflow-hidden rounded-[24px] bg-[#0B0E14] shadow-[0_20px_60px_rgba(14,42,71,0.10)]">
                <img src={PEPTICOOL_IMAGE} alt={cooler.name} className="h-full w-full object-cover" />
              </Link>
            </div>
          </div>
        </section>

        {/* Shop */}
        <section id="shop" className="px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-[1180px] mx-auto">
            <div className="space-y-3">
              <Eyebrow>Shop</Eyebrow>
              <h2 className="text-[30px] sm:text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em]">Two products. One routine.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {SHOP.map((p) => (
                <Link key={p.id} to="/products/$productId" params={{ productId: p.id }} className="group overflow-hidden rounded-[24px] border border-[#E4ECF3] bg-white transition-shadow hover:shadow-[0_20px_60px_rgba(14,42,71,0.10)]">
                  <div className={`aspect-[16/11] overflow-hidden ${p.imgBg}`}>
                    <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="space-y-3 p-6">
                    <span className="inline-block rounded-full bg-[#EEF6FC] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: BLUE }}>{p.tag}</span>
                    <h3 className="text-xl font-bold">{p.name}</h3>
                    <p className="text-sm leading-relaxed text-[#4A5D70]">{p.blurb}</p>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-2xl font-extrabold">{p.from && <span className="text-sm font-medium text-[#6B7C8D]">From </span>}<Price usd={p.price} /></p>
                      <span className="inline-flex h-11 items-center rounded-full px-5 text-sm font-bold text-white" style={{ background: BLUE }}>View product →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Injector: benefits + how it works */}
        <section className="bg-[#F5F9FC] px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-[1180px] mx-auto">
            <div className="max-w-2xl space-y-3">
              <Eyebrow>The needle-free injector</Eyebrow>
              <h2 className="text-[30px] sm:text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em]">No needle to see, handle or throw away.</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {BENEFITS.map((b) => (
                <div key={b.title} className="rounded-3xl bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#EEF6FC]" style={{ color: BLUE }}><Tick /></span>
                  <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#4A5D70]">{b.body}</p>
                </div>
              ))}
            </div>
            <ol className="mt-4 grid gap-4 md:grid-cols-3">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4 rounded-3xl border border-[#E4ECF3] bg-white p-6">
                  <span className="text-[40px] font-extrabold leading-none" style={{ color: BLUE }}>{s.n}</span>
                  <span>
                    <span className="block text-lg font-bold">{s.title}</span>
                    <span className="block text-sm leading-relaxed text-[#4A5D70]">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link to="/products/$productId" params={{ productId: injector.id }} className="mt-8 inline-flex h-12 items-center rounded-full px-6 text-sm font-bold text-white hover:opacity-90" style={{ background: BLUE }}>
              Shop the injector — from <Price usd={fromPrice(injector)} />
            </Link>
          </div>
        </section>

        {/* PeptiCool band */}
        <section className="bg-[#0B0E14] px-4 sm:px-6 py-16 sm:py-20 text-white">
          <div className="max-w-[1180px] mx-auto grid gap-10 lg:grid-cols-2 items-center">
            <div className="min-w-0 aspect-square overflow-hidden rounded-[24px] bg-black">
              <img src={PEPTICOOL_IMAGE} alt={cooler.name} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 space-y-6">
              <Eyebrow light>PeptiCool™ travel cooler</Eyebrow>
              <h2 className="text-[30px] sm:text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em]">The end of melting ice packs.</h2>
              <p className="text-white/70 max-w-md">Active cooling that keeps GLP-1 pens and vials at a set temperature — on flights, at work or on the road.</p>
              <ul className="grid gap-3 sm:grid-cols-3">
                {COOLER_STATS.map((s) => (
                  <li key={s.big} className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                    <p className="text-2xl font-bold text-[#44B0FF]">{s.big}</p>
                    <p className="mt-1 text-xs leading-snug text-white/65">{s.small}</p>
                  </li>
                ))}
              </ul>
              <Link to="/products/$productId" params={{ productId: cooler.id }} className="inline-flex h-12 items-center rounded-full bg-[#60C5F8] px-6 text-sm font-bold text-[#050A10] hover:opacity-90">
                Shop the cooler — <Price usd={fromPrice(cooler)} />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-[760px] mx-auto">
            <h2 className="text-center text-[30px] sm:text-[40px] font-extrabold tracking-[-0.02em]">Common questions</h2>
            <div className="mt-8 divide-y divide-[#E4ECF3] rounded-3xl border border-[#E4ECF3]">
              {FAQ.map((f, k) => (
                <div key={f.q}>
                  <button type="button" onClick={() => setOpen(open === k ? null : k)} aria-expanded={open === k} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-semibold">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EEF6FC] text-lg" style={{ color: BLUE }}>{open === k ? "−" : "+"}</span>
                  </button>
                  {open === k && <p className="px-6 pb-5 text-[15px] leading-relaxed text-[#4A5D70]">{f.a}</p>}
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-[#6B7C8D]">
              Free UK delivery, shipped within 3–7 days. <Link to="/refund-policy" className="underline underline-offset-2">Refund policy</Link>
            </p>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}

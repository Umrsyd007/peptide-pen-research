import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart";
import { trackAddToCart, trackViewItem } from "@/lib/analytics";
import { CURRENCY, type InjectorProduct } from "@/lib/injector";
import { Price } from "@/components/price";
import { ANATOMY_ANCHORS, GALLERY, IMG } from "@/components/injector-media";

// Needle-Free Injector product page. Copy is original and avoids medical
// claims; imagery is rendered in-house (see src/assets/injector).

const BLUE = "#1E7FD6";

const IN_THE_BOX = [
  { name: "Injector", note: "The reusable device itself" },
  { name: "Sterile nozzles", note: "Single-use, starter set" },
  { name: "Vial and ampoule adapters", note: "For drawing up your dose" },
  { name: "Reset tool", note: "Re-arms the device between uses" },
  { name: "Carry case", note: "Keeps the kit together" },
  { name: "Quick-start guide", note: "Illustrated, step by step" },
];

const PARTS: { key: keyof typeof ANATOMY_ANCHORS; name: string; note: string; side: "top" | "bottom" }[] = [
  { key: "nozzle", name: "Nozzle", note: "Clear, sterile and single-use. Fit a new one every time.", side: "top" },
  { key: "frontCap", name: "Front cap", note: "Holds the nozzle firmly in place.", side: "bottom" },
  { key: "button", name: "Release button", note: "Press it once the tip is in position.", side: "top" },
  { key: "grip", name: "Grip", note: "A soft-touch panel for a steady hold.", side: "bottom" },
  { key: "rearCap", name: "Rear cap", note: "Closes the body of the injector.", side: "top" },
];

const STEPS = [
  { title: "Load", body: "Fit a fresh sterile nozzle, then draw your dose through the adapter." },
  { title: "Place", body: "Hold the tip flat against clean skin, at a right angle." },
  { title: "Press", body: "Press the release button. A quick pulse, and it's done." },
];

const COMPARE = [
  { label: "Sharps to handle", needle: "One per dose", free: "None" },
  { label: "Sharps bin needed", needle: "Yes", free: "No" },
  { label: "How the dose is delivered", needle: "Pushed through a needle", free: "Fast, narrow stream" },
  { label: "Hardware", needle: "Single-use syringe", free: "Reusable device" },
  { label: "Part replaced each time", needle: "Needle and syringe", free: "Sterile nozzle" },
];

const FAQ = [
  { q: "Does it hurt?", a: "Most people describe a brief snap or pressure rather than a needle prick. Everyone's skin is different, so the sensation varies." },
  { q: "Is it right for my medication?", a: "Not every medication or dose is suitable for needle-free delivery. Check with your prescriber or pharmacist before you switch." },
  { q: "How often do nozzles need replacing?", a: "Every time. Nozzles are sterile and single-use. The kit includes a starter set, and replacements are available from us." },
  { q: "What's the difference between Single and 2-Pack?", a: "Single is one injector with its starter kit. The 2-Pack is two injectors, which works out about 30% cheaper per device." },
  { q: "How long does delivery take?", a: "Orders ship within 3–7 days and delivery is free. We email your tracking number as soon as it's on its way." },
  { q: "Can I return it?", a: "Yes, within 30 days of delivery, as long as it's unopened, unused and in its original packaging." },
];

const H2 = "text-[32px] font-bold leading-[1.1] tracking-[-0.025em] sm:text-[40px]";
const LEAD = "text-[17px] leading-relaxed text-[#4A5D70]";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E7FD6]";

function Tick({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} aria-hidden>
      <path d="M4 10.5l3.5 3.5L16 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`px-4 sm:px-6 ${className}`}>
      <div className="mx-auto max-w-[1180px]">{children}</div>
    </section>
  );
}

// ---------- gallery ----------
function Gallery() {
  const [i, setI] = useState(0);
  const n = GALLERY.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const startX = useRef<number | null>(null);
  const img = GALLERY[i];
  const arrow = `pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white/90 text-xl text-[#0E2A47] shadow-sm transition-colors hover:bg-white ${FOCUS}`;
  return (
    <div className="space-y-3">
      <div
        className="relative aspect-square touch-pan-y select-none overflow-hidden rounded-[22px] bg-[#F4F0E8]"
        onPointerDown={(e) => { startX.current = e.clientX; }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <img
          key={img.large}
          src={img.large}
          srcSet={`${img.medium} 800w, ${img.large} 1600w`}
          sizes="(min-width: 1024px) 590px, 100vw"
          width={1600}
          height={1600}
          alt={img.alt}
          draggable={false}
          fetchPriority={i === 0 ? "high" : "auto"}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
          <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={arrow}>‹</button>
          <button type="button" onClick={() => go(1)} aria-label="Next image" className={arrow}>›</button>
        </div>
        <p className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tabular-nums" aria-live="polite">
          {i + 1} of {n}
        </p>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {GALLERY.map((g, k) => (
          <button
            key={g.thumb}
            type="button"
            onClick={() => setI(k)}
            aria-label={`Show image ${k + 1}: ${g.alt}`}
            aria-current={k === i}
            className={`aspect-square overflow-hidden rounded-xl bg-[#F4F0E8] transition-opacity ${FOCUS} ${k === i ? "ring-2 ring-[#0E2A47]" : "opacity-65 hover:opacity-100"}`}
          >
            <img src={g.thumb} alt="" width={200} height={200} loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- signature: jet vs needle cross-section ----------
const DOTS = Array.from({ length: 34 }, (_, k) => {
  const a = (k * 137.508 * Math.PI) / 180;
  const r = 6 + Math.sqrt(k) * 9.5;
  return { x: 250 + Math.cos(a) * r * 1.35, y: 290 + Math.sin(a) * r * 0.6, r: 2.2 + ((k * 7) % 5) * 0.45, d: k * 14 };
});

function CrossSection() {
  const [mode, setMode] = useState<"jet" | "needle">("jet");
  const jet = mode === "jet";
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div className="max-w-[470px] space-y-5">
        <h2 className={H2}>No needle goes into the skin</h2>
        <p className={LEAD}>
          A jet injector uses pressure instead of a sharp. Press the release button and the dose is pushed through a pinhole-sized opening in the nozzle as a fast, narrow stream.
        </p>
        <p className={LEAD}>
          The stream passes through the outer layers of skin and spreads into the tissue beneath. There's nothing to insert, pull out or drop in a sharps bin.
        </p>
        <div role="group" aria-label="Compare delivery methods" className="inline-flex flex-wrap rounded-full bg-white p-1 shadow-[inset_0_0_0_1px_#D6E2EC]">
          {([["jet", "Needle-free injector"], ["needle", "Syringe and needle"]] as const).map(([m, label]) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${FOCUS} ${mode === m ? "bg-[#0E2A47] text-white" : "text-[#4A5D70] hover:text-[#0E2A47]"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <figure className="min-w-0">
        <svg viewBox="0 0 560 420" className="h-auto w-full" role="img" aria-label={jet ? "Cross-section of skin. The injector's narrow stream passes through the skin and spreads into the tissue below." : "Cross-section of skin. A needle passes through the skin and releases the dose at its tip."}>
          <defs>
            <clipPath id="xs-clip"><rect width="560" height="420" rx="22" /></clipPath>
            <pattern id="xs-muscle" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
              <rect width="14" height="14" fill="#E2A898" />
              <line x1="0" y1="0" x2="0" y2="14" stroke="#D3907F" strokeWidth="5" />
            </pattern>
          </defs>
          <g clipPath="url(#xs-clip)">
            <rect width="560" height="420" fill="#FBFDFF" />
            <rect y="160" width="560" height="16" fill="#F1D3C4" />
            <rect y="176" width="560" height="74" fill="#EEC5B2" />
            <rect y="250" width="560" height="104" fill="#F8E6CB" />
            {Array.from({ length: 11 }, (_, k) => (
              <ellipse key={k} cx={20 + k * 54} cy={k % 2 ? 282 : 320} rx="30" ry="21" fill="none" stroke="#EDD2AC" strokeWidth="2" />
            ))}
            <rect y="354" width="560" height="66" fill="url(#xs-muscle)" />
            <line x1="0" y1="160" x2="560" y2="160" stroke="#D9A994" strokeWidth="2" />

            <g className="transition-opacity duration-500 motion-reduce:transition-none" style={{ opacity: jet ? 0 : 1 }}>
              <rect x="236" y="18" width="28" height="98" rx="5" fill="#ffffff" stroke="#9AA8B5" strokeWidth="2" />
              <rect x="240" y="64" width="20" height="48" rx="3" fill={BLUE} opacity="0.28" />
              <rect x="246" y="4" width="8" height="18" fill="#9AA8B5" />
              <rect x="244" y="116" width="12" height="10" fill="#9AA8B5" />
              <line x1="250" y1="126" x2="250" y2="282" stroke="#7D8A97" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="250" cy="292" rx="24" ry="13" fill={BLUE} opacity="0.32" />
            </g>

            <g className="transition-opacity duration-500 motion-reduce:transition-none" style={{ opacity: jet ? 1 : 0 }}>
              <rect x="204" y="-4" width="92" height="44" fill="#ECECE8" stroke="#C9CDD1" strokeWidth="1.5" />
              <path d="M204 40 L296 40 L284 112 Q281 124 270 128 L230 128 Q219 124 216 112 Z" fill="#44464A" />
              <path d="M231 128 L269 128 L263 150 Q262 158 256 159 L244 159 Q238 158 237 150 Z" fill="#DCE6EE" stroke="#B9C7D3" strokeWidth="1.5" />
              <line
                x1="250" y1="160" x2="250" y2="272"
                stroke={BLUE} strokeWidth="3" strokeLinecap="round"
                strokeDasharray="112" strokeDashoffset={jet ? 0 : 112}
                className="transition-[stroke-dashoffset] delay-150 duration-700 ease-out motion-reduce:transition-none"
              />
              {DOTS.map((d, k) => (
                <circle
                  key={k} cx={d.x} cy={d.y} r={d.r} fill={BLUE}
                  className="transition-opacity duration-500 motion-reduce:transition-none"
                  style={{ opacity: jet ? 0.18 + (k % 4) * 0.12 : 0, transitionDelay: jet ? `${650 + d.d}ms` : "0ms" }}
                />
              ))}
            </g>

            {([["Epidermis", 168], ["Dermis", 213], ["Subcutaneous tissue", 330], ["Muscle", 392]] as const).map(([t, y]) => (
              <g key={t}>
                <rect x={546 - (t.length * 7.3 + 24)} y={y - 12} width={t.length * 7.3 + 24} height="24" rx="12" fill="#ffffff" opacity="0.88" />
                <text x="534" y={y + 4.5} textAnchor="end" fontSize="13" fontWeight="600" fill="#5A4136" fontFamily="Inter, sans-serif">{t}</text>
              </g>
            ))}
          </g>
        </svg>
        <figcaption className="mt-3 text-sm text-[#5B6B7B]">
          {jet
            ? "Needle-free: the stream passes through the skin and spreads into the tissue below."
            : "Needle: the needle passes through the skin and the dose is released at its tip."}{" "}
          Illustration, not to scale.
        </figcaption>
      </figure>
    </div>
  );
}

// ---------- anatomy ----------
function Anatomy() {
  return (
    <div className="space-y-8">
      <div className="max-w-[560px] space-y-3">
        <h2 className={H2}>Every part, and what it does</h2>
        <p className={LEAD}>Five parts you'll handle. Only the nozzle is ever replaced.</p>
      </div>
      <div className="relative overflow-hidden rounded-[22px] bg-[#F3F6F9]">
        <img
          src={IMG.anatomy.large}
          srcSet={`${IMG.anatomy.medium} 1000w, ${IMG.anatomy.large} 1600w`}
          sizes="(min-width: 1180px) 1180px, 100vw"
          width={1600}
          height={544}
          loading="lazy"
          alt="Side view of the injector with its parts marked"
          className="h-auto w-full"
        />
        {PARTS.map((p, k) => {
          const [x, y] = ANATOMY_ANCHORS[p.key];
          const top = p.side === "top";
          return (
            <div key={p.key} className="absolute" style={{ left: `${x * 100}%`, top: `${y * 100}%` }}>
              {/* marker: numbered on small screens (matches the list below), plain dot with a label on large */}
              <span className="absolute -left-[11px] -top-[11px] grid h-[22px] w-[22px] place-items-center rounded-full border-2 border-white bg-[#1E7FD6] text-[11px] font-bold text-white shadow lg:-left-[7px] lg:-top-[7px] lg:h-[14px] lg:w-[14px] lg:text-[0px]">
                <span className="lg:hidden">{k + 1}</span>
              </span>
              <span className={`absolute left-0 hidden w-px bg-[#0E2A47]/30 lg:block ${top ? "bottom-[9px] h-[52px]" : "top-[9px] h-[52px]"}`} />
              <div className={`absolute hidden w-[190px] -translate-x-1/2 lg:block ${top ? "bottom-[66px]" : "top-[66px]"}`}>
                <p className="text-[15px] font-bold">{p.name}</p>
                <p className="text-[13px] leading-snug text-[#5B6B7B]">{p.note}</p>
              </div>
            </div>
          );
        })}
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {PARTS.map((p, k) => (
          <li key={p.key} className="flex gap-3">
            <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#1E7FD6] text-[11px] font-bold text-white">{k + 1}</span>
            <span>
              <span className="block font-bold">{p.name}</span>
              <span className="block text-sm text-[#5B6B7B]">{p.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------- page ----------
export function InjectorPage({ product, option }: { product: InjectorProduct; option?: string }) {
  const variants = product.variants;
  const [idx, setIdx] = useState(() => Math.max(0, variants.findIndex((v) => v.sku === option)));
  const [qty, setQty] = useState(1);
  const [faq, setFaq] = useState<number | null>(0);
  const [showBar, setShowBar] = useState(false);
  const atcRef = useRef<HTMLButtonElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const selected = variants[idx];
  const single = variants[0];

  useEffect(() => {
    trackViewItem({ item_id: product.id, item_name: product.name, item_variant: selected.name, price: selected.price, currency: CURRENCY });
  }, [selected, product]);

  // Show the sticky add-to-cart bar once the main button has scrolled away.
  useEffect(() => {
    const el = atcRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = async (variantIndex: number, quantity: number) => {
    const v = variants[variantIndex];
    await addItem({
      variantId: `${product.id}:${v.sku}`,
      productId: product.id,
      title: product.name,
      variantTitle: v.name,
      image: GALLERY[0].medium,
      price: { amount: v.price.toFixed(2), currencyCode: CURRENCY },
      quantity,
    });
    trackAddToCart({ item_id: product.id, item_name: product.name, item_variant: v.name, price: v.price, quantity, currency: CURRENCY });
    toast.success("Added to cart", { description: `${product.name}, ${v.name}${quantity > 1 ? ` × ${quantity}` : ""}` });
  };

  const isPack = (v: (typeof variants)[number]) => v.sku === "two-pack";
  const perDevice = (v: (typeof variants)[number]) => Math.round((v.price / 2) * 100) / 100;
  const saving = (v: (typeof variants)[number]) => Math.round((1 - v.price / (single.price * 2)) * 100);

  return (
    <div className="bg-white pb-20 text-[#0E2A47] lg:pb-0" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Hero and buy box */}
      <Section className="pb-16 pt-5 sm:pt-7">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-[#5B6B7B]">
          <Link to="/" className="hover:text-[#0E2A47]">Home</Link>
          <span className="mx-2" aria-hidden>/</span>
          <span aria-current="page" className="text-[#0E2A47]">{product.name}</span>
        </nav>
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.92fr] lg:gap-14">
          <div className="min-w-0 lg:sticky lg:top-24">
            <Gallery />
          </div>

          <div className="min-w-0 space-y-6 lg:pt-1">
            <div className="space-y-3">
              <h1 className="text-[38px] font-bold leading-[1.02] tracking-[-0.035em] sm:text-[52px]">{product.name}</h1>
              <p className={`max-w-[46ch] ${LEAD}`}>
                A reusable device that delivers through the skin with a fast, narrow stream instead of a needle.
              </p>
            </div>

            <p className="text-[32px] font-bold tabular-nums tracking-[-0.02em]">
              <Price usd={selected.price} />
            </p>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold">Choose your kit</legend>
              <div className="space-y-2.5">
                {variants.map((v, i) => (
                  <label
                    key={v.sku}
                    className="flex cursor-pointer items-center gap-4 rounded-2xl border border-[#D6E2EC] bg-white px-4 py-4 transition-colors hover:border-[#9DBBD6] has-[:checked]:border-[#0E2A47] has-[:checked]:shadow-[inset_0_0_0_1px_#0E2A47] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#1E7FD6]"
                  >
                    <input type="radio" name="kit" value={v.sku} checked={i === idx} onChange={() => setIdx(i)} className="sr-only" />
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${i === idx ? "border-[#0E2A47]" : "border-[#B6C6D4]"}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${i === idx ? "bg-[#0E2A47]" : ""}`} />
                    </span>
                    <span className="flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-bold">{v.name}</span>
                        {isPack(v) && <span className="rounded-full bg-[#E3F1FC] px-2 py-0.5 text-xs font-semibold text-[#1665AE]">Save {saving(v)}%</span>}
                      </span>
                      <span className="block text-sm text-[#5B6B7B]">
                        {isPack(v) ? <>Two injectors, <Price usd={perDevice(v)} /> each</> : "One injector with starter kit"}
                      </span>
                    </span>
                    <span className="font-bold tabular-nums"><Price usd={v.price} /></span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex gap-3">
              <div className="inline-flex items-center rounded-full border border-[#D6E2EC]">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className={`h-14 w-11 rounded-l-full text-lg ${FOCUS}`}>−</button>
                <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite">{qty}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} className={`h-14 w-11 rounded-r-full text-lg ${FOCUS}`}>+</button>
              </div>
              <button
                ref={atcRef}
                type="button"
                onClick={() => add(idx, qty)}
                className="h-14 flex-1 rounded-full bg-[#1E7FD6] text-[16px] font-semibold text-white transition-colors hover:bg-[#1668B4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2A47]"
              >
                Add to cart, <Price usd={selected.price * qty} />
              </button>
            </div>

            <ul className="space-y-2 text-[15px] text-[#4A5D70]">
              {["Free delivery, ships in 3–7 days", "30-day returns on unopened devices", "Secure checkout in your local currency"].map((t) => (
                <li key={t} className="flex items-center gap-2.5"><span className="text-[#1E7FD6]"><Tick /></span>{t}</li>
              ))}
            </ul>

            <details className="group border-t border-[#E4ECF3] pt-4">
              <summary className={`flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold [&::-webkit-details-marker]:hidden ${FOCUS}`}>
                What's in the box
                <span className="text-lg text-[#1E7FD6] transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden>+</span>
              </summary>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-[#4A5D70]">
                {IN_THE_BOX.map((b) => <li key={b.name}>{b.name}</li>)}
              </ul>
            </details>
          </div>
        </div>
      </Section>

      <Section className="bg-[#EEF4FA] py-20 sm:py-24">
        <CrossSection />
      </Section>

      <Section className="py-20 sm:py-24">
        <Anatomy />
      </Section>

      <Section className="border-t border-[#E4ECF3] py-20 sm:py-24">
        <h2 className={H2}>Three steps to use it</h2>
        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, k) => (
            <li key={s.title}>
              <div className="overflow-hidden rounded-[20px] bg-[#EEF4FA]">
                <img src={IMG.steps[k]} width={900} height={900} loading="lazy" alt={`Step ${k + 1}, ${s.title.toLowerCase()}`} className="aspect-square w-full object-cover" />
              </div>
              <div className="mt-5 flex gap-4">
                <span className="text-[44px] font-bold leading-[0.9] tabular-nums text-[#1E7FD6]">{k + 1}</span>
                <div>
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="mt-1 leading-relaxed text-[#4A5D70]">{s.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-[#F7F5F0] py-20 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="min-w-0 overflow-hidden rounded-[22px] bg-[#F1EDE5]">
            <img src={IMG.kit.large} srcSet={`${IMG.kit.medium} 800w, ${IMG.kit.large} 1600w`} sizes="(min-width: 1024px) 620px, 100vw" width={1600} height={1600} loading="lazy" alt="Everything in the kit, laid out" className="h-auto w-full" />
          </div>
          <div className="min-w-0">
            <h2 className={H2}>What's in the box</h2>
            <p className={`mt-3 ${LEAD}`}>The device is built to last. Nozzles are the only part you replace, and we stock them.</p>
            <ul className="mt-8 divide-y divide-[#E2DDD3] border-y border-[#E2DDD3]">
              {IN_THE_BOX.map((b) => (
                <li key={b.name} className="flex items-baseline justify-between gap-6 py-3.5">
                  <span className="font-semibold">{b.name}</span>
                  <span className="text-right text-sm text-[#5B6B7B]">{b.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="py-20 sm:py-24">
        <h2 className={H2}>Needle or needle-free</h2>
        <dl className="mt-8 divide-y divide-[#E4ECF3] border-y border-[#E4ECF3] sm:hidden">
          {COMPARE.map((r) => (
            <div key={r.label} className="py-4">
              <dt className="font-semibold">{r.label}</dt>
              <dd className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <span className="text-[#5B6B7B]"><span className="block text-xs">Syringe and needle</span>{r.needle}</span>
                <span className="font-semibold"><span className="block text-xs font-normal text-[#5B6B7B]">Needle-free injector</span>{r.free}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 hidden sm:block">
          <table className="w-full border-collapse text-left text-[15px]">
            <caption className="sr-only">A syringe and needle compared with the needle-free injector</caption>
            <thead>
              <tr className="border-b-2 border-[#0E2A47]">
                <th scope="col" className="py-3 pr-4"><span className="sr-only">Feature</span></th>
                <th scope="col" className="py-3 pr-4 font-semibold text-[#5B6B7B]">Syringe and needle</th>
                <th scope="col" className="py-3 font-bold">Needle-free injector</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.label} className="border-b border-[#E4ECF3]">
                  <th scope="row" className="py-4 pr-4 font-semibold">{r.label}</th>
                  <td className="py-4 pr-4 text-[#5B6B7B]">{r.needle}</td>
                  <td className="py-4 font-semibold"><span className="inline-flex items-center gap-2"><span className="text-[#1E7FD6]"><Tick /></span>{r.free}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="bg-[#EEF4FA] py-20 sm:py-24">
        <h2 className={H2}>Single or 2-Pack</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {variants.map((v, i) => (
            <div key={v.sku} className="flex flex-col overflow-hidden rounded-[22px] bg-white">
              <img src={i === 0 ? IMG.hero.medium : IMG.twoPack.medium} width={800} height={800} loading="lazy" alt={i === 0 ? "One injector" : "Two injectors"} className="aspect-[4/3] w-full bg-[#F4F0E8] object-contain" />
              <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-2xl font-bold">{v.name}</h3>
                  <p className="text-2xl font-bold tabular-nums"><Price usd={v.price} /></p>
                </div>
                <p className="flex-1 leading-relaxed text-[#4A5D70]">
                  {isPack(v)
                    ? <>Two injectors at <Price usd={perDevice(v)} /> each, {saving(v)}% less than buying two singles.</>
                    : "One injector with its starter kit: nozzles, adapters, reset tool, carry case and guide."}
                </p>
                <button
                  type="button"
                  onClick={() => { setIdx(i); add(i, 1); }}
                  className={`h-12 rounded-full text-[15px] font-semibold transition-colors ${FOCUS} ${isPack(v) ? "bg-[#0E2A47] text-white hover:bg-[#1B3D61]" : "border-2 border-[#0E2A47] hover:bg-[#0E2A47] hover:text-white"}`}
                >
                  Add {v.name} to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-20 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="space-y-4 self-start border-l-4 border-[#1E7FD6] pl-6">
            <h2 className="text-[26px] font-bold leading-tight tracking-[-0.02em] sm:text-[30px]">Use it as directed</h2>
            <p className="leading-relaxed text-[#4A5D70]">This is a delivery device, not a medicine. Follow your prescriber's or pharmacist's instructions for what you use and how much.</p>
            <p className="leading-relaxed text-[#4A5D70]">Use a new sterile nozzle every time, and read the quick-start guide before your first use.</p>
          </div>
          <div>
            <h2 className={H2}>Questions</h2>
            <div className="mt-6 border-t border-[#E4ECF3]">
              {FAQ.map((f, k) => (
                <div key={f.q} className="border-b border-[#E4ECF3]">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setFaq(faq === k ? null : k)}
                      aria-expanded={faq === k}
                      aria-controls={`faq-${k}`}
                      className={`flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold ${FOCUS}`}
                    >
                      {f.q}
                      <span className="text-xl text-[#1E7FD6]" aria-hidden>{faq === k ? "−" : "+"}</span>
                    </button>
                  </h3>
                  <div id={`faq-${k}`} hidden={faq !== k} className="pb-5 pr-10 leading-relaxed text-[#4A5D70]">
                    {f.a}
                    {k === FAQ.length - 1 && <> <Link to="/refund-policy" className="font-semibold text-[#0E2A47] underline underline-offset-2">Read the refund policy</Link></>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Closing band */}
      <section className="overflow-hidden bg-[#0E2A47] text-white">
        <div className="mx-auto grid max-w-[1180px] items-center gap-6 px-4 pt-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-10">
          <div className="max-w-[420px] space-y-5 lg:py-16">
            <h2 className="text-[34px] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[44px]">Leave the needles out of it</h2>
            <p className="text-lg text-white/80">From <Price usd={single.price} />, with free delivery.</p>
            <button
              type="button"
              onClick={() => add(idx, qty)}
              className="h-14 rounded-full bg-white px-8 text-[16px] font-semibold text-[#0E2A47] transition-colors hover:bg-[#E3F1FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Add {selected.name} to cart
            </button>
          </div>
          <img src={IMG.navy.large} srcSet={`${IMG.navy.medium} 900w, ${IMG.navy.large} 1600w`} sizes="(min-width: 1024px) 700px, 100vw" width={1600} height={889} loading="lazy" alt="" className="-mx-4 w-[calc(100%+2rem)] max-w-none sm:mx-0 sm:w-full" />
        </div>
      </section>

      {/* Sticky add-to-cart bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#E4ECF3] bg-white/95 px-4 py-3 backdrop-blur transition-transform duration-300 motion-reduce:transition-none ${showBar ? "translate-y-0" : "translate-y-full"}`}
        aria-hidden={!showBar}
        inert={!showBar ? true : undefined}
      >
        <div className="mx-auto flex max-w-[1180px] items-center gap-4">
          <img src={GALLERY[0].thumb} width={44} height={44} alt="" className="hidden h-11 w-11 rounded-lg bg-[#F4F0E8] object-cover sm:block" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{product.name}, {selected.name}</p>
            <p className="text-sm tabular-nums text-[#5B6B7B]"><Price usd={selected.price * qty} /></p>
          </div>
          <button type="button" onClick={() => add(idx, qty)} className="h-11 shrink-0 rounded-full bg-[#1E7FD6] px-6 text-[15px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2A47]">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart";
import { trackAddToCart, trackViewItem } from "@/lib/analytics";
import { CURRENCY, formatGbp, type InjectorProduct } from "@/lib/injector";
import injectorImg from "@/assets/injector-device.jpg";

// Layout follows the flow of a typical needle-free device page (hero + buy box,
// explainer, needle vs needle-free, how it works, kit, responsible use, FAQ).
// All copy here is original; product imagery is our own asset.

const NAVY = "#0E2A47";
const BLUE = "#1E7FD6";

const HIGHLIGHTS = [
  { title: "No needle", body: "A fine, high-pressure stream passes through the skin, so there's no sharp to see, handle or dispose of." },
  { title: "Quick to use", body: "Load, place and press. Delivery takes a fraction of a second." },
  { title: "Built to reuse", body: "One durable device with replaceable single-use nozzles." },
  { title: "Travel-ready", body: "Packs into its own carry case with adapters and a quick-start guide." },
];

const COMPARE = [
  { label: "Sharps to handle", needle: "Yes — every dose", free: "None" },
  { label: "Sharps disposal", needle: "Sharps bin needed", free: "Not needed" },
  { label: "Delivery", needle: "Slow plunger push", free: "Under a second" },
  { label: "Hardware", needle: "Single-use syringe", free: "Reusable device" },
  { label: "Per-dose part", needle: "Needle + syringe", free: "Sterile nozzle" },
];

const STEPS = [
  { n: "1", title: "Load", body: "Click in a fresh sterile nozzle and draw your dose through the vial adapter." },
  { n: "2", title: "Position", body: "Rest the tip flat against clean skin at a right angle." },
  { n: "3", title: "Deliver", body: "Press the release. A quick pulse and you're done." },
];

const KIT = [
  { title: "Injector device", body: "Reusable spring-powered body" },
  { title: "Sterile nozzles", body: "Single-use starter set" },
  { title: "Vial & ampoule adapters", body: "For drawing your dose" },
  { title: "Reset tool", body: "Re-arms the device between uses" },
  { title: "Carry case", body: "Keeps everything together" },
  { title: "Quick-start guide", body: "Illustrated, step by step" },
];

const FAQ = [
  { q: "Does it hurt?", a: "Most people describe a brief snap or pressure rather than a needle prick. Everyone's skin is different, so sensation varies." },
  { q: "What's in the box?", a: "The injector, a starter set of sterile nozzles, vial and ampoule adapters, a reset tool, a carry case and an illustrated quick-start guide." },
  { q: "How often do nozzles need replacing?", a: "Nozzles are single-use. The starter set gets you going, and replacements are available from us." },
  { q: "How long does delivery take?", a: "Orders ship within 3–7 days, and UK delivery is free. We'll email your tracking number once it's on the way." },
  { q: "Can I return it?", a: "Yes. Unused devices in their original packaging can be returned. See our refund policy for the details." },
  { q: "Is it right for my medication?", a: "Not every medication or dose is suitable for needle-free delivery. Check with your prescriber or pharmacist before switching." },
];

function Tick() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M4 10.5l3.5 3.5L16 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Eyebrow({ children }: { children: string }) {
  return <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: BLUE }}>{children}</p>;
}

export function InjectorPage({ product, option }: { product: InjectorProduct; option?: string }) {
  const variants = product.variants;
  const [idx, setIdx] = useState(() => Math.max(0, variants.findIndex((v) => v.sku === option)));
  const [qty, setQty] = useState(1);
  const [faq, setFaq] = useState<number | null>(0);
  const addItem = useCartStore((s) => s.addItem);
  const selected = variants[idx];

  useEffect(() => {
    trackViewItem({ item_id: product.id, item_name: product.name, item_variant: selected.name, price: selected.price, currency: CURRENCY });
  }, [selected, product]);

  const handleAdd = async () => {
    await addItem({
      variantId: `${product.id}:${selected.sku}`,
      productId: product.id,
      title: product.name,
      variantTitle: selected.name,
      image: injectorImg,
      price: { amount: selected.price.toFixed(2), currencyCode: CURRENCY },
      quantity: qty,
    });
    trackAddToCart({ item_id: product.id, item_name: product.name, item_variant: selected.name, price: selected.price, quantity: qty, currency: CURRENCY });
    toast.success(`Added to cart — ${product.name}`, { description: selected.name });
  };

  return (
    <div className="bg-white" style={{ fontFamily: "Inter, sans-serif", color: NAVY }}>
      {/* Hero + buy box — standard product layout: gallery left, details right */}
      <section className="bg-white px-4 sm:px-6 pt-6 pb-14 sm:pt-10">
        <div className="max-w-[1200px] mx-auto grid gap-8 lg:gap-12 lg:grid-cols-[1.15fr_1fr] items-start">
          <div className="min-w-0 space-y-3 lg:sticky lg:top-24">
            <div className="aspect-square overflow-hidden rounded-xl bg-[#F4F6F8]">
              <img src={injectorImg} alt={product.name} width={1024} height={1024} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="min-w-0 space-y-5">
            <div className="space-y-2">
              <h1 className="text-[28px] sm:text-[30px] font-bold leading-tight tracking-[-0.01em]">{product.name}</h1>
              <p className="text-[26px] font-bold">{formatGbp(selected.price)} <span className="text-sm font-medium text-[#6B7C8D]">GBP</span></p>
            </div>

            <p className="flex items-start gap-2 text-sm text-[#4A5D70]">
              <span className="mt-0.5" style={{ color: BLUE }}><Tick /></span>
              <span><strong className="text-[#0E2A47]">Every kit includes</strong> the device, a starter set of sterile nozzles, vial and ampoule adapters, a reset tool, carry case and quick-start guide.</span>
            </p>

            <fieldset className="overflow-hidden rounded-xl border border-[#D6E4F2]">
              <legend className="sr-only">Choose your kit</legend>
              <div className="bg-[#EEF5FD] px-4 py-3">
                <p className="text-sm font-bold">Choose your kit</p>
                <p className="text-xs text-[#4A5D70]">Save £98 when you take the 2-Pack.</p>
              </div>
              {variants.map((v, i) => (
                <button
                  key={v.sku}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-pressed={i === idx}
                  className={`flex w-full items-center gap-4 border-t border-[#E4ECF3] px-4 py-4 text-left transition-colors ${i === idx ? "bg-white" : "bg-white hover:bg-[#F8FBFE]"}`}
                >
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${i === idx ? "border-[#1E7FD6]" : "border-[#B9C7D4]"}`}>
                    {i === idx && <span className="h-2.5 w-2.5 rounded-full bg-[#1E7FD6]" />}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold">{v.name}</span>
                    <span className="block text-xs text-[#6B7C8D]">{v.note}</span>
                  </span>
                  <span className="font-bold">{formatGbp(v.price)}</span>
                </button>
              ))}
            </fieldset>

            <div className="flex items-center justify-between border-y border-[#E4ECF3] py-4">
              <div>
                <p className="text-sm font-bold">Your total</p>
                <p className="text-xs text-[#6B7C8D]">One-time purchase</p>
              </div>
              <p className="text-xl font-bold">{formatGbp(selected.price * qty)}</p>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-[#F4F6F8] px-4 py-3 text-sm">
              <span style={{ color: BLUE }}><Tick /></span>
              <span><strong>Free tracked delivery</strong><br /><span className="text-xs text-[#6B7C8D]">UK delivery in 3–7 days</span></span>
            </div>

            <div className="flex gap-3">
              <div className="inline-flex items-center rounded-lg border border-[#C9D5E1]">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-[52px] w-11 text-lg">−</button>
                <span className="w-6 text-center font-semibold">{qty}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} className="h-[52px] w-11 text-lg">+</button>
              </div>
              <button type="button" onClick={handleAdd} className="h-[52px] flex-1 rounded-lg text-[15px] font-bold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90" style={{ background: BLUE }}>
                Add to cart →
              </button>
            </div>

            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-[#6B7C8D]">
              <li className="flex items-center gap-1"><Tick /> Secure checkout</li>
              <li className="flex items-center gap-1"><Tick /> Tracked delivery</li>
              <li><a href="/refund-policy" className="underline underline-offset-2">Returns policy</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-[1180px] mx-auto">
          <div className="max-w-2xl space-y-3">
            <Eyebrow>What it is</Eyebrow>
            <h2 className="text-[30px] sm:text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em]">One device. No needles. Fewer parts to throw away.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="rounded-3xl border border-[#E4ECF3] bg-white p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#EEF6FC]" style={{ color: BLUE }}><Tick /></span>
                <h3 className="mt-4 text-lg font-bold">{h.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#4A5D70]">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Needle vs needle-free */}
      <section className="bg-[#F5F9FC] px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-[900px] mx-auto text-center space-y-3">
          <Eyebrow>Side by side</Eyebrow>
          <h2 className="text-[30px] sm:text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em]">Needle vs. needle-free</h2>
        </div>
        <div className="max-w-[900px] mx-auto mt-10 overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_rgba(14,42,71,0.06)]">
          <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-[#E4ECF3] text-sm font-bold">
            <span className="p-4" />
            <span className="p-4 text-center text-[#6B7C8D]">Syringe &amp; needle</span>
            <span className="bg-[#EEF6FC] p-4 text-center" style={{ color: BLUE }}>Needle-free injector</span>
          </div>
          {COMPARE.map((r) => (
            <div key={r.label} className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-[#E4ECF3] last:border-0 text-sm">
              <span className="p-4 font-semibold">{r.label}</span>
              <span className="p-4 text-center text-[#6B7C8D]">{r.needle}</span>
              <span className="bg-[#EEF6FC] p-4 text-center font-semibold">{r.free}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center space-y-3">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-[30px] sm:text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em]">Three steps. About a second.</h2>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-3xl border border-[#E4ECF3] p-7">
                <span className="text-[56px] font-extrabold leading-none" style={{ color: BLUE }}>{s.n}.</span>
                <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-[#4A5D70]">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Kit + restock */}
      <section className="px-4 sm:px-6 py-16 sm:py-20" style={{ background: NAVY }}>
        <div className="max-w-[1180px] mx-auto grid gap-10 lg:grid-cols-[1fr_1.3fr] items-center text-white">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7DBBF0]">In the kit</p>
            <h2 className="text-[30px] sm:text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em]">Use the kit.<br />Restock the parts.</h2>
            <p className="text-white/70 max-w-md">The device is built to last. Nozzles are the only part you replace — and we stock them.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {KIT.map((k) => (
              <li key={k.title} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                <p className="font-bold">{k.title}</p>
                <p className="text-sm text-white/60">{k.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Responsible use */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-[900px] mx-auto rounded-3xl bg-[#F5F9FC] p-8 sm:p-12 text-center space-y-4">
          <Eyebrow>Designed for responsible use</Eyebrow>
          <h2 className="text-[26px] sm:text-[34px] font-extrabold leading-[1.15] tracking-[-0.02em]">A delivery device — not a substitute for medical advice.</h2>
          <p className="text-[#4A5D70]">Always follow your prescriber's instructions for what you use and how much. Use a new sterile nozzle every time, and read the quick-start guide before your first use.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#E4ECF3] px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-[760px] mx-auto">
          <h2 className="text-center text-[30px] sm:text-[40px] font-extrabold tracking-[-0.02em]">Questions we get a lot</h2>
          <div className="mt-8 divide-y divide-[#E4ECF3] rounded-3xl border border-[#E4ECF3]">
            {FAQ.map((f, k) => (
              <div key={f.q}>
                <button type="button" onClick={() => setFaq(faq === k ? null : k)} aria-expanded={faq === k} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-semibold">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EEF6FC] text-lg" style={{ color: BLUE }}>{faq === k ? "−" : "+"}</span>
                </button>
                {faq === k && <p className="px-6 pb-5 text-[15px] leading-relaxed text-[#4A5D70]">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

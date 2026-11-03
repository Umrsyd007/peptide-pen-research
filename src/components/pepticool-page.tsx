import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart";
import { trackAddToCart } from "@/lib/analytics";
import { CURRENCY, formatGbp, type InjectorProduct } from "@/lib/injector";

// Design and copy mirror pepticool.com's GLP-1 & Vial Travel Cooler page.
// Media is served from the PeptiCool Shopify CDN.
const CDN = "https://www.pepticool.com/cdn/shop";
const img = (path: string, width = 1200) => `${CDN}/files/${path}&width=${width}`;

export const PEPTICOOL_GALLERY = [
  "hf_20260813_201457_4c21c13a-7874-42cf-836b-d284716090fc_1.png?v=1786660755",
  "hf_20260813_210205_004bb40b-9e78-4e56-88fa-a26d20361eb7.png?v=1786655179",
  "hf_20261008_001552_c243f03d-e28a-4cb2-8749-e31da78ce69b.png?v=1791465529",
  "hf_20261008_002852_0ca04a35-5bd1-4d28-ab17-b11727327614.png?v=1791465536",
  "hf_20261008_002550_29521ba6-051d-41f8-a0a6-be685071c4c7.png?v=1791465533",
  "hf_20261008_002244_c004cef8-d9c6-42be-bacd-907ebabe7117.png?v=1791465530",
  "hf_20260813_202522_a221c3e2-e6a8-4a71-997e-745ac68fa06b.png?v=1786654613",
  "hf_20260813_203110_45ca18b9-3975-455f-8daf-81efb40b35c5.png?v=1786654634",
  "hf_20260813_205053_a02111a0-ae9c-45ae-a286-3f5efce7395d.png?v=1786654685",
  "hf_20260813_205254_32047f77-3a28-43c9-a18c-b1d803d539c0.png?v=1786654675",
  "hf_20260813_213012_a44620a8-8560-4b7e-839a-ee7121886a5e.png?v=1786661170",
  "hf_20260813_213358_f40f50b8-70e6-41b1-83ba-b1881b441225.png?v=1786661200",
  "hf_20260813_213626_6b6a9db8-0cf8-43ba-9009-d7563f0140bc.png?v=1786661213",
  "hf_20260813_213747_cb9f61ee-bc12-48c1-9d72-102e89e66f0d.png?v=1786661227",
];
export const PEPTICOOL_IMAGE = img(PEPTICOOL_GALLERY[0], 900);

const BLUE = "#136EA2";
const INK = "#14212B";

const HERO_REVIEWS = [
  { name: "Marcus T.", loc: "Austin, TX", text: "Finally, a cooler that actually keeps my GLP-1 pens at the right temp! Took it on an 8-hour flight, and the battery display stayed rock solid at 38°F. No ice pack mess, just pure peace of mind." },
  { name: "Sarah M.", loc: "Miami, FL", text: "I travel constantly for work, and carrying vials used to be a pain. PeptiCool fits easily in my backpack and charges right from my laptop's USB-C port. Super reliable and slick design." },
];

const FEATURES = ["No Ice Packs", "Precise 32–64°F Cooling", "Store Vials & Pens", "USB-C Power Anywhere", "Touchscreen", "Durable Design"];

const UGC = [
  { tag: "HOME SETUP", name: "Carl O.", loc: "Miami, FL", id: "368b2837abb542c8b7cbf36aa5de3633", file: "368b2837abb542c8b7cbf36aa5de3633.HD-1080p-7.2Mbps-96632206.mp4", poster: "368b2837abb542c8b7cbf36aa5de3633.thumbnail.0000000000_900x.jpg?v=1791331501" },
  { tag: "DAILY PROTOCOL", name: "Freddie S.", loc: "Houston, TX", id: "13d4f5f4054d4e4abc0d1269b30180b8", file: "13d4f5f4054d4e4abc0d1269b30180b8.HD-1080p-7.2Mbps-96632303.mp4", poster: "13d4f5f4054d4e4abc0d1269b30180b8.thumbnail.0000000000_900x.jpg?v=1791331642" },
  { tag: "TRAVEL READY", name: "Mike S.", loc: "NY, New York", id: "99fbef36b3ee4ddb88d9b7c438676c45", file: "99fbef36b3ee4ddb88d9b7c438676c45.HD-1080p-7.2Mbps-96632157.mp4", poster: "99fbef36b3ee4ddb88d9b7c438676c45.thumbnail.0000000000_900x.jpg?v=1791331547" },
];

const FIT = [
  { label: "OZEMPIC®", count: 5, unit: "pens" },
  { label: "MOUNJARO®", count: 5, unit: "pens" },
  { label: "WEGOVY®", count: 5, unit: "pens" },
  { label: "INSULIN VIALS", count: 5, unit: "10 ml vials" },
];

type Cell = "yes" | "no" | string;
const COMPARISON: { row: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { row: "Holds a set 36–46°F (2–8°C) precision temp", cells: ["yes", "no", "no", "yes"] },
  { row: "Touchscreen live temp readout & tap to lock", cells: ["yes", "no", "no", "yes"] },
  { row: "8-Hour battery with USB-C rechargeability", cells: ["8hr", "no", "no", "rare"] },
  { row: "No ice packs, nothing to freeze or melt", cells: ["yes", "no", "yes", "yes"] },
  { row: "Fits up to 5 GLP-1 pens, vials & cartridges", cells: ["yes", "yes", "no", "yes"] },
  { row: "TSA travel friendly & pocket-sized", cells: ["yes", "yes", "yes", "yes"] },
];

const TESTIMONIALS = [
  { name: "Alex Rivera", title: "Saved my vacation!", img: "hf_20261006_235659_37d3cb3e-427f-4ab0-9d1e-0b9555a4770e.png?v=1791332042", text: "I was super anxious about carrying my GLP-1 pens on an 8-hour flight to London. This cooler held the temperature at 38°F the entire time. No messy ice bags or leaking—just plugged it in via USB-C on the plane. Essential for anyone taking weekly injections!" },
  { name: "David Chen", title: "Must Have", img: "hf_20261007_000007_6b957ab2-23da-4149-ab90-d8bae590b90e.png?v=1791332186", text: "The best feature is the digital temp readout on the front. I store both peptides and insulin vials in it, and knowing the exact temperature inside without opening the bottle is amazing. Super quiet and sleek build." },
  { name: "Samantha Miller", title: "Worth every single penny", img: "hf_20261007_000118_c7bfd37b-eefc-4219-85c2-e276800f8e06.png?v=1791332245", text: "Solid premium feel and whisper-quiet operation. I keep it on my office desk all day, so I don't have to leave my sensitive medication in the shared breakroom fridge. Highly recommend!" },
  { name: "Jordan Blake", title: "Breezed through airport security", img: "hf_20260813_203237_f7fee772-37a6-40ea-9a86-dad532704c44.png?v=1786660753", text: "Went through TSA with no issues at all since it doesn't rely on traditional frozen gel packs. It slips right into the side pocket of my travel backpack, and the protective sleeve keeps it scratch-free." },
];

const FAQ = [
  { q: "How does the cooling technology work in this device?", a: "PeptiCool uses thermoelectric cooling technology that draws heat away from the internal chamber without needing traditional ice packs. Integrated smart sensors continuously monitor and regulate internal temperature to keep your sensitive medications safe." },
  { q: "Can I adjust the internal temperature for different medications?", a: "Yes. The digital thermostat allows exact adjustment between 36°F and 64°F (1°C to 18°C), making it versatile for GLP-1 pens, insulin, growth hormones, and reconstituted peptides." },
  { q: "Is this travel cooler approved by TSA for flight carry-ons?", a: "Absolutely. Since it contains no liquid gel packs or hazardous ice, it passes through airport security checkpoints without hassle. Simply carry it in your personal bag." },
  { q: "How can I keep the cooler running on continuous long trips?", a: "Beyond its internal battery, you can plug the included USB-C cable into a power bank, airplane seat port, laptop, or 12V vehicle adapter for endless cooling." },
  { q: "What is the maximum storage capacity inside the chamber?", a: "It comfortably holds up to 5 standard-sized injector pens (like Ozempic, Mounjaro, or Humalog) or a combination of 6 to 8 small medicine vials." },
  { q: "How long does a full battery charge last in hot weather?", a: "The high-density battery provides up to 8 hours of active power under normal ambient conditions, keeping your medicine at safe target temps all day." },
  { q: "How fast will my order arrive after placing it?", a: "We dispatch all orders within 24 hours. Domestic delivery typically takes 3 to 5 business days, with expedited shipping options available at checkout." },
  { q: "What is your return policy if it doesn't meet my needs?", a: "We offer a 30-day trial period. If the unit doesn't fit your daily routine or travel setup, send it back within 30 days for a complete refund." },
  { q: "Does the device come with protection against defects or failures?", a: "Yes, every unit includes a 1-year limited warranty that protects against electronic, battery, or cooling system performance defects." },
];

function Stars({ className = "" }: { className?: string }) {
  return <span className={`tracking-[2px] ${className}`} aria-label="5 out of 5 stars">★★★★★</span>;
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 ${className}`} aria-hidden>
      <path d="M4 10.5l3.5 3.5L16 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Gallery() {
  const [i, setI] = useState(0);
  const n = PEPTICOOL_GALLERY.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[#0b0e14]">
        <img src={img(PEPTICOOL_GALLERY[i], 1400)} alt="PeptiCool™ — GLP-1 & Vial Travel Cooler" className="h-full w-full object-cover" />
        <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#14212B] shadow">‹</button>
        <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#14212B] shadow">›</button>
        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#14212B]">{i + 1} / {n}</span>
      </div>
      <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {PEPTICOOL_GALLERY.map((g, k) => (
          <button key={g} type="button" onClick={() => setI(k)} aria-label={`Show image ${k + 1}`} className={`h-[76px] w-[76px] shrink-0 overflow-hidden rounded-lg border-2 ${k === i ? "border-[#136EA2]" : "border-transparent opacity-70 hover:opacity-100"}`}>
            <img src={img(g, 160)} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function HeroReviews() {
  const [i, setI] = useState(0);
  const r = HERO_REVIEWS[i];
  return (
    <div className="rounded-2xl border border-[#e3eef5] bg-white p-5 shadow-[0_8px_24px_rgba(20,33,43,0.06)]">
      <div className="flex gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e6f4fb] text-sm font-bold text-[#136EA2]">{r.name[0]}</span>
        <div className="space-y-2">
          <Stars className="text-[#F5A623] text-sm" />
          <p className="text-[15px] leading-relaxed text-[#14212B]">{r.text}</p>
          <div className="flex items-end justify-between gap-4">
            <p className="text-sm"><span className="font-bold text-[#14212B]">{r.name}</span><br /><span className="text-xs text-[#6b7a86]">{r.loc}</span></p>
            <div className="flex gap-1">
              {HERO_REVIEWS.map((_, k) => (
                <button key={k} type="button" onClick={() => setI(k)} aria-label={`Review ${k + 1}`} className={`h-8 w-8 rounded-full border text-xs ${k === i ? "border-[#136EA2] text-[#136EA2]" : "border-[#d8e3ea] text-[#6b7a86]"}`}>{k === 0 ? "‹" : "›"}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuyBox({ product }: { product: InjectorProduct }) {
  const variant = product.variants[0];
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const add = async () => {
    await addItem({
      variantId: `${product.id}:${variant.sku}`,
      productId: product.id,
      title: product.name,
      variantTitle: variant.name,
      image: PEPTICOOL_IMAGE,
      price: { amount: variant.price.toFixed(2), currencyCode: CURRENCY },
      quantity: qty,
    });
    trackAddToCart({ item_id: product.id, item_name: product.name, item_variant: variant.name, price: variant.price, quantity: qty, currency: CURRENCY });
    toast.success(`Added to cart — ${product.name}`);
  };
  return (
    <div className="rounded-[20px] bg-white p-6 sm:p-[33px] shadow-[0_10px_40px_rgba(20,33,43,0.08)] space-y-5">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#e6f4fb] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#136EA2]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#136EA2]" /> Reliable temperature control on the go
      </span>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.06em] text-[#14212B]">
          <Stars className="text-[#F5A623]" /> Trusted by 30,000 peptide users worldwide
        </div>
        <h1 className="text-[30px] lg:text-[40px] font-bold leading-[1.1] tracking-[-0.03em]" style={{ color: INK }}>{product.name}</h1>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {FEATURES.map((f) => (
          <li key={f} className="flex min-h-[41px] items-center gap-2 rounded-xl bg-[#f1fbff] p-[11px] text-[13px] leading-tight font-semibold text-[#14212B]">
            <Check className="text-[#136EA2]" /> {f}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7a86]">
        <span className="h-px flex-1 bg-[#e3eef5]" /> Bundle &amp; save <span className="h-px flex-1 bg-[#e3eef5]" />
      </div>
      <div className="rounded-2xl border-2 border-[#136EA2] bg-[#f6fbfe] p-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-[#136EA2]"><span className="h-2.5 w-2.5 rounded-full bg-[#136EA2]" /></span>
          <div>
            <p className="font-bold text-[#14212B]">Buy 1</p>
            <span className="mt-1 inline-block rounded-md bg-[#dff5e6] px-2 py-0.5 text-[10px] font-bold text-[#1f7a3d]">Choose Your Battery Life !</span>
            <p className="mt-1 text-xs font-semibold text-[#136EA2]">Regular Price</p>
          </div>
        </div>
        <p className="text-xl font-bold text-[#14212B]">{formatGbp(variant.price)}</p>
      </div>
      <div className="flex gap-3">
        <div className="inline-flex items-center rounded-xl border border-[#d8e3ea]">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-[54px] w-10 text-lg">−</button>
          <span className="w-6 text-center font-semibold">{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} className="h-[54px] w-10 text-lg">+</button>
        </div>
        <button type="button" onClick={add} className="flex-1 h-[54px] rounded-xl text-white text-[15px] font-extrabold transition-opacity hover:opacity-90" style={{ background: BLUE }}>
          Add to cart · {formatGbp(variant.price * qty)}
        </button>
      </div>
      <div className="rounded-2xl bg-[#f1fbff] p-4 space-y-1.5">
        <p className="font-bold text-[#14212B]">Less than 1% claim our 30-Day Money Back Guarantee</p>
        <p className="text-sm text-[#55636e]">We stand behind PeptiCool™ with a full 30-day satisfaction guarantee. If it's not right for you, we'll make it right.</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-[#14212B]">
        {["30 day money back", "Worldwide shipping", "Insured"].map((b) => (
          <div key={b} className="rounded-xl border border-[#e3eef5] px-2 py-3">{b}</div>
        ))}
      </div>
    </div>
  );
}

function UgcSection() {
  return (
    <section className="bg-[#F1FBFF] py-16 sm:py-[88px] px-4">
      <div className="max-w-[860px] mx-auto text-center space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#136EA2]">Real people. Real protocols.</p>
        <h2 className="text-[32px] sm:text-[48px] font-normal leading-[1.03] tracking-[-0.035em] text-[#16212A]">Rated 4.8 by 30,000+ peptide users</h2>
        <p className="text-[#55636e]">See how PeptiCool fits into real routines at home and on the move.</p>
      </div>
      <div className="mx-auto mt-10 grid max-w-[945px] gap-[30px] sm:grid-cols-3">
        {UGC.map((u) => (
          <figure key={u.id} className="overflow-hidden rounded-[18px] bg-white shadow-[0_10px_30px_rgba(20,33,43,0.08)]">
            <div className="relative aspect-[295/480] bg-black">
              <video controls preload="none" playsInline poster={`${CDN}/files/preview_images/${u.poster}`} className="h-full w-full object-cover">
                <source src={`${CDN}/videos/c/vp/${u.id}/${u.file}?v=0`} type="video/mp4" />
              </video>
              <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-[#14212B]">{u.tag}</span>
            </div>
            <figcaption className="p-4 text-left space-y-1">
              <Stars className="text-[#1cb5b0] text-sm" />
              <p className="text-sm font-bold text-[#14212B]"><span className="text-[#1cb5b0]">✓</span> {u.name}</p>
              <p className="text-xs text-[#6b7a86]">{u.loc}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function ActiveCooling() {
  const [cells, setCells] = useState(2);
  return (
    <section className="bg-[#0B0E14] text-white py-16 sm:py-[70px] px-4 sm:px-6">
      <div className="max-w-[1232px] mx-auto grid gap-12 lg:grid-cols-2 items-center">
        <div className="overflow-hidden rounded-[20px] bg-black">
          <img src={img("Untitled_design_12_feaa9b89-9198-410c-a36a-4967c6c05180.png?v=1789354073", 1200)} alt="PeptiCool with charging cable and carry sleeve" loading="lazy" className="w-full object-cover" />
        </div>
        <div className="space-y-7">
          <h2 className="text-[32px] sm:text-[38px] font-bold leading-[1.18] tracking-[-0.01em]">Active Cooling is the breakthrough</h2>
          {[
            ["7-9 hrs", "Of active cordless cooling per fully charged 9,000 mAh Power Cell."],
            ["2-8°C (36-46°F)", "Precision temperature control, live readout & tap-to-lock touch display."],
            ["33.3 Wh", "Per battery cell — 100% compliant with TSA & airline carry-on safety limits."],
          ].map(([big, body]) => (
            <div key={big} className="grid sm:grid-cols-[auto_1fr] gap-x-6 gap-y-1 items-center border-b border-white/10 pb-6">
              <p className="text-[32px] sm:text-[38px] font-bold text-[#44B0FF] whitespace-nowrap">{big}</p>
              <p className="text-sm text-white/70">{body}</p>
            </div>
          ))}
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">Runtime scales with the cells you carry</p>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 px-2 py-1.5">
              <button type="button" aria-label="Fewer power cells" onClick={() => setCells((c) => Math.max(1, c - 1))} className="grid h-7 w-7 place-items-center rounded-full border border-[#44B0FF] text-[#44B0FF]">−</button>
              <span className="text-sm font-semibold">{cells} Power Cell{cells > 1 ? "s" : ""}</span>
              <button type="button" aria-label="More power cells" onClick={() => setCells((c) => Math.min(4, c + 1))} className="grid h-7 w-7 place-items-center rounded-full border border-[#44B0FF] text-[#44B0FF]">+</button>
            </div>
            <div className="flex gap-1.5" aria-hidden>
              {Array.from({ length: 4 }, (_, k) => (
                <span key={k} className={`h-9 w-5 rounded-md border-2 ${k < cells ? "border-[#44B0FF] bg-[#44B0FF]" : "border-white/25"}`} />
              ))}
            </div>
            <p className="text-[44px] font-bold leading-none text-[#44B0FF]">{cells * 7}–{cells * 9} <span className="text-sm font-normal text-white/70">hrs cordless</span></p>
            <p className="text-sm text-white/70">Held across {cells} swappable Power Cell{cells > 1 ? "s" : ""} — run one, swap in a fresh cell in seconds, repeat as far as your trip goes.</p>
            <p className="text-sm text-white/70">Each Power Cell adds 7–9 hrs of cordless cooling. Your kit ships with 1–2; stack extra spare Power Cells for long-haul flights or fully off-grid days.</p>
            <p className="text-xs text-white/45">Runtime per cell is typical after the first few charge cycles and varies with ambient heat and lid opening. Plugged into any Type-C source, Cooler Pro holds your set temperature indefinitely; spare Power Cells recharge separately on the included cable in 6-7 hours.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FitFinder() {
  const [sel, setSel] = useState(0);
  const f = FIT[sel];
  return (
    <section className="bg-[#070C12] text-white py-16 sm:py-[90px] px-4 sm:px-6">
      <div className="max-w-[1232px] mx-auto grid gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#60C5F8]">Medication compatibility finder</p>
          <h2 className="max-w-[614px] text-[34px] sm:text-[52px] font-bold leading-[1.08] tracking-[-0.02em]">Find the exact fit for your pens &amp; vials.</h2>
          <p className="text-white/70 max-w-lg">Select your specific prescription pen, cartridge, or peptide vial to visualize chamber capacity. We’ll display how many units fit comfortably inside your PeptiCool™ or PeptiCool XL travel cooler.</p>
          <div className="flex flex-wrap gap-2">
            {["100+ Verified Pen Formats", "GLP-1 & Insulin Compatible", "PeptiCool Classic & XL"].map((p) => (
              <span key={p} className="rounded-full border border-white/15 px-3.5 py-2 text-xs text-white/80">{p}</span>
            ))}
          </div>
          <a href="#pc-specs" className="inline-flex h-12 items-center rounded-[30px] bg-[#60C5F8] px-7 text-sm font-bold text-[#050A10]">Check My Fit →</a>
          <p className="text-xs text-white/45">Capacity guides are based on standard dimensions. Please verify your specific pen or vial measurements prior to travel.</p>
        </div>
        <div className="w-full max-w-[558px] justify-self-end rounded-[24px] border border-white/10 bg-gradient-to-b from-[#121b26] to-[#0a1018] p-6 sm:p-8">
          <div className="grid grid-cols-[1fr_auto] gap-6 items-center">
            <div className="relative overflow-hidden rounded-2xl bg-black">
              <img src={img("download_58.png?v=1789375388", 700)} alt="Interactive chamber preview" loading="lazy" className="w-full object-cover" />
              <p className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold">
                Fits up to <span className="text-[#60C5F8]">{f.count}</span> {f.unit}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {FIT.map((o, k) => (
                <button key={o.label} type="button" onClick={() => setSel(k)} aria-pressed={k === sel} className={`rounded-full px-4 py-2 text-[11px] font-bold tracking-[0.06em] transition-colors ${k === sel ? "bg-white text-[#050A10] ring-2 ring-[#60C5F8]" : "bg-white/80 text-[#050A10] hover:bg-white"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Interactive chamber preview</p>
        </div>
      </div>
    </section>
  );
}

function Specs() {
  return (
    <section id="pc-specs" className="bg-[#F7F4EE] py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-[1100px] mx-auto grid gap-10 lg:grid-cols-[1fr_567px] items-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-[340px] flex-col items-center justify-between text-[10px] text-[#8a8f94]">
              <span>┬</span><span className="[writing-mode:vertical-rl] rotate-180">10.8" · 27.5 cm</span><span>┴</span>
            </div>
            <div className="relative flex h-[340px] w-[140px] flex-col items-center justify-center gap-4 rounded-[56px] bg-[#1d232b] shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col items-center gap-2 rounded-[28px] bg-black px-5 py-6">
                <span className="text-xl font-bold text-white">02°</span>
                <span className="text-[#44B0FF]">+</span>
                <span className="text-[#44B0FF]">−</span>
                <span className="h-3 w-3 rounded-full border border-[#44B0FF]" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#44B0FF]">PEPTICOOL</span>
            </div>
            <div className="flex h-[250px] flex-col items-center justify-between text-[10px] text-[#136EA2]">
              <span>┬</span><span className="[writing-mode:vertical-rl] rotate-180">7.0" · 17.8 cm interior</span><span>┴</span>
            </div>
          </div>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a8f94]">Exterior 27.5 × 8 cm · 900 g</p>
        </div>
        <div className="space-y-5">
          <div className="rounded-[20px] bg-white p-7 shadow-[0_8px_24px_rgba(20,33,43,0.05)]">
            <h3 className="text-[24px] font-bold leading-[1.2] text-[#14212B]">Free space</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a8f94]">Interior chamber</p>
            <div className="mt-4 flex items-center gap-4 border-b border-[#efefef] pb-4">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-[#d8d8d8] text-[#14212B]">⤢</span>
              <p><span className="text-[34px] font-bold text-[#14212B]">1.97"</span><br /><span className="text-xs text-[#8a8f94]">5.0 cm across</span></p>
            </div>
            <p className="mt-3 text-xs text-[#8a8f94]">17.8 cm deep · pens ride upright, longest at a slight diagonal</p>
          </div>
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_24px_rgba(20,33,43,0.05)]">
            <h3 className="text-[24px] font-bold leading-[1.2] text-[#14212B]">What fits inside</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a8f94]">Up to — per trip</p>
            <ul className="mt-3 divide-y divide-[#efefef]">
              {[
                ["5", "Slim insulin or GLP-1 pens", "Humalog, Lantus, Wegovy single-dose"],
                ["5", "10 ml vials", "standard glass vials"],
                ["24", "3 ml cartridges", "e.g. Humulin® refills"],
              ].map(([n, t, s]) => (
                <li key={t} className="flex items-center gap-4 py-3">
                  <span className="w-14 text-2xl font-bold text-[#14212B]">{n} <span className="text-sm font-normal text-[#8a8f94]">×</span></span>
                  <span><span className="block text-sm font-bold text-[#14212B]">{t}</span><span className="text-xs text-[#8a8f94]">{s}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Comparison({ price }: { price: number }) {
  const mark = (c: Cell, hi = false) =>
    c === "yes" ? <span className={hi ? "text-[#136EA2]" : "text-[#1f8fd6]"}>✓</span>
    : c === "no" ? <span className="text-[#c4cbd2]">✕</span>
    : c === "8hr" ? <span className="text-[#136EA2] font-bold">✓ 8-hr<br /><span className="text-[10px] font-normal text-[#8a8f94]">all-day cooling</span></span>
    : <span className="text-[#8a8f94]">{c}</span>;
  return (
    <section className="bg-[#F7FBFE] py-16 sm:py-20 px-4">
      <div className="max-w-[980px] mx-auto text-center space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#136EA2]">The difference</p>
        <h2 className="text-[30px] sm:text-[42px] font-extrabold leading-[1.2] tracking-[-0.03em] text-[#14212B]">The end of melting ice packs.</h2>
      </div>
      <div className="max-w-[980px] mx-auto mt-10 overflow-x-auto rounded-[18px] bg-white shadow-[0_10px_40px_rgba(20,33,43,0.06)]">
        <table className="w-full min-w-[640px] text-[15px] text-[#1E293B]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="p-4 text-left font-normal" />
              <th className="bg-[#F0F8FF] p-4 font-bold text-[#136EA2]">PeptiCool</th>
              <th className="p-4 font-semibold">Gel ice packs</th>
              <th className="p-4 font-semibold">Frío® evaporative</th>
              <th className="p-4 font-semibold">Other active coolers*</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((r) => (
              <tr key={r.row} className="border-b border-[#E2E8F0]">
                <td className="px-5 py-[18px] text-left text-[14px]">{r.row}</td>
                {r.cells.map((c, k) => (
                  <td key={k} className={`p-4 text-center ${k === 0 ? "bg-[#F0F8FF]" : ""}`}>{mark(c, k === 0)}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4 text-left text-[13px]">Price</td>
              <td className="bg-[#F0F8FF] p-4 text-center font-bold text-[#136EA2]">from {formatGbp(price)}</td>
              <td className="p-4 text-center text-[#8a8f94]">£8–16</td>
              <td className="p-4 text-center text-[#8a8f94]">~£24</td>
              <td className="p-4 text-center text-[#8a8f94]">~£235</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-center font-semibold text-[#136EA2]">True refrigeration that walks away from the wall — below the price of other active coolers.</p>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-[1180px] mx-auto text-center space-y-2">
        <h2 className="text-[28px] sm:text-[35px] font-bold leading-[1.23] tracking-[-0.02em] text-[#14212B]">Join over 30,000+ Happy Customers</h2>
        <p className="text-sm text-[#55636e]"><span className="font-bold text-[#14212B]">Excellent</span> <Stars className="text-[#1cb5b0]" /> 4.8 | 10,000+ Customers</p>
      </div>
      <div className="max-w-[1180px] mx-auto mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t) => (
          <article key={t.name} className="overflow-hidden rounded-[18px] border border-[#e3eef5] bg-white shadow-[0_8px_24px_rgba(20,33,43,0.05)]">
            <img src={img(t.img, 700)} alt="" loading="lazy" className="aspect-square w-full object-cover" />
            <div className="p-5 space-y-2 text-left">
              <Stars className="text-[#1cb5b0] text-sm" />
              <h3 className="font-bold text-[#14212B]">{t.title}</h3>
              <p className="text-sm leading-relaxed text-[#55636e]">{t.text}</p>
              <p className="pt-1 text-sm font-semibold text-[#14212B]">{t.name}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="bg-[#F1FBFF] py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-[760px] mx-auto mb-12 text-center space-y-3">
        <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#126EA2]">Need to know</p>
        <h2 className="text-[34px] sm:text-[48px] font-bold leading-[1.05] tracking-[-0.02em] text-[#126EA2]">Frequently Asked Questions</h2>
        <p className="text-[#55636e]">Find quick answers to the most common questions about our product.</p>
      </div>
      <div className="max-w-[1100px] mx-auto grid gap-3.5 md:grid-cols-2 items-start">
        {FAQ.map((f, k) => {
          const isOpen = open === k;
          return (
            <div key={f.q} className={`overflow-hidden rounded-2xl border bg-white shadow-[0_10px_32px_rgba(29,65,74,0.08)] transition-colors ${isOpen ? "border-[#126EA2]/60" : "border-[#e3eef5]"}`}>
              <button type="button" onClick={() => setOpen(isOpen ? null : k)} aria-expanded={isOpen} className="flex min-h-[96px] w-full items-center justify-between gap-6 px-7 py-[22px] text-left">
                <span className="text-[17px] font-semibold leading-[1.3] text-[#126EA2]">{f.q}</span>
                <span className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-lg transition-colors ${isOpen ? "bg-[#126EA2] text-white" : "bg-[#e6f4fb] text-[#126EA2]"}`}>{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && <p className="px-7 pb-[22px] text-[15px] leading-relaxed text-[#55636e]">{f.a}</p>}
            </div>
          );
        })}
      </div>
      <p className="mx-auto mt-8 max-w-xl rounded-[14px] border border-[#126EA2]/20 bg-white/70 px-5 py-4 text-center text-sm text-[#55636e]">
        Still have a question? <a href="/contact" className="font-semibold text-[#126EA2] underline underline-offset-2">Contact our support team</a> and we’ll be happy to help.
      </p>
    </section>
  );
}

export function PepticoolPage({ product }: { product: InjectorProduct }) {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="text-[#14212B]">
      <section className="bg-[#eaf6fc] px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-[1232px] mx-auto grid gap-10 lg:grid-cols-2 items-start">
          <div className="min-w-0 space-y-5 lg:sticky lg:top-24">
            <Gallery />
            <HeroReviews />
          </div>
          <div className="min-w-0"><BuyBox product={product} /></div>
        </div>
      </section>
      <UgcSection />
      <ActiveCooling />
      <section className="bg-white px-4 py-20 text-center">
        <h2 className="mx-auto max-w-[600px] text-[28px] sm:text-[35px] font-bold leading-[1.2] tracking-[-0.02em] text-[#14212B]">Precision cooling built for your essential peptides.</h2>
      </section>
      <FitFinder />
      <Specs />
      <Comparison price={product.variants[0].price} />
      <Testimonials />
      <Faq />
    </div>
  );
}

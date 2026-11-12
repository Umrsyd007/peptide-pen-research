import { createFileRoute, Link } from "@tanstack/react-router";
import { PenDosageCalculator } from "@/components/pen-dosage-calculator";

/**
 * How-to video source. Set type to "youtube" (paste a YouTube link) or
 * "file" (an uploaded video URL). Leave src empty to show a placeholder.
 */
const VIDEO: { type: "youtube" | "file"; src: string; thumbnail?: string; uploadDate?: string } = {
  type: "youtube",
  src: "",
};

const TITLE = "How to Use Peptide Pen | Step-by-Step Video Guide";
const DESCRIPTION =
  "How to use your PeptidePen: video guide, step-by-step mixing, priming and injecting instructions, a units dosage calculator and FAQs.";
const URL = "https://getpeptidepen.com/how-to-use-peptide-pen";

// Steps from the printed PeptidePen Instructions for Use leaflet.
const STEPS = [
  { name: "Before you start", text: "Take the pen out of the fridge and let it reach room temperature (15–20 minutes). Have alcohol swabs and a sharps container ready. Do not use if the seal is broken or the pen is past its expiry date." },
  { name: "Remove the pen cap (first use only)", text: "Pull the pen cap straight off." },
  { name: "Load the cartridge (first use only)", text: "Slide the dual-chamber cartridge into the clear cartridge holder, metal cap first, until it stops." },
  { name: "Twist to mix (first use only)", text: "Hold the pen with the cartridge holder pointing up. Screw the holder onto the pen until you hear and feel a click. This pushes the liquid into the powder. Keep gently twisting only while the holder turns freely — do not force beyond a stop." },
  { name: "Check the solution (first use only)", text: "Gently tilt or roll the pen from side to side. Do not shake. The solution should be clear with no powder left. Do not use it if it stays cloudy or has particles. Small air bubbles are normal and settle over time." },
  { name: "Attach a new needle", text: "Peel the paper tab off a new 31G or 32G pen needle. Screw it onto the pen until tight. Pull off the outer needle cap and keep it. Pull off the inner cap and throw it away." },
  { name: "Prime the pen (first use only)", text: "Turn the dose knob to 2 units. Point the needle up and press the dose button all the way in. Repeat until a drop appears at the needle tip." },
  { name: "Dial your dose", text: "Turn the dose knob until the counter shows the number of units on your product label. The counter shows units, not mg or mL." },
  { name: "Inject", text: "Clean the skin and let it dry. Gently pinch the skin and insert the needle straight in. Press and hold the dose button until the counter reaches 0, then keep the needle in for a further 6 seconds before pulling it out." },
  { name: "Remove the needle and store the pen", text: "Put the outer needle cap back on, unscrew the needle and put it in a sharps container. Replace the pen cap. Store in the fridge at 2–8°C, protected from light. Do not freeze." },
];

const FAQS = [
  { q: "Why does the pen show units instead of mg?", a: "The dose counter measures liquid, not powder. 100 units equals 1 mL, so the full 1.25 mL cartridge holds 125 units. Use the calculator above or the units on your product label to turn milligrams into units." },
  { q: "How do I work out how many units to dial?", a: "Divide your amount by the pen strength, then multiply by 125. For example, 2.5 mg from a 20 mg pen is 2.5 ÷ 20 × 125 ≈ 15.6 units, so about 16 units on the dial." },
  { q: "Do I need to mix the pen every time?", a: "No. You mix it once, on first use (steps 2–5). After that, skip mixing and priming and start from attaching a new needle." },
  { q: "When should I mix the cartridge?", a: "Only when you are ready to start using the pen. Once mixed, keep it in the fridge." },
  { q: "There are air bubbles after mixing. Is that OK?", a: "Yes. Small bubbles are normal and settle over time. Priming on first use helps remove trapped air." },
  { q: "The powder hasn't fully dissolved. What should I do?", a: "Keep gently rolling and twisting until the solution is clear. Never shake. If it stays cloudy or has particles, do not use it." },
  { q: "Why do I prime with 2 units?", a: "Priming clears air from the needle and cartridge so your first dose is accurate. It is only needed on first use." },
  { q: "Why hold the needle in for 6 seconds?", a: "It lets the full dose leave the needle. Pulling out too early can leave some liquid behind." },
  { q: "Which needles fit the pen?", a: "Standard 31G or 32G screw-on pen needles. Four come in the box. Use a new needle every time." },
  { q: "How should I store the pen?", a: "In the fridge at +2°C to +8°C, without a needle attached, with the cap on and away from light. Do not freeze." },
  { q: "Can I refill or reuse the pen?", a: "No. Use one cartridge per pen. When the cartridge is empty, dispose of the whole pen. Never share your pen or needles." },
  { q: "What's in the box?", a: "The pen with pen cap, a clear cartridge holder, a dual-chamber cartridge (peptide powder and 1.25 mL bacteriostatic water) and 4 pen needles. Alcohol swabs and a sharps container are not included." },
];

function youtubeId(src: string) {
  const m = src.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

function ldScripts() {
  const ytId = VIDEO.type === "youtube" ? youtubeId(VIDEO.src) : null;
  const hasVideo = VIDEO.type === "file" ? !!VIDEO.src : !!ytId;
  const scripts: { type: string; children: string }[] = [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to use Peptide Pen",
        description: DESCRIPTION,
        step: STEPS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text, url: `${URL}#step-${i + 1}` })),
      }),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }),
    },
  ];
  if (hasVideo) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: "How to use Peptide Pen",
        description: DESCRIPTION,
        thumbnailUrl: VIDEO.thumbnail ?? (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined),
        uploadDate: VIDEO.uploadDate ?? "2026-11-12",
        ...(ytId ? { embedUrl: `https://www.youtube.com/embed/${ytId}` } : { contentUrl: VIDEO.src }),
      }),
    });
  }
  return scripts;
}

export const Route = createFileRoute("/how-to-use-peptide-pen")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index,follow,max-video-preview:-1" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "video.other" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: ldScripts(),
  }),
  component: HowToPage,
});

function VideoPlayer() {
  const ytId = VIDEO.type === "youtube" ? youtubeId(VIDEO.src) : null;
  if (ytId) {
    return (
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
        title="How to use Peptide Pen video"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  }
  if (VIDEO.type === "file" && VIDEO.src) {
    return (
      <video className="h-full w-full" src={VIDEO.src} poster={VIDEO.thumbnail} controls playsInline preload="metadata">
        Your browser does not support video playback.
      </video>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center text-muted-foreground">Video coming soon</div>
  );
}

function HowToPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">How to Use Peptide Pen</h1>
      <p className="mt-3 text-muted-foreground">
        Watch the video, then follow the written steps below. Always follow the instructions printed in your manual.
      </p>
      <div className="mt-6 aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
        <VideoPlayer />
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Step-by-step instructions</h2>
        <ol className="mt-4 space-y-5">
          {STEPS.map((s, i) => (
            <li key={s.name} id={`step-${i + 1}`} className="rounded-lg border border-border p-4">
              <h3 className="font-medium">
                Step {i + 1}: {s.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-10" id="dosage-calculator">
        <h2 className="text-2xl font-semibold">Dosage calculator</h2>
        <p className="mt-2 mb-4 text-sm text-muted-foreground">
          Find how many units to dial for your pen strength and amount, plus how long one pen lasts.
        </p>
        <PenDosageCalculator />
      </section>
      <section className="mt-10" id="faq">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-border rounded-lg border border-border">
          {FAQS.map((f) => (
            <details key={f.q} className="group p-4">
              <summary className="cursor-pointer list-none font-medium">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          For research use only. Keep out of reach of children. Still have a question? <Link to="/contact" className="underline">Contact us</Link>.
        </p>
      </section>
      <div className="mt-10">
        <Link to="/products" className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
          Shop Peptide Pen
        </Link>
      </div>
    </main>
  );
}

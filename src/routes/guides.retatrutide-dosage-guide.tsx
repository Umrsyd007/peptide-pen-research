import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE =
  "Retatrutide Pen Dosage Guide | Titration, Units & Protocol | Peptide Pen Research";
const DESCRIPTION =
  "Retatrutide pen dosage guide for research: titration schedule, mg-to-unit conversions for standard pens, mechanism (GLP-1 / GIP / glucagon triple agonist), and safety notes. Research use only.";
const URL = "https://getpeptidepen.com/guides/retatrutide-dosage-guide";

export const Route = createFileRoute("/guides/retatrutide-dosage-guide")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          mainEntityOfPage: URL,
          author: { "@type": "Organization", name: "Peptide Pen Research" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is retatrutide?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Retatrutide (LY-3437943) is an investigational triple agonist of GLP-1, GIP, and glucagon receptors studied for metabolic and weight-loss research. It is administered as a once-weekly subcutaneous injection in clinical trials.",
              },
            },
            {
              "@type": "Question",
              name: "What is the typical retatrutide titration schedule?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Phase 2 research protocols commonly start at 2 mg weekly for 2 weeks, then escalate by 2 mg every 2–4 weeks up to a maintenance dose of 8–12 mg weekly, based on tolerability.",
              },
            },
            {
              "@type": "Question",
              name: "How do I convert milligrams to pen units for retatrutide?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Divide the dose in milligrams by the pen concentration in mg/mL and multiply by 100. On a 10 mg / 1 mL pen (10 mg/mL), 2 mg equals 20 units on the pen dial.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: RetatrutideGuide,
});

const TITRATION = [
  { weeks: "Weeks 1–2", dose: "2 mg", units: "~20 units" },
  { weeks: "Weeks 3–4", dose: "4 mg", units: "~40 units" },
  { weeks: "Weeks 5–8", dose: "4–6 mg", units: "~40–60 units" },
  { weeks: "Weeks 9–12", dose: "6–8 mg", units: "~60–80 units" },
  { weeks: "Weeks 13+", dose: "8–12 mg", units: "~80–120 units" },
];

function RetatrutideGuide() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-black text-sm">
              P
            </span>
            <span className="text-base font-black uppercase tracking-tight">PeptidePen</span>
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-2">
            <Link
              to="/products/$productId"
              params={{ productId: "08f6ee52" }}
              className="inline-flex h-10 px-4 items-center rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors"
            >
              Shop Retatrutide ↗
            </Link>
          </nav>
        </div>
      </header>

      <main role="main" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-foreground">Guides</span>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-foreground">Retatrutide Dosage</span>
        </nav>

        <article className="space-y-10">
          <header className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Research Reference
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-[0.95]">
              Retatrutide{" "}
              <span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">
                Pen Dosage Guide.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              A reference for researchers working with retatrutide (LY-3437943)
              pre-mixed pens — titration schedule, pen-unit math, mechanism
              summary, and safety notes. Pairs with our{" "}
              <Link
                to="/guides/peptide-dosage-calculator"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                semaglutide &amp; tirzepatide guide
              </Link>
              .
            </p>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
              <strong className="text-foreground">For research use only.</strong>{" "}
              The values below are reference figures for in-vitro and laboratory
              workflows. Not medical advice and not for human or veterinary use.
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              What is retatrutide?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Retatrutide is an investigational triple agonist that
              simultaneously activates the GLP-1, GIP, and glucagon receptors.
              That third axis — glucagon — increases energy expenditure on top
              of the appetite and insulinotropic effects familiar from
              semaglutide and tirzepatide. Phase 2 trials have reported the
              largest weight-loss signal among incretin compounds to date.
            </p>
            <ul className="grid sm:grid-cols-3 gap-3 list-none p-0">
              {[
                { t: "GLP-1", s: "Satiety, insulin response" },
                { t: "GIP", s: "Glucose-dependent insulin release" },
                { t: "Glucagon", s: "Energy expenditure, lipolysis" },
              ].map((m) => (
                <li key={m.t} className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-primary">
                    Target
                  </p>
                  <p className="text-lg font-black mt-1">{m.t}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.s}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Pen unit math
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              The standard retatrutide pen on this catalog is reconstituted to
              10 mg/mL. The dial reads in <em>units</em>, where 100 units = 1 mL.
              To convert milligrams to units, divide dose by concentration and
              multiply by 100.
            </p>
            <pre className="rounded-xl border border-border bg-card p-4 text-xs sm:text-sm overflow-x-auto">
{`units = (dose_mg / concentration_mg_per_mL) × 100

# Example: 4 mg retatrutide on a 10 mg/mL pen
units = (4 / 10) × 100 = 40 units`}
            </pre>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Retatrutide titration schedule
            </h2>
            <p className="text-sm text-muted-foreground">
              Reference values based on a 10 mg/mL pen. Most published Phase 2
              protocols escalate by 2 mg every 2–4 weeks based on tolerability,
              up to 8–12 mg weekly.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-[11px] uppercase tracking-widest">
                  <tr>
                    <th className="text-left p-3 font-bold">Phase</th>
                    <th className="text-left p-3 font-bold">Weekly Dose</th>
                    <th className="text-left p-3 font-bold">Pen Units</th>
                  </tr>
                </thead>
                <tbody>
                  {TITRATION.map((r) => (
                    <tr key={r.weeks} className="border-t border-border">
                      <td className="p-3 font-semibold">{r.weeks}</td>
                      <td className="p-3">{r.dose}</td>
                      <td className="p-3 text-muted-foreground">{r.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              Hold or step back one dose level if gastrointestinal side effects
              become limiting. Hold-then-resume is preferred over discontinuing.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Storage &amp; handling
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground leading-relaxed">
              <li>Store pens at 2–8°C; protect from light and freezing.</li>
              <li>Allow the pen to reach room temperature before administration.</li>
              <li>Prime the pen per manufacturer instructions before first use.</li>
              <li>Rotate subcutaneous sites; use a new needle every dose.</li>
              <li>Discard pens past their in-use period after first puncture.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Reported side effects
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In published trials the most common adverse events were dose-dependent
              gastrointestinal: nausea, diarrhea, constipation, and vomiting —
              typically peaking during titration and tapering during maintenance.
              Slower titration (every 4 weeks rather than every 2) reduced
              incidence in Phase 2 data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Frequently asked
            </h2>
            {[
              {
                q: "How is retatrutide different from tirzepatide?",
                a: "Tirzepatide activates GLP-1 and GIP. Retatrutide adds a third axis — the glucagon receptor — which increases energy expenditure in addition to suppressing appetite.",
              },
              {
                q: "How long does a 10 mg retatrutide pen last at a 4 mg weekly dose?",
                a: "A 10 mg / 1 mL pen contains roughly 2.5 weekly doses at 4 mg. Most research protocols allocate one pen per 2–3 weeks at this stage of titration.",
              },
              {
                q: "Can retatrutide be combined with other peptides?",
                a: "In a research context retatrutide is studied as a monotherapy. Stacking with other incretins (semaglutide, tirzepatide) is not supported in the published literature and increases GI side-effect risk.",
              },
            ].map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-card p-5"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-bold text-sm sm:text-base">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground group-open:rotate-45 group-open:bg-primary group-open:text-primary-foreground group-open:border-primary transition-all">+</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </section>

          <section className="rounded-3xl bg-foreground text-background p-8 md:p-12 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Get the retatrutide pen
            </h2>
            <p className="text-sm text-background/70 max-w-md mx-auto">
              Pre-mixed, batch-matched COA, cold-chain shipped. For in-vitro
              research only.
            </p>
            <Link
              to="/products/$productId"
              params={{ productId: "08f6ee52" }}
              className="inline-flex h-12 px-6 items-center rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider hover:bg-background hover:text-foreground transition-colors"
            >
              Shop Retatrutide Pen ↗
            </Link>
          </section>
        </article>
      </main>

      <footer className="bg-foreground text-background" role="contentinfo">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center text-[11px] text-background/60">
          <strong className="text-background">Research Use Only.</strong>{" "}
          Products are supplied strictly for in-vitro laboratory research and
          are not for human or veterinary use.
        </div>
      </footer>
    </div>
  );
}

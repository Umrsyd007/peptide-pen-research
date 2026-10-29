import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE =
  "Semaglutide & Tirzepatide Pen Dosage Guide | Peptide Pen Research";
const DESCRIPTION =
  "Step-by-step dosage protocols for Semaglutide and Tirzepatide using pen injectors — titration schedules, unit conversions, click charts, and safety guidance for research use.";
const URL = "https://getpeptidepen.com/guides/peptide-dosage-calculator";

export const Route = createFileRoute("/guides/peptide-dosage-calculator")({
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
              name: "How many units are in 0.25 mg of semaglutide on a standard pen?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "On a typical 2 mg / 1.5 mL pen reconstituted at 1.33 mg/mL, 0.25 mg equals about 19 units on the pen dial.",
              },
            },
            {
              "@type": "Question",
              name: "What is a standard titration schedule for tirzepatide?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Research literature commonly references 2.5 mg weekly for weeks 1–4, increasing by 2.5 mg every 4 weeks up to a maximum of 15 mg weekly, based on tolerability.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: GuidePage,
});

const SEMA_TITRATION = [
  { weeks: "Weeks 1–4", dose: "0.25 mg", units: "~19 units" },
  { weeks: "Weeks 5–8", dose: "0.50 mg", units: "~38 units" },
  { weeks: "Weeks 9–12", dose: "1.00 mg", units: "~75 units" },
  { weeks: "Weeks 13–16", dose: "1.70 mg", units: "~128 units" },
  { weeks: "Weeks 17+", dose: "2.40 mg", units: "~180 units" },
];

const TIRZ_TITRATION = [
  { weeks: "Weeks 1–4", dose: "2.5 mg", units: "~25 units" },
  { weeks: "Weeks 5–8", dose: "5.0 mg", units: "~50 units" },
  { weeks: "Weeks 9–12", dose: "7.5 mg", units: "~75 units" },
  { weeks: "Weeks 13–16", dose: "10.0 mg", units: "~100 units" },
  { weeks: "Weeks 17+", dose: "12.5–15.0 mg", units: "~125–150 units" },
];

function GuidePage() {
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
              to="/products"
              className="inline-flex h-10 px-4 items-center rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors"
            >
              Shop Pens ↗
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
          <span className="text-foreground">Peptide Dosage Calculator</span>
        </nav>

        <article className="space-y-10">
          <header className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Research Reference
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-[0.95]">
              Semaglutide &amp; Tirzepatide{" "}
              <span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">
                Pen Dosage Guide.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              A reference for researchers using pre-mixed peptide pens. Below
              are the standard titration schedules referenced in clinical
              literature for semaglutide and tirzepatide, with approximate
              click/unit conversions for typical pen concentrations.
            </p>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
              <strong className="text-foreground">For research use only.</strong>{" "}
              The values below are reference figures for in-vitro and laboratory
              workflows. Not medical advice and not for human or veterinary use.
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              How pen units map to milligrams
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Standard pens displayed on this site are pre-mixed. The dial
              shows <em>units</em>, where 100 units = 1 mL of reconstituted
              solution. To convert a dose in milligrams to units, divide the
              dose by the pen's concentration (mg/mL) and multiply by 100.
            </p>
            <pre className="rounded-xl border border-border bg-card p-4 text-xs sm:text-sm overflow-x-auto">
{`units = (dose_mg / concentration_mg_per_mL) × 100

# Example: 0.25 mg semaglutide on a 1.33 mg/mL pen
units = (0.25 / 1.33) × 100 ≈ 19 units`}
            </pre>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Semaglutide titration schedule
            </h2>
            <p className="text-sm text-muted-foreground">
              Reference values based on a 2 mg / 1.5 mL pen reconstituted at
              ~1.33 mg/mL. Adjust if your pen concentration differs.
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
                  {SEMA_TITRATION.map((r) => (
                    <tr key={r.weeks} className="border-t border-border">
                      <td className="p-3 font-semibold">{r.weeks}</td>
                      <td className="p-3">{r.dose}</td>
                      <td className="p-3 text-muted-foreground">{r.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Tirzepatide titration schedule
            </h2>
            <p className="text-sm text-muted-foreground">
              Reference values based on a 10 mg / 1 mL pen at 10 mg/mL. Most
              published protocols increase by 2.5 mg every 4 weeks based on
              tolerability, up to 15 mg weekly.
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
                  {TIRZ_TITRATION.map((r) => (
                    <tr key={r.weeks} className="border-t border-border">
                      <td className="p-3 font-semibold">{r.weeks}</td>
                      <td className="p-3">{r.dose}</td>
                      <td className="p-3 text-muted-foreground">{r.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Safety notes for pen handling
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground leading-relaxed">
              <li>Store pens at 2–8°C; protect from light and freezing.</li>
              <li>Prime the pen per the manufacturer insert before the first dose.</li>
              <li>Rotate sites and use a new needle for every administration.</li>
              <li>Discard pens past their listed in-use period after first use.</li>
              <li>Never share pens between research animals or subjects.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Frequently asked
            </h2>
            {[
              {
                q: "How do I convert milligrams to pen units?",
                a: "Divide the target dose (mg) by the pen's concentration (mg/mL) and multiply by 100. The unit scale on the pen dial corresponds to 1/100 mL.",
              },
              {
                q: "How long does a standard semaglutide pen last?",
                a: "A 2 mg pen at the 0.25 mg starting dose contains eight weekly doses. At 2.4 mg/week, one pen lasts under one week.",
              },
              {
                q: "What if I miss a weekly dose?",
                a: "Most published protocols administer the missed dose within 5 days; if more than 5 days have passed, skip and resume the regular schedule.",
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
              Ready to source your pens?
            </h2>
            <p className="text-sm text-background/70 max-w-md mx-auto">
              Browse pre-mixed semaglutide, tirzepatide, and retatrutide pens —
              every batch ships with a third-party COA.
            </p>
            <Link
              to="/products"
              className="inline-flex h-12 px-6 items-center rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider hover:bg-background hover:text-foreground transition-colors"
            >
              Shop Peptide Pens ↗
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

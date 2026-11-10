import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

const BRAND = "PeptidePen";
const PAGE_TITLE = `Contact Us | ${BRAND}`;
const PAGE_DESCRIPTION =
  "Get in touch with PeptidePen about orders, delivery, returns, the needle-free injector and the PeptiCool travel cooler.";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: "https://getpeptidepen.com/contact" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://getpeptidepen.com/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `Contact ${BRAND}`,
          description: PAGE_DESCRIPTION,
          url: "https://getpeptidepen.com/contact",
          mainEntity: {
            "@type": "Organization",
            name: BRAND,
            email: "hello@getpeptidepen.com",
            url: "https://getpeptidepen.com/",
          },
        }),
      },
    ],
  }),
});

const CARDS = [
  { icon: Mail, title: "Email", note: "General questions", body: <a href="mailto:hello@getpeptidepen.com" className="font-medium underline underline-offset-2 hover:text-primary">hello@getpeptidepen.com</a> },
  { icon: Send, title: "Support", note: "Orders, delivery and returns", body: <a href="mailto:support@getpeptidepen.com" className="font-medium underline underline-offset-2 hover:text-primary">support@getpeptidepen.com</a> },
  { icon: Clock, title: "Hours", note: "When we reply", body: <>Monday to Friday, 9:00 AM – 6:00 PM CET.<br /><span className="text-muted-foreground">We aim to reply within 24 hours.</span></> },
  { icon: MapPin, title: "Business address", note: "Registered office", body: <span className="text-muted-foreground">Available on request by email.</span> },
];

const HELP = [
  "Order status and tracking",
  "Delivery and returns",
  "Using your needle-free injector",
  "Replacement nozzles",
  "Using and charging your PeptiCool cooler",
];

function ContactPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact us</h1>
          <p className="max-w-[60ch] text-[17px] leading-relaxed text-muted-foreground">
            Questions about an order, your injector or your PeptiCool cooler? Get in touch and we'll help.
          </p>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CARDS.map(({ icon: Icon, title, note, body }) => (
            <div key={title} className="rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-muted"><Icon className="h-5 w-5" aria-hidden /></span>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="text-xs text-muted-foreground">{note}</p>
                </div>
              </div>
              <div className="mt-4 text-[15px] leading-relaxed">{body}</div>
            </div>
          ))}
        </div>

        <section className="mt-12 space-y-3">
          <h2 className="text-xl font-bold tracking-tight">What we can help with</h2>
          <ul className="list-disc space-y-2 pl-5 text-[15px] text-foreground/80">
            {HELP.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </section>
      </div>
    </SiteShell>
  );
}

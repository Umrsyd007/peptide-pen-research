import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: [
    { title: "Privacy policy | PeptidePen" },
    { name: "description", content: "How PeptidePen handles orders, Google measurement, and visitor privacy choices." },
    { property: "og:title", content: "Privacy policy | PeptidePen" },
    { property: "og:description", content: "How PeptidePen handles orders, Google measurement, and visitor privacy choices." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <main className="mx-auto max-w-3xl px-5 py-16 space-y-6 text-foreground">
    <Link to="/" className="underline">PeptidePen</Link>
    <h1 className="text-3xl font-bold">Privacy policy</h1>
    <p className="text-sm text-muted-foreground">Updated November 2, 2026</p>
    <h2 className="text-xl font-semibold">Orders and payments</h2>
    <p>We store your order, contact and shipping details to process your purchase and respond to requests. Stripe processes payments and collects payment information directly. Our payment request uses an opaque order reference, amount and currency instead of itemized product names or your shipping details.</p>
    <h2 className="text-xl font-semibold">Google measurement</h2>
    <p>When allowed by your privacy choices and regional requirements, Google Analytics receives page visits and shopping events, including product details, amounts and currency. Google Ads receives page visits, advertising click and cookie identifiers, and confirmed purchase references, amounts and currency for advertising measurement and campaign optimization. Requests also expose normal connection information such as IP address, browser information and page address to Google. We do not enable customer matching or share your name, email or shipping address in these advertising events.</p>
    <h2 className="text-xl font-semibold">Your choices and withdrawal</h2>
    <p>Before you decide, Google tags may send limited cookieless visit, shopping and confirmed-purchase signals for measurement, advertising optimization and modeled reporting. In consent-required or unknown regions, analytics storage, advertising storage and advertising user data remain denied until acceptance; no customer matching or advertising personalization is enabled. Cookieless does not mean no data is transmitted: Google receives consent status, event information and normal connection information. These signals do not provide a complete record of every visitor or purchase.</p>
    <p>Elsewhere optional storage is enabled unless you refuse or an applicable browser privacy signal is present. An explicit refusal stops further events for that purpose, including cookieless events. Analytics and advertising are separate choices. Open Cookie settings at the bottom of any page to change or withdraw permission. Changes apply immediately and across open tabs; previously blocked events are not replayed. Essential cart and privacy-choice storage remain available.</p>
    <h2 className="text-xl font-semibold">Consent records</h2>
    <p>Your browser stores a random visitor reference, choice timestamps, region, notice version and choices, including earlier acceptance when you later withdraw. Purchase reporting checks both the choice at confirmation and the latest choice. Clearing browser storage removes these local records and resets your preferences.</p>
    <p>Google handles received data under its <a href="https://policies.google.com/privacy" className="underline">privacy policy</a>. Contact <Link to="/contact" className="underline">our team</Link> with privacy requests.</p>
  </main>,
});
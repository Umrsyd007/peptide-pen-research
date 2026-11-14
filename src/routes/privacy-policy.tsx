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
    <p className="text-sm text-muted-foreground">Updated October 29, 2026</p>
    <h2 className="text-xl font-semibold">Orders and payments</h2>
    <p>We store your order, contact and shipping details to process your purchase and respond to requests. Stripe processes payments and collects payment information directly. Our payment request uses an opaque order reference, amount and currency instead of itemized product names or your shipping details.</p>
    <h2 className="text-xl font-semibold">Cart activity</h2>
    <p>When you add, change or remove items in your cart, we record the products, sizes, quantities and prices together with your IP address, approximate country, browser information and a random cart reference. We use this for fraud prevention and order support, link it to your order if you check out, and delete it after 90 days.</p>
    <h2 className="text-xl font-semibold">Google measurement</h2>
    <p>When allowed by your privacy choices and regional requirements, Google Analytics receives page visits and shopping events, including product details, amounts and currency. Google Ads receives page visits, advertising click and cookie identifiers, and confirmed purchase references, amounts and currency for advertising measurement and campaign optimization. Requests also expose normal connection information such as IP address, browser information and page address to Google. We do not enable customer matching or share your name, email or shipping address in these advertising events.</p>
    <h2 className="text-xl font-semibold">Your choices and withdrawal</h2>
    <p>Optional tracking is blocked until you decide in consent-required or unknown regions. Elsewhere it is enabled unless you refuse or an applicable browser privacy signal is present. Analytics and advertising are separate choices. Open Cookie settings at the bottom of any page to change or withdraw permission. Changes apply immediately and across open tabs; previously blocked events are not replayed. Essential cart and privacy-choice storage remain available.</p>
    <h2 className="text-xl font-semibold">Consent records</h2>
    <p>Your browser stores a random visitor reference, choice timestamps, region, notice version and choices, including earlier acceptance when you later withdraw. Purchase reporting checks both the choice at confirmation and the latest choice. Clearing browser storage removes these local records and resets your preferences.</p>
    <p>Google handles received data under its <a href="https://policies.google.com/privacy" className="underline">privacy policy</a>. Contact <Link to="/contact" className="underline">our team</Link> with privacy requests.</p>
  </main>,
});
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { LegalPage, LegalSection } from "@/components/legal-page";

const BRAND = "PeptidePen";
const PAGE_TITLE = `Terms of Service | ${BRAND}`;
const DESCRIPTION = "The terms that apply when you use the PeptidePen website or buy from us.";

export const Route = createFileRoute("/terms-of-service")({
  component: TermsOfServicePage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://getpeptidepen.com/terms-of-service" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://getpeptidepen.com/terms-of-service" }],
  }),
});

const EMAIL = "hello@getpeptidepen.com";

function TermsOfServicePage() {
  return (
    <SiteShell>
      <LegalPage title="Terms of service" updated="3 November 2026">
        <LegalSection title="1. Acceptance of terms">
          <p>By using this website or buying from {BRAND} ("we", "us" or "our"), you agree to these Terms of Service. If you don't agree, please don't use the website or buy our products.</p>
        </LegalSection>

        <LegalSection title="2. Our products and how to use them">
          <p>We sell consumer devices and accessories: a reusable needle-free injector and the PeptiCool™ travel cooler. They are not medicines, and no medicine is supplied with them.</p>
          <p>Use each product only as described in its included instructions. For anything you use with the injector, follow the advice of your prescriber or pharmacist.</p>
        </LegalSection>

        <LegalSection title="3. Eligibility">
          <p>You must be at least 18 years old and legally able to enter into contracts to buy from our store. By placing an order, you confirm that you meet these requirements.</p>
        </LegalSection>

        <LegalSection title="4. Orders and payment">
          <p>All orders are subject to acceptance and availability. We may refuse or cancel any order, including for suspected fraud, unauthorised reselling, or breach of these terms.</p>
          <p>Prices are charged in US dollars. Prices shown in other currencies are estimates; at the payment step you may be offered the option to pay in your local currency, at the rate shown there.</p>
        </LegalSection>

        <LegalSection title="5. Shipping and delivery">
          <p>We ship orders by tracked delivery. Delivery times are estimates and aren't guaranteed. Risk of loss and title pass to you when the items are delivered to the carrier.</p>
        </LegalSection>

        <LegalSection title="6. Returns and refunds">
          <p>See our <Link to="/refund-policy" className="font-medium underline underline-offset-2 hover:text-primary">Refund Policy</Link> for how returns, exchanges and refunds work.</p>
        </LegalSection>

        <LegalSection title="7. Intellectual property">
          <p>All content on this website, including text, graphics, logos and images, belongs to {BRAND} and is protected by copyright and trademark laws. You may not use, reproduce or distribute it without our written permission.</p>
        </LegalSection>

        <LegalSection title="8. Limitation of liability">
          <p>To the fullest extent permitted by law, {BRAND} is not liable for any indirect, incidental, special, consequential or punitive damages arising from your use of our products or website.</p>
        </LegalSection>

        <LegalSection title="9. Governing law">
          <p>These terms are governed by the laws of the jurisdiction in which {BRAND} operates, without regard to conflict-of-law principles.</p>
        </LegalSection>

        <LegalSection title="10. Changes to these terms">
          <p>We may update these Terms of Service at any time. Changes take effect when posted on this page, and continuing to use the website after that means you accept the revised terms.</p>
        </LegalSection>

        <LegalSection title="11. Contact">
          <p>For questions about these terms, email <a href={`mailto:${EMAIL}`} className="font-medium underline underline-offset-2 hover:text-primary">{EMAIL}</a>.</p>
        </LegalSection>
      </LegalPage>
    </SiteShell>
  );
}

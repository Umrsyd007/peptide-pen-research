import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { LegalPage, LegalSection } from "@/components/legal-page";

const PAGE_TITLE = "Refund Policy | PeptidePen";
const DESCRIPTION = "How returns and refunds work for PeptidePen orders.";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPolicyPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://getpeptidepen.com/refund-policy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://getpeptidepen.com/refund-policy" }],
  }),
});

const EMAIL = "hello@getpeptidepen.com";
const Mail = () => <a href={`mailto:${EMAIL}`} className="font-medium underline underline-offset-2 hover:text-primary">{EMAIL}</a>;

function RefundPolicyPage() {
  return (
    <SiteShell>
      <LegalPage title="Refund policy" updated="3 November 2026">
        <LegalSection title="Overview">
          <p>If you're not happy with your order, you can return it for a refund under the terms below.</p>
        </LegalSection>

        <LegalSection title="What can be returned">
          <ul>
            <li>Items must be returned within 30 days of delivery.</li>
            <li>Products must be unopened, unused, and in their original packaging with seals intact.</li>
            <li>Opened, used or tampered items aren't eligible for a refund.</li>
            <li>Custom or bulk orders may not be eligible for standard refunds. Contact us before ordering.</li>
          </ul>
        </LegalSection>

        <LegalSection title="How to request a refund">
          <p>Email <Mail /> with your order number and the reason for the return. We'll reply within 2 business days with return instructions.</p>
        </LegalSection>

        <LegalSection title="Shipping costs">
          <p>Original shipping charges are non-refundable. Return shipping is paid by the customer unless the return is due to our error, such as a wrong item, damage in transit, or a defective product.</p>
        </LegalSection>

        <LegalSection title="Processing time">
          <p>Once we receive and inspect your return, we process your refund within 5–7 business days. Refunds go back to the original payment method.</p>
        </LegalSection>

        <LegalSection title="Damaged or incorrect orders">
          <p>If your order arrives damaged or you receive the wrong product, contact us within 48 hours of delivery with photos of the item and packaging. We'll arrange a replacement or full refund at no cost to you.</p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>For any refund or return questions, email <Mail />.</p>
        </LegalSection>
      </LegalPage>
    </SiteShell>
  );
}

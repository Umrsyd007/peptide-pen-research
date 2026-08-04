import { useEffect, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyCheckoutSession } from "@/lib/checkout.functions";
import { trackPurchase } from "@/lib/analytics";

export const Route = createFileRoute("/checkout/success/$orderNumber")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id:
      typeof search["session_id"] === "string"
        ? (search["session_id"] as string)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order confirmed | PeptidePen" },
      {
        name: "description",
        content: "Your PeptidePen order is confirmed and being prepared.",
      },
      { property: "og:title", content: "Order confirmed | PeptidePen" },
      {
        property: "og:description",
        content: "Your PeptidePen order is confirmed and being prepared.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { orderNumber } = Route.useParams();
  const { session_id: sessionId } = useSearch({ from: Route.id });
  const verify = useServerFn(verifyCheckoutSession);
  const [state, setState] = useState<"checking" | "paid" | "pending">(
    sessionId ? "checking" : "pending",
  );

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    verify({ data: { sessionId } })
      .then((res) => {
        if (!active) return;
        setState(res.paid ? "paid" : "pending");
        if (res.paid) {
          trackPurchase({
            transaction_id: orderNumber,
            items: [],
            value: 0,
          });
        }
      })
      .catch(() => active && setState("pending"));
    return () => {
      active = false;
    };
  }, [sessionId, orderNumber, verify]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      {state === "checking" ? (
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-muted-foreground" />
      ) : (
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
      )}
      <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">
        {state === "checking"
          ? "Confirming your payment…"
          : state === "paid"
            ? "Thank you — your order is confirmed."
            : "We've received your order."}
      </h1>
      <p className="mt-3 text-muted-foreground">
        Order reference{" "}
        <span className="font-mono font-semibold text-foreground">
          #{orderNumber}
        </span>
        . A confirmation email is on its way.
      </p>
      <Button asChild className="mt-8">
        <Link to="/products">Continue shopping</Link>
      </Button>
    </main>
  );
}

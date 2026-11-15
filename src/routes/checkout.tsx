import { useMoney } from "@/lib/currency";
import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/stores/cart";
import { formatMoney } from "@/lib/money";
import { createOrder, type CreateOrderInput } from "@/lib/orders.functions";
import {
  createCheckoutSession,
  getStripePublishableKey,
} from "@/lib/checkout.functions";
import { trackBeginCheckout } from "@/lib/analytics";
import { consentContext, resolveRegion } from "@/lib/tracking-consent";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout | PeptidePen" },
      {
        name: "description",
        content:
          "Complete your PeptidePen order with encrypted card payment and discreet shipping.",
      },
      { property: "og:title", content: "Secure Checkout | PeptidePen" },
      {
        property: "og:description",
        content:
          "Complete your PeptidePen order with encrypted card payment and discreet shipping.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const EMPTY_FORM = {
  email: "",
  ship_name: "",
  ship_address1: "",
  ship_address2: "",
  ship_city: "",
  ship_region: "",
  ship_postal: "",
  ship_country: "United States",
};

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const submitOrder = useServerFn(createOrder);
  const startCheckout = useServerFn(createCheckoutSession);
  const fetchPublishableKey = useServerFn(getStripePublishableKey);

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<ReturnType<
    typeof loadStripe
  > | null>(null);
  const [summary, setSummary] = useState<{
    subtotal: number;
    total: number;
    currency: string;
  } | null>(null);

  const { currency, convert } = useMoney();
  const subtotal = useMemo(
    () =>
      Math.round(items.reduce((s, i) => s + convert(parseFloat(i.price.amount)) * i.quantity, 0) * 100) / 100,
    [items, convert],
  );

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const input: CreateOrderInput = {
        email: form.email,
        ship_name: form.ship_name,
        ship_address1: form.ship_address1,
        ship_address2: form.ship_address2,
        ship_city: form.ship_city,
        ship_region: form.ship_region,
        ship_postal: form.ship_postal,
        ship_country: form.ship_country,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.title,
          variant: i.variantTitle ?? "",
          price: parseFloat(i.price.amount),
          qty: i.quantity,
        })),
        currency,
      };

      const order = await submitOrder({ data: input });
      const { clientSecret: secret } = await startCheckout({
        data: { orderId: order.id, token: order.token },
      });
      const { key } = await fetchPublishableKey();
      await resolveRegion();
      localStorage.setItem(`checkout-consent:${order.orderNumber}`, JSON.stringify(consentContext()));

      trackBeginCheckout({
        items: items.map((i) => ({
          item_id: i.productId,
          item_name: i.title,
          item_variant: i.variantTitle,
          price: convert(parseFloat(i.price.amount)),
          quantity: i.quantity,
          currency,
        })),
        value: subtotal,
        currency,
      });

      setSummary({ subtotal: order.total, total: order.total, currency: order.currency });
      setStripePromise(loadStripe(key));
      setClientSecret(secret);
      clearCart();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't start checkout. Please try again.",
      );
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !clientSecret) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Add a product before heading to checkout.
        </p>
        <Button asChild className="mt-8">
          <Link to="/products">Browse products</Link>
        </Button>
      </main>
    );
  }

  const displaySubtotal = summary?.subtotal ?? subtotal;
  const displayTotal = summary?.total ?? subtotal;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <button
        type="button"
        onClick={() => navigate({ to: "/products" })}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Continue shopping
      </button>

      <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
        Secure checkout
      </h1>
      <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        Card payments are processed by Stripe. We never see your card details.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <section>
          {clientSecret && stripePromise ? (
            <div className="rounded-lg border border-border p-4">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-lg border border-border p-5 space-y-4"
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Shipping details
              </h2>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ship_name">Full name</Label>
                <Input
                  id="ship_name"
                  required
                  autoComplete="name"
                  value={form.ship_name}
                  onChange={(e) => update("ship_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ship_address1">Address</Label>
                <Input
                  id="ship_address1"
                  required
                  autoComplete="address-line1"
                  value={form.ship_address1}
                  onChange={(e) => update("ship_address1", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ship_address2">
                  Apt, suite, etc. (optional)
                </Label>
                <Input
                  id="ship_address2"
                  autoComplete="address-line2"
                  value={form.ship_address2}
                  onChange={(e) => update("ship_address2", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ship_city">City</Label>
                  <Input
                    id="ship_city"
                    required
                    autoComplete="address-level2"
                    value={form.ship_city}
                    onChange={(e) => update("ship_city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ship_region">State / Region</Label>
                  <Input
                    id="ship_region"
                    required
                    autoComplete="address-level1"
                    value={form.ship_region}
                    onChange={(e) => update("ship_region", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ship_postal">Postal code</Label>
                  <Input
                    id="ship_postal"
                    required
                    autoComplete="postal-code"
                    value={form.ship_postal}
                    onChange={(e) => update("ship_postal", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ship_country">Country</Label>
                  <Input
                    id="ship_country"
                    required
                    autoComplete="country-name"
                    value={form.ship_country}
                    onChange={(e) => update("ship_country", e.target.value)}
                  />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                className="w-full h-12"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Continue to payment"
                )}
              </Button>
            </form>
          )}
        </section>

        <aside className="lg:sticky lg:top-24 self-start rounded-lg border border-border p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Order summary
          </h2>
          {!clientSecret && (
            <ul className="space-y-3 pb-2">
              {items.map((i) => (
                <li key={i.variantId} className="flex gap-3 text-sm">
                  <div className="h-12 w-12 rounded bg-muted/40 overflow-hidden flex-shrink-0">
                    {i.image && (
                      <img
                        src={i.image}
                        alt={i.title}
                        className="h-full w-full object-contain mix-blend-multiply"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{i.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.variantTitle} × {i.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-sm">
                    {formatMoney(
                      convert(parseFloat(i.price.amount)) * i.quantity,
                      currency,
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Row
            k="Subtotal"
            v={formatMoney(displaySubtotal, summary?.currency ?? currency)}
          />
          <Row k="Shipping" v="Free worldwide" />
          <div className="h-px bg-border" />
          <Row
            k="Total"
            v={formatMoney(displayTotal, summary?.currency ?? currency)}
            big
          />
        </aside>
      </div>
    </main>
  );
}

function Row({ k, v, big }: { k: string; v: string; big?: boolean }) {
  return (
    <div
      className={`flex justify-between ${big ? "text-lg font-bold" : "text-sm"}`}
    >
      <span className={big ? "" : "text-muted-foreground"}>{k}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}

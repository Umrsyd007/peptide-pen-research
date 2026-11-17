import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  CheckCircle2, ClipboardList, Clock, Copy, Home, Loader2, Mail, MapPin, MessageCircle,
  Package, Phone, ShieldCheck, ShoppingBag, Truck, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlacedOrder } from "@/lib/orders.functions";
import { PAYMENT_LABELS, type PaymentMethod } from "@/lib/checkout-rules";
import { formatIn } from "@/lib/currency";
import { SUPPORT_EMAIL, SUPPORT_PHONE, WHATSAPP_NUMBER } from "@/lib/store-contact";

export const Route = createFileRoute("/checkout/success/$orderNumber")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s["id"] === "string" ? (s["id"] as string) : undefined,
    t: typeof s["t"] === "string" ? (s["t"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order submitted | PeptidePen" },
      { name: "description", content: "Your PeptidePen order has been placed. Next steps for payment are inside." },
      { property: "og:title", content: "Order submitted | PeptidePen" },
      { property: "og:description", content: "Your PeptidePen order has been placed. Next steps for payment are inside." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

const NEXT: Record<PaymentMethod, { title: string; steps: string[] }> = {
  whatsapp: { title: "Pay via WhatsApp", steps: ["Open the WhatsApp chat — your order details are pre-filled", "Send the message so we can arrange payment", "Your order is processed as soon as payment is confirmed"] },
  card: { title: "Secure Card Payment", steps: ["Check your email or WhatsApp for the secure payment link", "Click the link to open the secure payment page", "Complete payment using your card, Apple Pay, or Google Pay", "Your order is processed immediately once payment is confirmed"] },
  bank: { title: "Bank Transfer", steps: ["We'll send our bank details to your email or WhatsApp", "Transfer the total using your order ID as the reference", "Your order is processed once the transfer arrives"] },
  usdt: { title: "USDT (Crypto)", steps: ["We'll send the wallet address and exact amount", "Send the USDT payment", "Your order is processed once the payment confirms"] },
};

function SuccessPage() {
  const { orderNumber } = Route.useParams();
  const { id, t } = Route.useSearch();
  const fetchOrder = useServerFn(getPlacedOrder);
  const { data: o, isLoading } = useQuery({
    queryKey: ["placed-order", id],
    queryFn: () => fetchOrder({ data: { id: id!, token: t! } }),
    enabled: !!id && !!t,
    retry: false,
  });

  const method = (o?.payment_method ?? "card") as PaymentMethod;
  const waText = o
    ? `Hi! I just placed order #${o.order_number} (${formatIn(o.total, o.currency)}). ` +
      o.order_items.map((i) => `${i.qty}x ${i.name}${i.variant ? ` ${i.variant}` : ""}`).join(", ") +
      `. Name: ${o.ship_name}. I'd like to arrange payment.`
    : "";
  const waUrl = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}` : null;
  const opened = useRef(false);
  useEffect(() => {
    if (o && method === "whatsapp" && waUrl && !opened.current) {
      opened.current = true;
      window.open(waUrl, "_blank", "noopener");
    }
  }, [o, method, waUrl]);

  const copy = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success("Order ID copied");
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-primary">Order Submitted Successfully!</h1>
        <p className="mt-2 text-muted-foreground">Thank you for choosing PeptidePen</p>
      </div>

      <section className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your order ID</p>
          <p className="mt-1 font-mono text-3xl font-bold">#{orderNumber}</p>
          <p className="mt-2 text-xs text-muted-foreground">Save this ID for your records. You'll need it for payment reference and support inquiries.</p>
        </div>
        <Button variant="outline" onClick={copy}><Copy className="mr-2 h-4 w-4" /> Copy Order ID</Button>
      </section>

      {isLoading && <Loader2 className="mx-auto mt-10 h-8 w-8 animate-spin text-muted-foreground" />}

      {o && (
        <section className="mt-6 overflow-hidden rounded-xl border border-border">
          <h2 className="flex items-center gap-2 border-b border-border bg-muted/30 px-5 py-4 text-lg font-semibold"><Package className="h-5 w-5" /> Order Summary</h2>
          <div className="grid gap-6 p-5 sm:grid-cols-2">
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"><User className="h-4 w-4" /> Customer details</p>
              <p className="font-medium">{o.ship_name}</p>
              <p>{o.email}</p>
              {o.phone && <p>{o.phone}</p>}
              <p className="text-muted-foreground">Payment: {PAYMENT_LABELS[method] ?? o.payment_method}</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"><MapPin className="h-4 w-4" /> Delivery address</p>
              <p>{o.ship_address1}</p>
              {o.ship_address2 && <p>{o.ship_address2}</p>}
              <p>{[o.ship_city, o.ship_postal].filter(Boolean).join(", ")}</p>
              <p>{o.ship_country}</p>
            </div>
          </div>
          <div className="border-t border-border">
            <p className="flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"><ShoppingBag className="h-4 w-4" /> Items ordered ({o.order_items.length})</p>
            {o.order_items.map((i, idx) => (
              <div key={idx} className="flex items-center gap-3 border-t border-border px-5 py-3 text-sm">
                <span className="rounded-md bg-muted px-2 py-1 font-semibold">{i.qty}x</span>
                <div className="flex-1">
                  <p className="font-medium">{i.name}{i.variant ? ` · ${i.variant}` : ""}</p>
                  <p className="text-xs text-muted-foreground">{formatIn(i.price, o.currency)} each</p>
                </div>
                <span className="font-semibold">{formatIn(i.price * i.qty, o.currency)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 border-t border-border px-5 py-4 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatIn(o.subtotal, o.currency)}</span></div>
            {o.discount > 0 && <div className="flex justify-between text-muted-foreground"><span>Discount ({o.discount_code})</span><span>−{formatIn(o.discount, o.currency)}</span></div>}
            <div className="flex justify-between text-muted-foreground"><span>Express Shipping</span><span>FREE</span></div>
          </div>
          <div className="flex items-center justify-between bg-muted/40 px-5 py-4">
            <div><p className="font-medium">Order Total</p><p className="text-xs text-muted-foreground">Includes free worldwide shipping</p></div>
            <p className="text-2xl font-bold">{formatIn(o.total, o.currency)}</p>
          </div>
        </section>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Secure Order</span>
        <span className="flex items-center gap-2"><Truck className="h-4 w-4" /> Free Shipping</span>
        <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Fast Processing</span>
      </div>

      {o && method === "whatsapp" && waUrl && (
        <section className="mt-6 flex flex-col gap-4 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-primary">Opening WhatsApp…</p>
            <p className="text-sm text-muted-foreground">Your order details are pre-filled. If it doesn't open, use the button.</p>
          </div>
          <Button asChild><a href={waUrl} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> Open WhatsApp chat</a></Button>
        </section>
      )}

      {o && (
        <section className="mt-6 rounded-xl border border-border p-5">
          <h2 className="text-lg font-semibold">Complete Your Payment — {NEXT[method].title}</h2>
          <div className="mt-4 rounded-lg bg-muted/40 p-4">
            <p className="flex items-center gap-2 font-medium"><ClipboardList className="h-4 w-4" /> What happens next:</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              {NEXT[method].steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </div>
          <p className="mt-4 rounded-lg border border-border bg-accent/40 p-3 text-sm">
            If you don't hear from us within 10 minutes, please check your spam folder or contact us.
          </p>
        </section>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {SUPPORT_PHONE && (
          <Button variant="outline" asChild><a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}><Phone className="mr-2 h-4 w-4" /> Call Support</a></Button>
        )}
        <Button asChild><a href={`mailto:${SUPPORT_EMAIL}?subject=Order%20%23${orderNumber}`}><Mail className="mr-2 h-4 w-4" /> Email Support</a></Button>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <Button variant="outline" asChild><Link to="/"><Home className="mr-2 h-4 w-4" /> Back to Home</Link></Button>
        <Button variant="outline" asChild><Link to="/products"><ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping</Link></Button>
      </div>
    </main>
  );
}

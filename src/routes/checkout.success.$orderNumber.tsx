import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  CheckCircle2, Clock, Copy, Home, Loader2, Mail, MapPin, MessageCircle,
  Package, Phone, ShieldCheck, ShoppingBag, Truck, User,
} from "lucide-react";
import { CardBrands } from "@/components/checkout/card-brands";
import { Button } from "@/components/ui/button";
import { getPlacedOrder } from "@/lib/orders.functions";
import { PAYMENT_LABELS, type PaymentMethod } from "@/lib/checkout-rules";
import { formatIn } from "@/lib/currency";
import { buildOrderMessage } from "@/lib/order-message";
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
  const msg = o ? buildOrderMessage(o, method, formatIn) : "";
  const waUrl = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}` : null;
  const smsUrl = WHATSAPP_NUMBER ? `sms:+${WHATSAPP_NUMBER}?&body=${encodeURIComponent(msg)}` : null;
  const [isMobile, setIsMobile] = useState(false);
  const [noWhatsApp, setNoWhatsApp] = useState(false);
  const opened = useRef(false);
  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent)));
  }, []);
  useEffect(() => {
    if (!o || !waUrl || opened.current) return;
    opened.current = true;
    // Websites can't tell whether WhatsApp is installed; if the page never loses focus, offer SMS.
    let left = false;
    const onLeave = () => { if (document.visibilityState === "hidden" || !document.hasFocus()) left = true; };
    document.addEventListener("visibilitychange", onLeave);
    window.addEventListener("blur", onLeave);
    window.open(waUrl, "_blank", "noopener");
    const timer = window.setTimeout(() => { if (!left) setNoWhatsApp(true); }, 2500);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [o, waUrl]);

  const copy = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success("Order ID copied");
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-success">Order Submitted Successfully!</h1>
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
        <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success" /> Secure Order</span>
        <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-info" /> Free Shipping</span>
        <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-warning" /> Fast Processing</span>
      </div>

      {o && waUrl && (
        <section className="mt-6 flex flex-col gap-4 rounded-xl border border-success/30 bg-success-soft p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/15"><Loader2 className="h-6 w-6 animate-spin text-success" /></span>
            <div>
              <p className="text-lg font-semibold text-success">Opening WhatsApp…</p>
              <p className="text-sm text-muted-foreground">Opening WhatsApp with your order details pre-filled. If it doesn't open, use the button.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="bg-success text-brand-on hover:bg-success/90"><a href={waUrl} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> Open WhatsApp chat</a></Button>
            {isMobile && smsUrl && (
              <Button variant="outline" asChild className="border-success text-success hover:bg-success-soft hover:text-success"><a href={smsUrl}><Phone className="mr-2 h-4 w-4" /> {noWhatsApp ? "No WhatsApp? Send by text message" : "Send by text message"}</a></Button>
            )}
          </div>
        </section>
      )}

      {o && (
        <>
          <h2 className="mt-8 text-center text-2xl font-bold">💳 Complete Your Payment</h2>
          <section className="mt-4 space-y-4 rounded-xl border border-payment/20 bg-payment-soft p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-payment/10 text-xl">💳</span>
              <div>
                <p className="text-lg font-semibold text-payment">{NEXT[method].title}</p>
                <p className="text-sm text-muted-foreground">{method === "whatsapp" ? "Payment arranged on WhatsApp" : "Payment details will be sent separately"}</p>
              </div>
            </div>
            {method === "card" && <CardBrands className="rounded-lg bg-background p-4" />}
            {method !== "whatsapp" && (
              <div className="flex gap-3 rounded-lg border border-payment/20 bg-payment/5 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-payment/10"><Mail className="h-4 w-4 text-payment" /></span>
                <div>
                  <p className="font-semibold text-payment">{method === "card" ? "Secure Payment Link Coming Soon" : "Payment Details Coming Soon"}</p>
                  <p className="text-sm text-payment">You will receive a <strong>separate email</strong> with {method === "card" ? "a secure payment link" : "the payment details"} within the next few minutes.</p>
                </div>
              </div>
            )}
            <div className="rounded-lg bg-background/70 p-4 text-payment">
              <p className="flex items-center gap-2 font-medium">📋 What happens next:</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                {NEXT[method].steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </div>
            <p className="rounded-lg border border-warning/30 bg-warning-soft p-4 text-sm text-warning">
              💬 If you don't receive the payment link within 10 minutes, please check your spam folder or contact us via email.
            </p>
          </section>
        </>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {SUPPORT_PHONE && (
          <Button variant="outline" asChild><a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}><Phone className="mr-2 h-4 w-4" /> Call Support</a></Button>
        )}
        <Button asChild className="bg-navy text-navy-foreground hover:bg-navy/90"><a href={`mailto:${SUPPORT_EMAIL}?subject=Order%20%23${orderNumber}`}><Mail className="mr-2 h-4 w-4" /> Email Support</a></Button>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <Button variant="outline" asChild><Link to="/"><Home className="mr-2 h-4 w-4" /> Back to Home</Link></Button>
        <Button variant="outline" asChild><Link to="/products"><ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping</Link></Button>
      </div>
      <div className="mt-10 border-t border-border pt-8 text-center">
        <p className="text-sm text-muted-foreground">Trusted by researchers worldwide</p>
        <div className="mt-3 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {["Free Worldwide Shipping", "24/7 Customer Support", "99%+ Purity Guaranteed"].map((t) => (
            <span key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> {t}</span>
          ))}
        </div>
      </div>
    </main>
  );
}

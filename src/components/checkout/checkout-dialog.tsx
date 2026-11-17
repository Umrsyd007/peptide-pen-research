import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft, ArrowRight, Building2, Check, ClipboardCheck, CreditCard, Globe, Home, Loader2,
  Mail, MapPin, MessageCircle, Package, Phone, User, ChevronsUpDown, Wallet,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCartStore } from "@/stores/cart";
import { useMoney, formatIn } from "@/lib/currency";
import { createOrder } from "@/lib/orders.functions";
import { verifyEmailDomain } from "@/lib/email-check.functions";
import { suggestEmail } from "@/lib/email-check";
import { getVisitorCountry } from "@/lib/currency.functions";
import { PHONE_COUNTRIES, countryName, flag, isPhoneCountry } from "@/lib/phone-countries";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  PAYMENT_LABELS, addressSchema, contactSchema, normalizePhone, type PaymentMethod,
} from "@/lib/checkout-rules";
import { COUNTRIES } from "@/lib/countries";
import { trackBeginCheckout } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "contact", label: "Contact", icon: User, sub: "Enter your contact information" },
  { key: "address", label: "Address", icon: MapPin, sub: "Where should we deliver?" },
  { key: "payment", label: "Payment", icon: CreditCard, sub: "Choose your payment method" },
  { key: "review", label: "Review", icon: ClipboardCheck, sub: "Review and confirm your order" },
] as const;

const METHODS: { id: PaymentMethod; icon: typeof CreditCard; note: string; extra?: string; badge?: string }[] = [
  { id: "whatsapp", icon: MessageCircle, note: "Chat with us to arrange payment", badge: "Recommended" },
  { id: "card", icon: CreditCard, note: "Secure payment link via email", extra: "(Apple Pay / Google Pay)" },
  { id: "bank", icon: Building2, note: "Direct bank transfer (UK/International)" },
  { id: "usdt", icon: Wallet, note: "Pay with cryptocurrency" },
];

const METHOD_INFO: Record<PaymentMethod, { title: string; body: string }> = {
  whatsapp: { title: "Pay via WhatsApp", body: "After placing your order, WhatsApp opens with your order details so we can arrange payment with you directly." },
  card: { title: "Secure Card Payment", body: "We accept all major debit and credit cards, including Apple Pay and Google Pay. After placing your order, WhatsApp opens with your order and we'll send you a secure payment link (via WhatsApp or email) to complete the transaction safely." },
  bank: { title: "Bank Transfer", body: "After placing your order, WhatsApp opens with your order so we can send our bank details and your order reference." },
  usdt: { title: "USDT (Crypto)", body: "After placing your order, WhatsApp opens with your order so we can send the wallet address and exact amount." },
};

type Errors = Record<string, string | undefined>;

export function CheckoutDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);
  const { currency, convert, format } = useMoney();
  const submitOrder = useServerFn(createOrder);
  const checkEmail = useServerFn(verifyEmailDomain);
  const visitorCountry = useServerFn(getVisitorCountry);

  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({ name: "", email: "", phoneCountry: "GB", phone: "" });
  const [address, setAddress] = useState({ address1: "", address2: "", city: "", postal: "", country: "" });
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [checking, setChecking] = useState(false);
  const [countryPicked, setCountryPicked] = useState(false);
  const [typoWarned, setTypoWarned] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);

  const subtotal = useMemo(
    () => Math.round(items.reduce((s, i) => s + convert(parseFloat(i.price.amount)) * i.quantity, 0) * 100) / 100,
    [items, convert],
  );
  const total = subtotal;
  const emailSuggestion = suggestEmail(contact.email);

  // Start the phone code and delivery country on the shopper's own country.
  useEffect(() => {
    if (!open || countryPicked) return;
    let alive = true;
    visitorCountry().then((iso) => {
      if (!alive || !isPhoneCountry(iso)) return;
      const up = iso.toUpperCase();
      setContact((c) => ({ ...c, phoneCountry: up }));
      const name = countryName(up);
      setAddress((a) => (a.country || !(COUNTRIES as readonly string[]).includes(name) ? a : { ...a, country: name }));
    }).catch(() => {});
    return () => { alive = false; };
  }, [open, countryPicked, visitorCountry]);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const validate = (which: number, c = contact, a = address): Errors => {
    const schema = which === 0 ? contactSchema : which === 1 ? addressSchema : null;
    if (!schema) return {};
    const r = schema.safeParse(which === 0 ? c : a);
    if (r.success) return {};
    const out: Errors = {};
    for (const issue of r.error.issues) out[String(issue.path[0])] ??= issue.message;
    return out;
  };

  const updateContact = (k: keyof typeof contact, v: string) => {
    const next = { ...contact, [k]: v };
    setContact(next);
    if (touched) setErrors(validate(0, next));
  };
  const updateAddress = (k: keyof typeof address, v: string) => {
    const next = { ...address, [k]: v };
    setAddress(next);
    if (touched) setErrors(validate(1, contact, next));
  };

  const next = async () => {
    const e = validate(step);
    setTouched(true);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step === 0) {
      // Pause once on a likely typo; a second Continue keeps what they typed.
      if (emailSuggestion && typoWarned !== contact.email) {
        setTypoWarned(contact.email);
        setErrors({ email: "Please check your email — tap the suggestion above, or press Continue to keep it." });
        return;
      }
      setChecking(true);
      try {
        const r = await checkEmail({ data: { email: contact.email.trim() } });
        if (r.error) { setErrors({ email: r.error }); return; }
      } catch { /* allow through if the check itself fails */ }
      finally { setChecking(false); }
    }
    setTouched(false);
    setErrors({});
    setStep((s) => Math.min(3, s + 1));
  };
  const back = () => {
    setErrors({});
    setTouched(false);
    if (step === 0) onOpenChange(false);
    else setStep((s) => s - 1);
  };

  const placeOrder = async () => {
    setPlacing(true);
    setPlaceError(null);
    try {
      const order = await submitOrder({
        data: {
          email: contact.email.trim(),
          phone: normalizePhone(contact.phoneCountry, contact.phone) ?? "",
          payment_method: method,
          ship_name: contact.name.trim(),
          ship_address1: address.address1,
          ship_address2: address.address2,
          ship_city: address.city,
          ship_region: "",
          ship_postal: address.postal,
          ship_country: address.country,
          currency,
          items: items.map((i) => ({
            productId: i.productId, name: i.title, variant: i.variantTitle ?? "",
            price: parseFloat(i.price.amount), qty: i.quantity,
          })),
        },
      });
      trackBeginCheckout({
        items: items.map((i) => ({
          item_id: i.productId, item_name: i.title, item_variant: i.variantTitle,
          price: convert(parseFloat(i.price.amount)), quantity: i.quantity, currency,
        })),
        value: total, currency,
      });
      clearCart();
      onOpenChange(false);
      setDrawerOpen(false);
      setStep(0);
      navigate({
        to: "/checkout/success/$orderNumber",
        params: { orderNumber: order.orderNumber },
        search: { id: order.id, t: order.token },
      });
    } catch (e) {
      setPlaceError(e instanceof Error ? e.message : "We couldn't place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const inputCls = (err?: string) => cn("h-11", err && "border-destructive focus-visible:ring-destructive");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-lg overflow-hidden p-0 flex flex-col gap-0">
        <div className="px-6 pt-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-bold">Complete Your Order</DialogTitle>
            <DialogDescription>{STEPS[step].sub}</DialogDescription>
          </DialogHeader>
          <ol className="mt-6 grid grid-cols-4">
            {STEPS.map((s, i) => {
              const done = i < step, active = i === step;
              return (
                <li key={s.key} className="relative flex flex-col items-center gap-2">
                  {i > 0 && <span className={cn("absolute right-1/2 top-5 h-0.5 w-full -z-0", i <= step ? "bg-foreground" : "bg-border")} />}
                  <span className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background",
                    done && "border-foreground bg-foreground text-background",
                    active && "border-foreground ring-4 ring-muted",
                    !done && !active && "border-border text-muted-foreground",
                  )}>
                    {done ? <Check className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                  </span>
                  <span className={cn("text-xs", active || done ? "text-foreground font-medium" : "text-muted-foreground")}>{s.label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <form id="checkout-form" autoComplete="on" onSubmit={(e) => e.preventDefault()} className="flex-1 overflow-y-auto px-6 py-6">
          {step === 0 && (
            <div className="space-y-4">
              <StepTitle title="Contact Information" sub="How can we reach you?" />
              <Field id="co-name" label="Full Name *" icon={User} error={errors["name"]}>
                <Input id="co-name" name="name" autoComplete="name" placeholder="Enter your full name" className={inputCls(errors["name"])}
                  value={contact.name} onChange={(e) => updateContact("name", e.target.value)} />
              </Field>
              <Field id="co-email" label="Email Address *" icon={Mail} error={errors["email"]}>
                <Input id="co-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="your@email.com" className={inputCls(errors["email"])}
                  value={contact.email} onChange={(e) => updateContact("email", e.target.value)} />
                {emailSuggestion && (
                  <button type="button" className="text-left text-xs text-muted-foreground"
                    onClick={() => updateContact("email", emailSuggestion)}>
                    Did you mean <span className="font-medium text-foreground underline">{emailSuggestion}</span>?
                  </button>
                )}
              </Field>
              <Field id="co-phone" label="Phone Number / WhatsApp Number *" icon={Phone} error={errors["phone"]}>
                <div className="flex gap-2">
                  <CountryCodePicker value={contact.phoneCountry}
                    onChange={(iso) => { setCountryPicked(true); updateContact("phoneCountry", iso); }} />
                  <Input id="co-phone" name="tel" type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone number" className={cn("flex-1", inputCls(errors["phone"]))}
                    value={contact.phone} onChange={(e) => updateContact("phone", e.target.value)} />
                </div>
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <StepTitle title="Delivery Address" sub="Where should we send your order?" />
              <Field id="co-a1" label="Address Line 1 *" icon={Home} error={errors["address1"]}>
                <Input id="co-a1" name="address-line1" autoComplete="shipping address-line1" placeholder="Street address" className={inputCls(errors["address1"])}
                  value={address.address1} onChange={(e) => updateAddress("address1", e.target.value)} />
              </Field>
              <Field id="co-a2" label="Address Line 2" icon={Building2}>
                <Input id="co-a2" name="address-line2" autoComplete="shipping address-line2" placeholder="Apartment, suite, unit, etc. (optional)" className="h-11"
                  value={address.address2} onChange={(e) => updateAddress("address2", e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field id="co-city" label="City *" icon={MapPin} error={errors["city"]}>
                  <Input id="co-city" name="city" autoComplete="shipping address-level2" placeholder="City" className={inputCls(errors["city"])}
                    value={address.city} onChange={(e) => updateAddress("city", e.target.value)} />
                </Field>
                <Field id="co-postal" label="Postcode/Zip *" error={errors["postal"]}>
                  <Input id="co-postal" name="postal-code" autoComplete="shipping postal-code" placeholder="Postcode/Zip" className={inputCls(errors["postal"])}
                    value={address.postal} onChange={(e) => updateAddress("postal", e.target.value)} />
                </Field>
              </div>
              <Field id="co-country" label="Country *" error={errors["country"]}>
                <Select value={address.country} onValueChange={(v) => updateAddress("country", v)}>
                  <SelectTrigger id="co-country" className={inputCls(errors["country"])}>
                    <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Select a country" /></span>
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <StepTitle title="Payment Method" sub="Choose how you'd like to pay" />
              {METHODS.map((m) => {
                const selected = method === m.id;
                return (
                  <button key={m.id} type="button" onClick={() => setMethod(m.id)} aria-pressed={selected}
                    className={cn("flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition",
                      selected ? "border-foreground bg-muted/40" : "border-border hover:border-muted-foreground/40")}>
                    <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                      selected ? "bg-foreground text-background" : "bg-muted text-foreground")}>
                      <m.icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex flex-wrap items-center gap-2 font-medium">
                        {PAYMENT_LABELS[m.id]}
                        {m.extra && <span className="text-xs font-normal text-muted-foreground">{m.extra}</span>}
                        {m.badge && <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success">{m.badge}</span>}
                      </span>
                      <span className="block text-sm text-muted-foreground">{m.note}</span>
                    </span>
                    <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                      selected ? "border-foreground bg-foreground text-background" : "border-border")}>
                      {selected && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })}
              {method === "card" ? (
              <div className="rounded-xl border border-info/20 bg-info-soft p-4">
                <p className="flex items-center gap-2 font-medium text-info"><CreditCard className="h-5 w-5" />Secure Card Payment</p>
                <p className="mt-1 pl-7 text-sm text-info">We accept all major debit and credit cards, including <strong>Apple Pay</strong> and <strong>Google Pay</strong>. After placing your order, WhatsApp opens with your order and we'll send you a secure payment link to complete the transaction safely.</p>
                {method === "card" && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-info/20 pt-3 text-xs">
                    <span className="text-muted-foreground">We accept:</span>
                    {[
                      { b: "VISA", c: "border-border bg-background text-brand-visa" },
                      { b: "Mastercard", c: "border-brand-mastercard/30 bg-background text-brand-mastercard" },
                      { b: "AMEX", c: "border-brand-amex bg-brand-amex text-brand-on" },
                      { b: "Apple Pay", c: "border-brand-apple bg-brand-apple text-brand-on" },
                      { b: "G Pay", c: "border-border bg-background text-foreground" },
                    ].map(({ b, c }) => (
                      <span key={b} className={cn("rounded-md border px-3 py-1.5 font-semibold", c)}>{b}</span>
                    ))}
                  </div>
                )}
              </div>
              ) : (
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="font-semibold">{METHOD_INFO[method].title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{METHOD_INFO[method].body}</p>
              </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <StepTitle title="Review Your Order" sub="Please confirm everything is correct" />
              <section className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2 font-semibold"><Package className="h-4 w-4" /> Order Items</h4>
                  <Badge variant="secondary">{itemCount} item{itemCount !== 1 ? "s" : ""}</Badge>
                </div>
                <div className="mt-3 space-y-3">
                  {items.map((i) => (
                    <div key={i.variantId} className="flex items-center gap-3">
                      {i.image && <img src={i.image} alt="" className="h-12 w-12 rounded object-contain bg-muted/40" />}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{i.title}{i.variantTitle ? ` · ${i.variantTitle}` : ""}</p>
                        <p className="text-xs text-muted-foreground">Qty: {i.quantity} × {format(parseFloat(i.price.amount))}</p>
                      </div>
                      <span className="text-sm font-medium">{formatIn(convert(parseFloat(i.price.amount)) * i.quantity, currency)}</span>
                    </div>
                  ))}
                </div>
                <Totals subtotal={subtotal} discount={0} total={total} currency={currency} />
              </section>
              <section className="rounded-xl border border-border p-4 text-sm">
                <h4 className="flex items-center gap-2 font-semibold"><User className="h-4 w-4" /> Contact Details</h4>
                <p className="mt-2">{contact.name}</p><p>{contact.email}</p><p>{normalizePhone(contact.phoneCountry, contact.phone) ?? contact.phone}</p>
              </section>
              <section className="rounded-xl border border-border p-4 text-sm">
                <h4 className="flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4" /> Delivery Address</h4>
                <p className="mt-2">{address.address1}</p>
                {address.address2 && <p>{address.address2}</p>}
                <p>{address.city}, {address.postal}</p><p>{address.country}</p>
              </section>
              <section className="rounded-xl border border-border p-4 text-sm">
                <h4 className="flex items-center gap-2 font-semibold"><CreditCard className="h-4 w-4" /> Payment Method</h4>
                <p className="mt-2">{PAYMENT_LABELS[method]}</p>
              </section>
              <div className="flex gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"><Check className="h-4 w-4" /></span>
                <div>
                  <p className="font-semibold">Ready to Place Order</p>
                  <p className="text-sm text-muted-foreground">Click "Place Order" below to confirm. You'll receive a confirmation email with next steps.</p>
                </div>
              </div>
              {placeError && <p className="text-sm text-destructive">{placeError}</p>}
            </div>
          )}
        </form>

        <div className="grid grid-cols-2 gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" className="h-12" onClick={back} disabled={placing}>
            {step === 0 ? "Cancel" : <><ArrowLeft className="mr-2 h-4 w-4" /> Back</>}
          </Button>
          {step < 3 ? (
            <Button className="h-12" onClick={next} disabled={checking}>{checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
          ) : (
            <Button className="h-12" onClick={placeOrder} disabled={placing || items.length === 0}>
              {placing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CreditCard className="mr-2 h-4 w-4" /> Place Order</>}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ id, label, icon: Icon, children, error }: { id: string; label: string; icon?: typeof User; children: React.ReactNode; error?: string }){
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />} {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function CountryCodePicker({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const [open, setOpen] = useState(false);
  const current = PHONE_COUNTRIES.find((c) => c.iso === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" aria-label="Country code" className="h-11 shrink-0 gap-1 px-3">
          <span>{flag(value)}</span><span>{current?.dial}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country or code" />
          <CommandList className="max-h-64 overscroll-contain" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {PHONE_COUNTRIES.map((c) => (
                <CommandItem key={c.iso} value={`${c.name} ${c.dial} ${c.iso}`}
                  onSelect={() => { onChange(c.iso); setOpen(false); }}>
                  <span className="mr-2">{flag(c.iso)}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-muted-foreground">{c.dial}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function StepTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="pb-2 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function Totals({ subtotal, discount, total, currency }: { subtotal: number; discount: number; total: number; currency: string }) {
  return (
    <div className="mt-4 space-y-1.5 text-sm">
      <Row label="Subtotal" value={formatIn(subtotal, currency)} />
      {discount > 0 && <Row label="Discount" value={`−${formatIn(discount, currency)}`} />}
      <Row label="Consultation Charge" value="FREE" />
      <Row label="Express Shipping" value="FREE" />
      <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
        <span>Total</span><span>{formatIn(total, currency)}</span>
      </div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="text-foreground">{value}</span></div>;
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { checkIsAdmin, listAdminOrders, type AdminOrder } from "@/lib/admin-orders.functions";
import type { Period } from "@/lib/admin-orders";
import { formatMoney } from "@/lib/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders Admin | Peptide Pen Research" },
      { name: "description", content: "Private orders dashboard." },
      { property: "og:title", content: "Orders Admin | Peptide Pen Research" },
      { property: "og:description", content: "Private orders dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminOrdersPage,
});

type Status = "all" | "paid" | "pending" | "failed";

function statusVariant(s: string): "default" | "secondary" | "destructive" | "outline" {
  if (s === "paid") return "default";
  if (s === "pending") return "secondary";
  if (s === "failed") return "destructive";
  return "outline";
}

function addressLines(o: AdminOrder) {
  return [
    o.ship_name,
    o.ship_address1,
    o.ship_address2,
    [o.ship_city, o.ship_region, o.ship_postal].filter(Boolean).join(", "),
    o.ship_country,
  ].filter(Boolean) as string[];
}

function AdminOrdersPage() {
  const isAdminFn = useServerFn(checkIsAdmin);
  const listFn = useServerFn(listAdminOrders);
  const [period, setPeriod] = useState<Period>("30d");
  const [status, setStatus] = useState<Status>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const admin = useQuery({ queryKey: ["is-admin"], queryFn: () => isAdminFn() });
  const list = useQuery({
    queryKey: ["admin-orders", period, status, search, page],
    queryFn: () => listFn({ data: { period, status, search, page } }),
    enabled: admin.data?.isAdmin === true,
    placeholderData: keepPreviousData,
  });

  if (admin.isLoading) return <main className="p-12 text-muted-foreground">Loading…</main>;
  if (!admin.data?.isAdmin)
    return (
      <main className="mx-auto max-w-xl p-12">
        <h1 className="text-xl font-semibold">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">This page is only for store admins.</p>
        <Link to="/" className="mt-4 inline-block underline">Back to store</Link>
      </main>
    );

  const s = list.data?.summary;
  const cards = [
    { label: "Paid orders", value: s ? String(s.paidOrders) : "—" },
    { label: "Items ordered", value: s ? String(s.itemsOrdered) : "—" },
    { label: "Revenue", value: s ? formatMoney(s.revenue) : "—" },
    { label: "Pending checkouts", value: s ? String(s.pendingCount) : "—" },
    { label: "Pending value", value: s ? formatMoney(s.pendingValue) : "—" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Tabs value={period} onValueChange={(v) => { setPeriod(v as Period); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="7d">7 days</TabsTrigger>
            <TabsTrigger value="30d">30 days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-1"><CardTitle className="text-xs font-medium text-muted-foreground">{c.label}</CardTitle></CardHeader>
            <CardContent><div className="text-xl font-semibold">{c.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={status} onValueChange={(v) => { setStatus(v as Status); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          className="max-w-xs"
          placeholder="Search order #, name or email"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="mt-4 rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data?.orders.map((o) => (
              <TableRow key={o.id} className="cursor-pointer" onClick={() => setSelected(o)}>
                <TableCell className="font-medium">#{o.order_number}</TableCell>
                <TableCell>{new Date(o.created_at).toLocaleString()}</TableCell>
                <TableCell>{o.ship_name ?? "—"}</TableCell>
                <TableCell className="hidden md:table-cell">{o.email}</TableCell>
                <TableCell>{o.order_items.reduce((n, i) => n + i.qty, 0)}</TableCell>
                <TableCell>{formatMoney(o.total, o.currency)}</TableCell>
                <TableCell><Badge variant={statusVariant(o.status)} className="capitalize">{o.status}</Badge></TableCell>
              </TableRow>
            ))}
            {list.data && list.data.orders.length === 0 && (
              <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No orders found.</TableCell></TableRow>
            )}
            {list.isLoading && (
              <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">Loading…</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>{list.data?.total ?? 0} orders</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span>Page {page} of {list.data?.pageCount ?? 1}</span>
          <Button variant="outline" size="sm" disabled={page >= (list.data?.pageCount ?? 1)} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Order #{selected.order_number}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-6 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(selected.status)} className="capitalize">{selected.status}</Badge>
                  <span className="text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</span>
                </div>
                <section>
                  <h3 className="font-medium">Customer</h3>
                  <p className="mt-1">{selected.ship_name}</p>
                  <a className="underline" href={`mailto:${selected.email}`}>{selected.email}</a>
                </section>
                <section>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Shipping address</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(addressLines(selected).join("\n"));
                        toast.success("Address copied");
                      }}
                    >Copy</Button>
                  </div>
                  <div className="mt-1">{addressLines(selected).map((l) => <div key={l}>{l}</div>)}</div>
                </section>
                <section>
                  <h3 className="font-medium">Items</h3>
                  <div className="mt-2 divide-y divide-border rounded-md border border-border">
                    {selected.order_items.map((i, idx) => (
                      <div key={idx} className="flex justify-between gap-3 p-3">
                        <div>
                          <div>{i.name}</div>
                          <div className="text-muted-foreground">{i.variant ?? ""} · {i.qty} × {formatMoney(i.price)}</div>
                        </div>
                        <div className="font-medium">{formatMoney(i.price * i.qty)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(selected.subtotal)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>{selected.shipping ? formatMoney(selected.shipping) : "Free"}</span></div>
                    <div className="flex justify-between font-semibold"><span>Total</span><span>{formatMoney(selected.total, selected.currency)}</span></div>
                  </div>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}

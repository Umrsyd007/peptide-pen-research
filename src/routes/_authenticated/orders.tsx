import { createFileRoute, Link } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Package, RefreshCw, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listManagedOrders } from '@/lib/order-management.functions';

const ordersQuery = queryOptions({ queryKey: ['managed-orders'], queryFn: () => listManagedOrders(), refetchInterval: 30000 });

export const Route = createFileRoute('/_authenticated/orders')({
  loader: ({ context }) => context.queryClient.ensureQueryData(ordersQuery),
  head: () => ({ meta: [
    { title: 'Order Management | PeptidePen' },
    { name: 'description', content: 'Private PeptidePen order management and AI order summaries.' },
    { property: 'og:title', content: 'Order Management | PeptidePen' },
    { property: 'og:description', content: 'Private PeptidePen order management and AI order summaries.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
    { name: 'robots', content: 'noindex, nofollow' },
  ] }),
  errorComponent: () => <main className="mx-auto max-w-6xl px-4 py-12"><h1 className="text-2xl font-semibold">Orders unavailable</h1><p className="mt-3 text-muted-foreground">We couldn’t load your orders. Please try again.</p><Button asChild variant="outline" className="mt-4"><Link to="/account">Back to account</Link></Button></main>,
  component: OrderManagementPage,
});

function money(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function OrderManagementPage() {
  const { data, refetch, isFetching } = useSuspenseQuery(ordersQuery);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  if (!data.allowed) return <main className="mx-auto max-w-2xl px-4 py-12"><Link to="/account" className="text-sm text-muted-foreground">← My account</Link><h1 className="mt-6 text-2xl font-semibold">Order management access required</h1><p className="mt-3 text-muted-foreground">This account does not have permission to view store orders.</p></main>;
  const orders = data.orders.filter((order) => (status === 'all' || order.status === status)
    && `${order.order_number} ${order.ship_name} ${order.email} ${order.order_items.map((i) => i.name).join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <Link to="/account" className="text-sm text-muted-foreground hover:text-foreground">← My account</Link>
    <div className="mt-5 flex items-center justify-between gap-4"><div><h1 className="text-3xl font-semibold">Orders</h1><p className="mt-2 text-sm text-muted-foreground">{data.orders.length} recent orders</p></div><Button variant="outline" size="icon" title="Refresh orders" aria-label="Refresh orders" onClick={() => refetch()} disabled={isFetching}><RefreshCw className={isFetching ? 'animate-spin motion-reduce:animate-none' : ''} /></Button></div>
    <div className="my-7 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Search orders" placeholder="Search order, customer or product" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" /></div><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full sm:w-44" aria-label="Order status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="failed">Failed</SelectItem></SelectContent></Select></div>
    <div className="divide-y divide-border border-y border-border">
      {orders.map((order) => <article key={order.id} className="py-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-semibold">#{order.order_number}</h2><span className="text-sm font-medium capitalize text-primary">{order.status}</span><time className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString('en-US')}</time></div><p className="text-lg font-semibold">{money(order.total, order.currency)}</p></div>
        <div className="mt-4 grid gap-5 md:grid-cols-[2fr_1fr]">
          <div><div className="flex items-center gap-2 text-sm font-medium"><Sparkles className="size-4 text-primary" />AI summary</div><p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">{order.ai_summary ?? (order.ai_summary_status === 'failed' ? 'Summary unavailable. Order details remain below.' : order.ai_summary_status === 'generating' ? 'Generating summary…' : 'No summary yet.')}</p>
          <ul className="mt-4 space-y-2 text-sm">{order.order_items.map((item, index) => <li key={index} className="flex justify-between gap-4"><span className="min-w-0 break-words">{item.qty} × {item.name}{item.variant ? ` · ${item.variant}` : ''}</span><span className="shrink-0">{money(item.price * item.qty, order.currency)}</span></li>)}</ul></div>
          <div className="text-sm leading-6"><p className="font-medium break-words">{order.ship_name}</p><a href={`mailto:${order.email}`} className="break-all text-primary">{order.email}</a><address className="mt-2 not-italic text-muted-foreground">{order.ship_address1}<br />{order.ship_address2 && <>{order.ship_address2}<br /></>}{order.ship_city}, {order.ship_region} {order.ship_postal}<br />{order.ship_country}</address></div>
        </div>
      </article>)}
      {!orders.length && <div className="py-16 text-center text-muted-foreground"><Package className="mx-auto mb-3 size-7" /><p>{data.orders.length ? 'No matching orders' : 'No orders yet'}</p></div>}
    </div>
  </main>;
}
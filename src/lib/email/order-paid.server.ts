import type { SupabaseClient } from '@supabase/supabase-js'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'
import type { OrderEmailData } from '@/lib/email-templates/order-shared'

export const ADMIN_RECIPIENT = 'hello@getpeptidepen.com'

/** Stable per-order keys so Stripe webhook retries never send twice. */
export function orderEmailKeys(orderId: string) {
  return { admin: `order-paid-${orderId}-admin`, customer: `order-paid-${orderId}-customer` }
}

/** Sends the admin notice and customer receipt for a paid order. Never throws. */
export async function notifyOrderPaid(supabase: SupabaseClient, orderNumber: string) {
  const { data: order, error } = await supabase
    .from('orders')
    .select('id,order_number,email,status,subtotal,shipping,total,currency,ship_name,ship_address1,ship_address2,ship_city,ship_region,ship_postal,ship_country,created_at')
    .eq('order_number', orderNumber)
    .maybeSingle()
  if (error || !order || order.status !== 'paid') {
    console.error('Order email skipped', { orderNumber, reason: error?.code ?? (order ? 'not_paid' : 'not_found') })
    return
  }
  const { data: items } = await supabase
    .from('order_items').select('name,variant,qty,price').eq('order_id', order.id)

  const data: OrderEmailData = {
    orderNumber: order.order_number, createdAt: order.created_at, email: order.email,
    shipName: order.ship_name, address1: order.ship_address1, address2: order.ship_address2,
    city: order.ship_city, region: order.ship_region, postal: order.ship_postal, country: order.ship_country,
    items: (items ?? []).map((i) => ({ name: i.name, variant: i.variant, qty: i.qty, price: Number(i.price) })),
    subtotal: Number(order.subtotal), shipping: Number(order.shipping), total: Number(order.total),
    currency: order.currency || 'USD',
  }
  const keys = orderEmailKeys(order.id)

  const results = await Promise.allSettled([
    sendTemplateEmail('order-admin', ADMIN_RECIPIENT, { templateData: data, idempotencyKey: keys.admin, replyTo: order.email }),
    sendTemplateEmail('order-confirmation', order.email, { templateData: data, idempotencyKey: keys.customer, replyTo: ADMIN_RECIPIENT }),
  ])
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error('Order email failed', { orderNumber, which: i === 0 ? 'admin' : 'customer', error: r.reason instanceof Error ? r.reason.message : String(r.reason) })
    }
  })
}

/** Sends the store a pending-checkout notice when an order is created. Never throws. */
export async function notifyOrderPending(supabase: SupabaseClient, orderId: string) {
  try {
    const { data: order } = await supabase
      .from('orders')
      .select('id,order_number,email,subtotal,shipping,total,currency,ship_name,ship_address1,ship_address2,ship_city,ship_region,ship_postal,ship_country,created_at')
      .eq('id', orderId).maybeSingle()
    if (!order) return
    const { data: items } = await supabase.from('order_items').select('name,variant,qty,price').eq('order_id', order.id)
    const data: OrderEmailData = {
      orderNumber: order.order_number, createdAt: order.created_at, email: order.email,
      shipName: order.ship_name, address1: order.ship_address1, address2: order.ship_address2,
      city: order.ship_city, region: order.ship_region, postal: order.ship_postal, country: order.ship_country,
      items: (items ?? []).map((i) => ({ name: i.name, variant: i.variant, qty: i.qty, price: Number(i.price) })),
      subtotal: Number(order.subtotal), shipping: Number(order.shipping), total: Number(order.total),
      currency: order.currency || 'USD',
    }
    await sendTemplateEmail('order-pending', ADMIN_RECIPIENT, {
      templateData: data, idempotencyKey: `order-pending-${order.id}-admin`, replyTo: order.email,
    })
  } catch (e) {
    console.error('Pending order email failed', { orderId, error: e instanceof Error ? e.message : String(e) })
  }
}

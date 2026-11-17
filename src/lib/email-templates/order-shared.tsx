import React from 'react'
import { Column, Hr, Row, Section, Text } from '@react-email/components'

export interface OrderEmailItem {
  name: string
  variant?: string | null
  qty: number
  price: number
}

export interface OrderEmailData {
  orderNumber?: string
  createdAt?: string
  email?: string
  shipName?: string
  address1?: string
  address2?: string | null
  city?: string
  region?: string
  postal?: string
  country?: string
  items?: OrderEmailItem[]
  subtotal?: number
  shipping?: number
  total?: number
  currency?: string
  phone?: string | null
  paymentMethod?: string | null
  discount?: number
  totalLabel?: string
}

export const money = (n: number | undefined, currency = 'GBP') =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currencyDisplay: 'narrowSymbol', currency }).format(Number(n ?? 0))

export function ItemsTable({ items = [], currency = 'GBP' }: { items?: OrderEmailItem[]; currency?: string }) {
  return (
    <Section>
      {items.map((i, idx) => (
        <Row key={idx} style={{ marginBottom: '10px' }}>
          <Column>
            <Text style={itemName}>{i.name}</Text>
            <Text style={itemMeta}>
              {i.variant ? `${i.variant} · ` : ''}Qty {i.qty} × {money(i.price, currency)}
            </Text>
          </Column>
          <Column align="right" style={{ verticalAlign: 'top' }}>
            <Text style={itemName}>{money(i.price * i.qty, currency)}</Text>
          </Column>
        </Row>
      ))}
    </Section>
  )
}

export function Totals({ subtotal, shipping, total, discount, totalLabel = 'Total paid', currency = 'GBP' }: OrderEmailData) {
  return (
    <Section>
      <Hr style={hr} />
      <Row><Column><Text style={meta}>Subtotal</Text></Column><Column align="right"><Text style={meta}>{money(subtotal, currency)}</Text></Column></Row>
      <Row><Column><Text style={meta}>Shipping</Text></Column><Column align="right"><Text style={meta}>{shipping ? money(shipping, currency) : 'Free'}</Text></Column></Row>
      {discount ? <Row><Column><Text style={meta}>Discount</Text></Column><Column align="right"><Text style={meta}>−{money(discount, currency)}</Text></Column></Row> : null}
      <Row><Column><Text style={totalText}>{totalLabel}</Text></Column><Column align="right"><Text style={totalText}>{money(total, currency)}</Text></Column></Row>
    </Section>
  )
}

export function Address(d: OrderEmailData) {
  return (
    <Text style={value}>
      {d.shipName}<br />
      {d.address1}<br />
      {d.address2 ? (<>{d.address2}<br /></>) : null}
      {d.city}, {d.region} {d.postal}<br />
      {d.country}
    </Text>
  )
}

export const previewOrder: OrderEmailData = {
  orderNumber: '482913',
  createdAt: '2026-11-02T01:00:00Z',
  email: 'jane@example.com',
  shipName: 'Jane Doe',
  address1: '123 Main St',
  address2: 'Apt 4',
  city: 'Austin',
  region: 'TX',
  postal: '78701',
  country: 'United States',
  items: [{ name: '(Ret) - GLP3R (Standard Pen)', variant: '20mg', qty: 1, price: 165.29 }],
  subtotal: 165.29,
  shipping: 0,
  total: 165.29,
  currency: 'GBP',
}

export const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }
export const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
export const h1 = { fontSize: '22px', fontWeight: 800 as const, color: '#0a0a0a', margin: '0 0 8px 0', textTransform: 'uppercase' as const, letterSpacing: '-0.02em' }
export const subhead = { fontSize: '14px', color: '#525252', margin: '0 0 24px 0', lineHeight: '1.5' }
export const card = { border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px 20px 8px 20px', backgroundColor: '#fafafa', marginBottom: '16px' }
export const label = { fontSize: '11px', fontWeight: 700 as const, color: '#737373', textTransform: 'uppercase' as const, letterSpacing: '0.06em', margin: '0 0 4px 0' }
export const value = { fontSize: '15px', color: '#0a0a0a', margin: '0 0 16px 0', lineHeight: '1.5' }
const itemName = { fontSize: '14px', fontWeight: 600 as const, color: '#0a0a0a', margin: 0 }
const itemMeta = { fontSize: '12px', color: '#737373', margin: '2px 0 0 0' }
const meta = { fontSize: '13px', color: '#525252', margin: '4px 0' }
const totalText = { fontSize: '16px', fontWeight: 800 as const, color: '#0a0a0a', margin: '8px 0' }
export const hr = { borderColor: '#e5e5e5', margin: '8px 0' }
export const footer = { fontSize: '12px', color: '#737373', margin: '20px 0 0 0' }

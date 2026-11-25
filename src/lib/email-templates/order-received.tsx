import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import {
  Address, ItemCount, Totals, card, container, footer, h1, label, main, money,
  previewOrder, subhead, value, type OrderEmailData,
} from './order-shared'

const OrderReceivedEmail = (d: OrderEmailData) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Order #{d.orderNumber ?? ''} received · payment link coming soon</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Order received</Heading>
        <Text style={subhead}>
          Thanks{d.shipName ? `, ${d.shipName}` : ''}! Your order #{d.orderNumber} has been placed. We'll send you a secure payment link by email shortly. Your order is processed as soon as payment is confirmed.
        </Text>
        <Section style={card}>
          <Text style={label}>Order ID</Text>
          <Text style={value}>#{d.orderNumber}</Text>
          <Text style={label}>Payment method</Text>
          <Text style={value}>{d.paymentMethod ?? '—'}</Text>
          <Text style={label}>Ship to</Text>
          <Address {...d} />
        </Section>
        <Section style={card}>
          <Text style={label}>Order</Text>
          <ItemCount items={d.items} />
          <Totals {...d} totalLabel="Total due" />
        </Section>
        <Text style={footer}>If you don't receive your payment link within 10 minutes, check your spam folder or reply to this email.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderReceivedEmail,
  subject: (d: Record<string, any>) => `Order #${d?.orderNumber ?? ''} received — ${money(d?.total, d?.currency)}`,
  displayName: 'Order Received (Customer)',
  previewData: { ...previewOrder, paymentMethod: 'Debit/Credit Card', phone: '+447700900123' },
} satisfies TemplateEntry

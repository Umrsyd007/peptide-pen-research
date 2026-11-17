import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import {
  Address, ItemsTable, Totals, card, container, footer, h1, label, main, money,
  previewOrder, subhead, value, type OrderEmailData,
} from './order-shared'

const OrderPendingEmail = (d: OrderEmailData) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New order #{d.orderNumber ?? ''} · {money(d.total, d.currency)}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New order #{d.orderNumber}</Heading>
        <Text style={subhead}>
          New order placed and awaiting payment{d.createdAt ? ` (started ${new Date(d.createdAt).toUTCString()})` : ''}. Send the customer a payment link, then mark the order paid in the dashboard.
        </Text>
        <Section style={card}>
          <Text style={label}>Customer</Text>
          <Text style={value}>{d.shipName}<br />{d.email}{d.phone ? <><br />{d.phone}</> : null}</Text>
          <Text style={label}>Payment method</Text>
          <Text style={value}>{d.paymentMethod ?? '—'}</Text>
          <Text style={label}>Ship to</Text>
          <Address {...d} />
        </Section>
        <Section style={card}>
          <Text style={label}>Items</Text>
          <ItemsTable items={d.items} currency={d.currency} />
          <Totals {...d} totalLabel="Total due" />
        </Section>
        <Text style={footer}>Reply to this email to contact the customer.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderPendingEmail,
  subject: (d: Record<string, any>) => `New order #${d?.orderNumber ?? ''} — ${money(d?.total, d?.currency)}`,
  displayName: 'Pending Checkout (Internal)',
  to: 'hello@getpeptidepen.com',
  previewData: previewOrder,
} satisfies TemplateEntry

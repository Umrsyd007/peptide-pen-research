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
    <Preview>Pending checkout #{d.orderNumber ?? ''} · {money(d.total, d.currency)}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Pending checkout #{d.orderNumber}</Heading>
        <Text style={subhead}>
          Customer reached payment but has not paid yet{d.createdAt ? ` (started ${new Date(d.createdAt).toUTCString()})` : ''}. You'll get a separate email if they complete payment.
        </Text>
        <Section style={card}>
          <Text style={label}>Customer</Text>
          <Text style={value}>{d.shipName}<br />{d.email}</Text>
          <Text style={label}>Ship to</Text>
          <Address {...d} />
        </Section>
        <Section style={card}>
          <Text style={label}>Items</Text>
          <ItemsTable items={d.items} currency={d.currency} />
          <Totals {...d} />
        </Section>
        <Text style={footer}>Reply to this email to contact the customer.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderPendingEmail,
  subject: (d: Record<string, any>) => `Pending checkout #${d?.orderNumber ?? ''} — ${money(d?.total, d?.currency)}`,
  displayName: 'Pending Checkout (Internal)',
  to: 'hello@getpeptidepen.com',
  previewData: previewOrder,
} satisfies TemplateEntry

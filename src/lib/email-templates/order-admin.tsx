import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import {
  Address, ItemsTable, Totals, card, container, footer, h1, label, main, money,
  previewOrder, subhead, value, type OrderEmailData,
} from './order-shared'

const OrderAdminEmail = (d: OrderEmailData) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New paid order #{d.orderNumber ?? ''} · {money(d.total, d.currency)}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New paid order #{d.orderNumber}</Heading>
        <Text style={subhead}>
          Stripe confirmed payment{d.createdAt ? ` for an order placed ${new Date(d.createdAt).toUTCString()}` : ''}.
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
  component: OrderAdminEmail,
  subject: (d: Record<string, any>) => `New paid order #${d?.orderNumber ?? ''} — ${money(d?.total, d?.currency)}`,
  displayName: 'New Order (Internal)',
  to: 'hello@getpeptidepen.com',
  previewData: previewOrder,
} satisfies TemplateEntry

import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import {
  Address, ItemCount, PayButton, Totals, card, container, footer, h1, label, main,
  previewOrder, subhead, type OrderEmailData,
} from './order-shared'

const OrderConfirmationEmail = (d: OrderEmailData) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your PeptidePen order #{d.orderNumber ?? ''} is confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thanks for your order</Heading>
        <Text style={subhead}>
          {d.shipName ? `Hi ${d.shipName}, ` : ''}we've received your payment for order #{d.orderNumber}. We'll ship it free to the address below. We are preparing your order and your item is expected to ship within 5-7 business days. We will email you a tracking number when your order ships out. Thank you for placing your trust in us and we hope to serve you again.
        </Text>
        <Section style={card}>
          <Text style={label}>Order summary</Text>
          <ItemCount items={d.items} />
          <Totals {...d} />
        </Section>
        <Section style={card}>
          <Text style={label}>Shipping to</Text>
          <Address {...d} />
        </Section>
        <Text style={footer}>Questions? Reply to this email or write to hello@getpeptidepen.com.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmationEmail,
  subject: (d: Record<string, any>) => `Order confirmed — #${d?.orderNumber ?? ''}`,
  displayName: 'Order Confirmation',
  previewData: previewOrder,
} satisfies TemplateEntry

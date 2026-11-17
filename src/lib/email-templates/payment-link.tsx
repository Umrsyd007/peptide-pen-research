import React from 'react'
import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { PayButton, card, container, footer, h1, label, main, money, subhead, value } from './order-shared'

interface Props {
  firstName?: string
  orderNumber?: string
  itemCount?: number
  total?: number
  currency?: string
  paymentLink?: string
}

const PaymentLinkEmail = ({ firstName, orderNumber, itemCount = 1, total, currency = 'GBP', paymentLink }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Complete your payment for order #{orderNumber ?? ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Complete your payment</Heading>
        <Text style={subhead}>Hi {firstName || 'there'},</Text>
        <Text style={subhead}>Thank you for your order with Peptide Pen. Your order is reserved and ready to go as soon as payment is complete.</Text>
        <Section style={card}>
          <Text style={label}>Order #{orderNumber}</Text>
          <Text style={value}>{itemCount} item{itemCount === 1 ? '' : 's'} · Total {money(total, currency)}</Text>
        </Section>
        <PayButton href={paymentLink} />
        <Text style={subhead}>You can pay securely by card, Apple Pay or Google Pay.</Text>
        <Text style={subhead}>Once payment is confirmed, delivery is expected in 3–5 days, tracked and securely shipped.</Text>
        <Text style={subhead}>Any questions? Chat with us directly on our website: <Link href="https://getpeptidepen.com">https://getpeptidepen.com</Link></Text>
        <Text style={footer}>Thanks,<br />The Peptide Pen Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PaymentLinkEmail,
  subject: (d: Record<string, any>) => `Complete your payment – Order #${d?.orderNumber ?? ''}`,
  displayName: 'Payment Link (Customer)',
  previewData: { firstName: 'Jane', orderNumber: '123456', itemCount: 1, total: 259, currency: 'GBP', paymentLink: 'https://example.com/pay' },
} satisfies TemplateEntry

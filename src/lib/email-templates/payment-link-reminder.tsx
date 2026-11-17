import React from 'react'
import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { card, container, footer, h1, label, main, money, subhead, value } from './order-shared'

interface Props {
  firstName?: string
  orderNumber?: string
  itemCount?: number
  total?: number
  currency?: string
}

const PaymentLinkReminderEmail = ({ firstName, orderNumber, itemCount = 1, total, currency = 'GBP' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your secure payment link for order #{orderNumber ?? ''} was sent</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your payment link was sent</Heading>
        <Text style={subhead}>Hi {firstName || 'there'},</Text>
        <Text style={subhead}>We recently sent you a secure payment link to complete your order.</Text>
        <Section style={card}>
          <Text style={label}>Order #{orderNumber}</Text>
          <Text style={value}>{itemCount} item{itemCount === 1 ? '' : 's'} · Total {money(total, currency)}</Text>
        </Section>
        <Text style={subhead}>If you haven't received it, please check your Spam or Junk folder for an email from notify.getpeptidepen.com. To make sure future emails reach you, mark it as "Not spam".</Text>
        <Text style={subhead}>Once payment is complete, your order ships within 3–5 days, tracked and securely shipped.</Text>
        <Text style={subhead}>Questions? Just reach out via the chat on our website: <Link href="https://getpeptidepen.com">https://getpeptidepen.com</Link></Text>
        <Text style={footer}>Thank you,<br />The Peptide Pen Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PaymentLinkReminderEmail,
  subject: (d: Record<string, any>) => `Your secure payment link for order #${d?.orderNumber ?? ''}`,
  displayName: 'Payment Link Reminder (Customer)',
  previewData: { firstName: 'Jane', orderNumber: '123456', itemCount: 1, total: 259, currency: 'GBP' },
} satisfies TemplateEntry

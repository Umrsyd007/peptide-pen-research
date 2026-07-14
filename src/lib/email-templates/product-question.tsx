import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  productName?: string
  productId?: string
  name?: string
  email?: string
  message?: string
}

const ProductQuestionEmail = ({
  productName = 'Unknown product',
  productId,
  name = 'Anonymous',
  email = 'no-reply@unknown',
  message = '',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New product question from {name} about {productName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New product question</Heading>
        <Text style={subhead}>Someone asked a question about a restricted product on getpeptidepen.com.</Text>

        <Section style={card}>
          <Text style={label}>Product</Text>
          <Text style={value}>
            {productName}
            {productId ? ` (${productId})` : ''}
          </Text>

          <Hr style={hr} />

          <Text style={label}>From</Text>
          <Text style={value}>{name}</Text>

          <Text style={label}>Email</Text>
          <Text style={value}>{email}</Text>

          <Hr style={hr} />

          <Text style={label}>Message</Text>
          <Text style={messageText}>{message}</Text>
        </Section>

        <Text style={footer}>Reply directly to the customer at {email}.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ProductQuestionEmail,
  subject: (data: Record<string, any>) =>
    `New product question: ${data?.productName ?? 'restricted product'}`,
  displayName: 'Product Question (Internal)',
  to: 'hello@getpeptidepen.com',
  previewData: {
    productName: 'Retatrutide',
    productId: '357579fd',
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Do you ship this to the EU?',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 800 as const, color: '#0a0a0a', margin: '0 0 8px 0', textTransform: 'uppercase' as const, letterSpacing: '-0.02em' }
const subhead = { fontSize: '14px', color: '#525252', margin: '0 0 24px 0', lineHeight: '1.5' }
const card = { border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px 20px 8px 20px', backgroundColor: '#fafafa' }
const label = { fontSize: '11px', fontWeight: 700 as const, color: '#737373', textTransform: 'uppercase' as const, letterSpacing: '0.06em', margin: '0 0 4px 0' }
const value = { fontSize: '15px', color: '#0a0a0a', margin: '0 0 16px 0' }
const messageText = { fontSize: '15px', color: '#0a0a0a', margin: '0 0 16px 0', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const }
const hr = { borderColor: '#e5e5e5', margin: '4px 0 16px 0' }
const footer = { fontSize: '12px', color: '#737373', margin: '20px 0 0 0' }

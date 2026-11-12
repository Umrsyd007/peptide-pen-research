import { describe, it, expect } from 'vitest'
import * as React from 'react'
import { render } from '@react-email/render'
import { TEMPLATES } from '@/lib/email-templates/registry'
import { orderEmailKeys } from './order-paid.server'
import { previewOrder } from '@/lib/email-templates/order-shared'

describe('order emails', () => {
  it('admin notice always goes to hello@getpeptidepen.com', () => {
    expect(TEMPLATES['order-admin'].to).toBe('hello@getpeptidepen.com')
  })
  it('customer receipt has no fixed recipient', () => {
    expect(TEMPLATES['order-confirmation'].to).toBeUndefined()
  })
  it('admin notice lists customer, address, items and total', async () => {
    const html = await render(React.createElement(TEMPLATES['order-admin'].component, previewOrder), { plainText: true })
    for (const s of ['Jane Doe', 'jane@example.com', '123 Main St', 'Austin', '20mg', '£165.29']) expect(html).toContain(s)
  })
  it('receipt shows the currency the order was charged in', async () => {
    const html = await render(React.createElement(TEMPLATES['order-confirmation'].component, { ...previewOrder, currency: 'EUR' }), { plainText: true })
    expect(html).toContain('€')
    expect(html).not.toContain('£')
  })
  it('uses stable distinct keys per order', () => {
    expect(orderEmailKeys('abc')).toEqual({ admin: 'order-paid-abc-admin', customer: 'order-paid-abc-customer' })
  })
})

import { describe, expect, it } from 'vitest';
import { hasOrderManagementAccess, summaryInput } from './order-summary';

describe('order summary privacy and access', () => {
  it('sends order contents but strips customer contact details and identifiers', () => {
    const input = summaryInput({ id: 'private-id', email: 'private@example.com', ship_name: 'Private Customer',
      ship_address1: 'Secret Street', currency: 'USD', total: '165.29', shipping: 0, country: 'US',
      items: [{ name: '(Ret) - GLP3R (Standard Pen)', variant: '20mg', qty: 1, price: '165.29' }] });
    expect(input).toEqual({ currency: 'USD', total: 165.29, shipping: 0, country: 'US',
      items: [{ name: '(Ret) - GLP3R (Standard Pen)', variant: '20mg', qty: 1, price: 165.29 }] });
  });
  it('only an admin role allows access to all orders', () => {
    expect(hasOrderManagementAccess([{ role: 'admin' }])).toBe(true);
    expect(hasOrderManagementAccess([{ role: 'user' }])).toBe(false);
    expect(hasOrderManagementAccess([])).toBe(false);
  });
});
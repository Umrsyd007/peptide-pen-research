import { z } from 'zod';

export const SummaryOrderSchema = z.object({
  currency: z.string().length(3),
  total: z.coerce.number().nonnegative(),
  shipping: z.coerce.number().nonnegative(),
  country: z.string().max(60),
  items: z.array(z.object({
    name: z.string().max(200), variant: z.string().max(120).nullable(),
    qty: z.number().int().positive(), price: z.coerce.number().nonnegative(),
  })).min(1).max(50),
});

/** Explicit projection keeps contact details and internal identifiers out of AI requests. */
export function summaryInput(raw: unknown) {
  return SummaryOrderSchema.parse(raw);
}

export function hasOrderManagementAccess(roles: { role: string }[]) {
  return roles.some(({ role }) => role === 'admin');
}
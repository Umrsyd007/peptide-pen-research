import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { summarizeNewOrder } from './order-summary.server';

const { generate } = vi.hoisted(() => ({ generate: vi.fn() }));
vi.mock('@lovable.dev/ai-gateway', () => ({ generateResponse: generate, GatewayError: class extends Error {} }));

function database(claimed = true) {
  const saved: Record<string, unknown>[] = [];
  let state = claimed ? 'pending' : 'ready';
  const db = { from: (table: string) => {
    if (table === 'order_items') return { select: () => ({ eq: async () => ({ data: [{ name: 'Pen', variant: '20mg', qty: 1, price: 165.29 }], error: null }) }) };
    return { update: (values: Record<string, unknown>) => {
      const filters: Record<string, unknown> = {};
      const chain = {
        eq: (key: string, value: unknown) => { filters[key] = value; return chain; },
        select: () => chain,
        maybeSingle: async () => {
          if (state !== 'pending') return { data: null, error: null };
          state = 'generating';
          return { data: { currency: 'USD', total: 165.29, shipping: 0, ship_country: 'US' }, error: null };
        },
        then: (resolve: (value: { error: null }) => void) => {
          saved.push(values); state = String(values.ai_summary_status); resolve({ error: null });
        },
      };
      return chain;
    } };
  } } as unknown as SupabaseClient<Database>;
  return { db, saved };
}

beforeEach(() => generate.mockReset());
describe('new order summary lifecycle', () => {
  it('persists AI output once and skips an already claimed order', async () => {
    generate.mockResolvedValue({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: '1 Pen, 20mg, USD 165.29, free shipping to US.' }] }] });
    const { db, saved } = database();
    await summarizeNewOrder(db, 'test-order');
    await summarizeNewOrder(db, 'test-order');
    expect(generate).toHaveBeenCalledTimes(1);
    expect(saved[0]).toMatchObject({ ai_summary_status: 'ready', ai_summary: '1 Pen, 20mg, USD 165.29, free shipping to US.' });
  });
  it('does not fail checkout or replay inference when AI fails', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    generate.mockResolvedValue({ status: 'failed', output: [] });
    const { db, saved } = database();
    const result = await summarizeNewOrder(db, 'test-order');
    expect(result).toBeUndefined();
    await summarizeNewOrder(db, 'test-order');
    expect(generate).toHaveBeenCalledTimes(1);
    expect(saved).toEqual([{ ai_summary_status: 'failed' }]);
    log.mockRestore();
  });
  it('does not call AI for an order already summarized', async () => {
    const { db } = database(false);
    await summarizeNewOrder(db, 'test-order');
    expect(generate).not.toHaveBeenCalled();
  });
});
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'

const send = vi.fn()
vi.mock('@/lib/email-templates/send-email', () => ({ sendTemplateEmail: (...a: unknown[]) => send(...a) }))
import { notifyProductQuestion } from './product-question.server'

function fakeClient(latest?: string) {
  const rows: Record<string, unknown>[] = []
  const query = {
    select: () => query, eq: () => query, order: () => query, limit: () => query,
    maybeSingle: async () => ({ error: null, data: latest ? { status: latest } : null }),
    insert: async (row: Record<string, unknown>) => { rows.push(row); return { error: null } },
  }
  return { client: { from: () => query } as unknown as SupabaseClient, rows }
}
const q = { id: 'inquiry-123', name: 'Check', email: 'check@example.com', message: 'Check' }

describe('inquiry notifications', () => {
  beforeEach(() => send.mockReset())

  it('sends to hello@getpeptidepen.com and records sent', async () => {
    send.mockResolvedValue({ sent: true })
    const { client, rows } = fakeClient()
    await notifyProductQuestion(client, q)
    expect(send).toHaveBeenCalledWith('product-question', 'hello@getpeptidepen.com',
      expect.objectContaining({ idempotencyKey: 'product-question-inquiry-123' }))
    expect(rows[0]?.status).toBe('sent')
  })

  it('records a suppressed recipient without failing', async () => {
    send.mockResolvedValue({ sent: false, reason: 'recipient_suppressed' })
    const { client, rows } = fakeClient()
    await notifyProductQuestion(client, q)
    expect(rows[0]?.status).toBe('suppressed')
  })

  it('records failures', async () => {
    send.mockImplementation(async () => { throw 'boom' })
    const { client, rows } = fakeClient()
    const e = await notifyProductQuestion(client, q).catch((x: Error) => x)
    expect((e as Error).message).toBe('Inquiry notification could not be sent')
    expect(rows[0]?.status).toBe('failed')
  })

  it.each(['sent', 'pending', 'suppressed'])('does not replay an inquiry already %s', async (latest) => {
    const { client } = fakeClient(latest)
    await notifyProductQuestion(client, q)
    expect(send).not.toHaveBeenCalled()
  })

  it('uses a fresh key for a repaired historical inquiry', async () => {
    send.mockResolvedValue({ sent: true })
    const { client } = fakeClient()
    await notifyProductQuestion(client, q, true)
    expect(send).toHaveBeenCalledWith('product-question', 'hello@getpeptidepen.com',
      expect.objectContaining({ idempotencyKey: 'product-question-inquiry-123-recovery-v1' }))
  })
})

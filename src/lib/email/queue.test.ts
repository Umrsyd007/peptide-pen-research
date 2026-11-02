import { describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { queueTransactionalEmail } from './queue.server'
import { notifyProductQuestion } from './product-question.server'

function fakeClient(options: { suppressed?: boolean; used?: boolean; latest?: string } = {}) {
  const rows: Record<string, unknown>[] = []
  const rpc = vi.fn().mockResolvedValue({ error: null })
  const from = vi.fn((table: string) => {
    const query = {
      select: () => query, eq: () => query, order: () => query, limit: () => query,
      maybeSingle: async () => ({ error: null, data: table === 'suppressed_emails'
        ? (options.suppressed ? { id: 'blocked' } : null)
        : table === 'email_unsubscribe_tokens'
          ? { token: 'stored-unsubscribe-token', used_at: options.used ? '2026-11-01' : null }
          : options.latest ? { status: options.latest } : null }),
      insert: async (row: Record<string, unknown>) => { rows.push(row); return { error: null } },
    }
    return query
  })
  return { client: { from, rpc } as unknown as SupabaseClient, rpc, rows }
}

describe('inquiry notifications', () => {
  const input = { templateName: 'product-question', recipientEmail: 'ignored@example.com',
    idempotencyKey: 'product-question-inquiry-123', messageId: 'product-question-inquiry-123',
    templateData: { name: 'Email check', message: 'Inquiry notification test' } }

  it('sends to hello@getpeptidepen.com with the stored unsubscribe token', async () => {
    const { client, rpc } = fakeClient()
    const response = await queueTransactionalEmail(client, input)
    expect(response.ok).toBe(true)
    expect(rpc).toHaveBeenCalledWith('enqueue_email', expect.objectContaining({
      payload: expect.objectContaining({ to: 'hello@getpeptidepen.com',
        unsubscribe_token: 'stored-unsubscribe-token', purpose: 'transactional',
        idempotency_key: 'product-question-inquiry-123' }),
    }))
  })

  it('never queues notifications to a suppressed address', async () => {
    const { client, rpc, rows } = fakeClient({ suppressed: true })
    await queueTransactionalEmail(client, input)
    expect(rpc).not.toHaveBeenCalled()
    expect(rows[0]?.status).toBe('suppressed')
  })

  it('never queues with an already-used unsubscribe token', async () => {
    const { client, rpc } = fakeClient({ used: true })
    await queueTransactionalEmail(client, input)
    expect(rpc).not.toHaveBeenCalled()
  })

  it.each(['sent', 'pending', 'suppressed'])('does not replay an inquiry already %s', async (latest) => {
    const { client, rpc } = fakeClient({ latest })
    await notifyProductQuestion(client, { id: 'inquiry-123', name: 'Check',
      email: 'check@example.com', message: 'Check' })
    expect(rpc).not.toHaveBeenCalled()
  })

  it('uses a fresh message history for a repaired historical inquiry', async () => {
    const { client, rpc } = fakeClient()
    await notifyProductQuestion(client, { id: 'inquiry-123', name: 'Check',
      email: 'check@example.com', message: 'Check' }, true)
    expect(rpc).toHaveBeenCalledWith('enqueue_email', expect.objectContaining({
      payload: expect.objectContaining({ message_id: 'product-question-inquiry-123-recovery-v1',
        idempotency_key: 'product-question-inquiry-123-recovery-v1' }),
    }))
  })
})
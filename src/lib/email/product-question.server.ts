import type { SupabaseClient } from '@supabase/supabase-js'
import { queueTransactionalEmail } from './queue.server'

export async function notifyProductQuestion(supabase: SupabaseClient, question: {
  id: string
  productId?: string | null
  productName?: string | null
  name: string
  email: string
  message: string
}, recovery = false): Promise<Response> {
  // A repaired retry gets its own history so exhausted attempts on the
  // original message cannot immediately dead-letter the corrected payload.
  const messageId = `product-question-${question.id}${recovery ? '-recovery-v1' : ''}`
  const { data: latest, error } = await supabase.from('email_send_log')
    .select('status').eq('message_id', messageId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()
  if (error) throw new Error('Unable to verify inquiry notification status')
  if (latest && ['sent', 'pending', 'suppressed'].includes(latest.status)) {
    return Response.json({ success: false, reason: 'already_processed' })
  }
  const response = await queueTransactionalEmail(supabase, {
    templateName: 'product-question',
    recipientEmail: 'hello@getpeptidepen.com',
    idempotencyKey: messageId,
    messageId,
    templateData: {
      productName: question.productName ?? 'Unknown product',
      productId: question.productId ?? '',
      name: question.name,
      email: question.email,
      message: question.message,
    },
  })
  if (!response.ok) throw new Error('Inquiry notification could not be queued')
  return response
}
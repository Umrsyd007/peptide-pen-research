import type { SupabaseClient } from '@supabase/supabase-js'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const RECIPIENT = 'hello@getpeptidepen.com'
const TEMPLATE = 'product-question'

async function log(supabase: SupabaseClient, messageId: string, status: string, errorMessage?: string) {
  const { error } = await supabase.from('email_send_log').insert({
    message_id: messageId, template_name: TEMPLATE, recipient_email: RECIPIENT,
    status, ...(errorMessage ? { error_message: errorMessage.slice(0, 1000) } : {}),
  })
  if (error) console.error('Failed to record inquiry email status', { code: error.code })
}

export async function notifyProductQuestion(supabase: SupabaseClient, question: {
  id: string
  productId?: string | null
  productName?: string | null
  name: string
  email: string
  message: string
}, recovery = false): Promise<Response> {
  // A repaired retry gets its own history so earlier failures cannot block it.
  const messageId = `product-question-${question.id}${recovery ? '-recovery-v1' : ''}`
  const { data: latest, error } = await supabase.from('email_send_log')
    .select('status').eq('message_id', messageId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()
  if (error) throw new Error('Unable to verify inquiry notification status')
  if (latest && ['sent', 'pending', 'suppressed'].includes(latest.status)) {
    return Response.json({ success: false, reason: 'already_processed' })
  }
  try {
    const result = await sendTemplateEmail(TEMPLATE, RECIPIENT, {
      idempotencyKey: messageId,
      templateData: {
        productName: question.productName ?? 'Unknown product',
        productId: question.productId ?? '',
        name: question.name,
        email: question.email,
        message: question.message,
      },
    })
    if (!result.sent) {
      await log(supabase, messageId, 'suppressed')
      return Response.json({ success: false, reason: 'email_suppressed' })
    }
    await log(supabase, messageId, 'sent')
    return Response.json({ success: true })
  } catch (err) {
    await log(supabase, messageId, 'failed', err instanceof Error ? err.message : String(err))
    throw new Error('Inquiry notification could not be sent')
  }
}

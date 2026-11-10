import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import * as React from 'react'
import { render } from '@react-email/components'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'PeptidePen'
const SENDER_DOMAIN = 'notify.getpeptidepen.com'
const FROM_DOMAIN = 'getpeptidepen.com'

const BodySchema = z.object({
  productId: z.string().max(200).optional().nullable(),
  productName: z.string().max(200).optional().nullable(),
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email').max(255),
  message: z.string().trim().min(1, 'Message is required').max(2000),
})

export const Route = createFileRoute('/api/public/product-question')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceKey) {
          console.error('product-question: missing env')
          return Response.json({ ok: false, error: 'server_config' }, { status: 500 })
        }

        let raw: unknown
        try {
          raw = await request.json()
        } catch {
          return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 })
        }

        const parsed = BodySchema.safeParse(raw)
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: 'invalid_input', issues: parsed.error.issues.map((i) => i.message) },
            { status: 400 },
          )
        }
        const data = parsed.data

        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })

        // 1. Persist the question (source of truth)
        const { data: inserted, error: insertError } = await supabase
          .from('product_questions')
          .insert({
            product_id: data.productId ?? null,
            product_name: data.productName ?? null,
            name: data.name,
            email: data.email,
            message: data.message,
          })
          .select('id')
          .single()

        if (insertError || !inserted) {
          console.error('product-question insert failed', { error: insertError })
          return Response.json({ ok: false, error: 'save_failed' }, { status: 500 })
        }

        // 2. Fire-and-log email notification. Never fail the request on email issues.
        try {
          const template = TEMPLATES['product-question']
          if (!template) throw new Error('template_missing')

          const recipient = template.to || 'hello@getpeptidepen.com'
          const templateData = {
            productName: data.productName ?? 'Unknown product',
            productId: data.productId ?? '',
            name: data.name,
            email: data.email,
            message: data.message,
          }

          const element = React.createElement(template.component, templateData)
          const html = await render(element)
          const plainText = await render(element, { plainText: true })
          const subject =
            typeof template.subject === 'function' ? template.subject(templateData) : template.subject

          const messageId = `product-question-${inserted.id}`

          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: 'product-question',
            recipient_email: recipient,
            status: 'pending',
          })

          const { error: enqueueError } = await supabase.rpc('enqueue_email', {
            queue_name: 'transactional_emails',
            payload: {
              message_id: messageId,
              to: recipient,
              from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
              sender_domain: SENDER_DOMAIN,
              subject,
              html,
              text: plainText,
              purpose: 'transactional',
              label: 'product-question',
              idempotency_key: messageId,
              queued_at: new Date().toISOString(),
            },
          })

          if (enqueueError) {
            console.error('product-question enqueue failed', { error: enqueueError })
            await supabase.from('email_send_log').insert({
              message_id: messageId,
              template_name: 'product-question',
              recipient_email: recipient,
              status: 'failed',
              error_message: 'enqueue failed',
            })
          }
        } catch (err) {
          console.error('product-question email dispatch error', { err })
        }

        return Response.json({ ok: true })
      },
    },
  },
})

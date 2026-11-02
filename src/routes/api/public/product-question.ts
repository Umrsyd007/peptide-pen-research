import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

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
          const { notifyProductQuestion } = await import('@/lib/email/product-question.server')
          await notifyProductQuestion(supabase, { id: inserted.id, ...data })
        } catch (err) {
          console.error('product-question email dispatch error', { err })
        }

        return Response.json({ ok: true })
      },
    },
  },
})

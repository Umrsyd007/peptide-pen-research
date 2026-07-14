## Goal

Replace the `mailto:` submission in the "Ask Us A Question" collapsible with a proper backend flow: store each question in Lovable Cloud AND email `hello@getpeptidepen.com` so you see it immediately.

## User-visible behavior

- User opens the collapsible on a restricted product page, fills name/email/message, clicks Send.
- Inline loading state on the button, then a success message ("Thanks — we'll get back to you within 24 hours."). No mail client opens.
- Errors show inline (validation or server failure) with a retry.

## Backend

1. **New table** `public.product_questions`
   - `id uuid pk`, `product_id text`, `product_name text`, `name text`, `email text`, `message text`, `created_at timestamptz default now()`, `status text default 'new'`
   - Grants: `INSERT` to `anon` + `authenticated` (public form); `SELECT/UPDATE` to `service_role` only.
   - RLS enabled. Single policy: `INSERT` for `anon, authenticated` with a `check` that enforces length limits (name ≤100, email ≤255, message ≤2000, all non-empty). No public SELECT — questions are private.

2. **Email infrastructure**
   - Run `email_domain--setup_email_infra` (queues, send log, suppression, cron).
   - Run `email_domain--scaffold_transactional_email` (send/preview/unsubscribe routes + sample templates).
   - Add a React Email template `src/lib/email-templates/product-question.tsx` — internal notification styled to match brand, subject `New product question: {productName}`, body shows product, name, email, message. Register in `registry.ts`.

3. **Public server route** `src/routes/api/public/product-question.ts` (POST)
   - Zod-validates the body (trim, non-empty, length caps, valid email).
   - Inserts into `product_questions` via the server publishable client (RLS-allowed anon insert).
   - Internally POSTs to `/lovable/email/transactional/send` with service-role auth to send `product-question` to `hello@getpeptidepen.com`, idempotency key `product-question-{row id}`, `templateData: { productName, name, email, message }`.
   - Returns `{ ok: true }` or `{ ok: false, error }`. Email failure does NOT fail the request — the row is already saved; log and return ok.

## Frontend

- Edit `AskUsAQuestion` in `src/routes/products.$productId.tsx`:
  - Replace `mailto` handler with `fetch('/api/public/product-question', { method: 'POST', body: JSON.stringify({ productId, productName, name, email, message }) })`.
  - Add `status: 'idle' | 'sending' | 'sent' | 'error'` state. Disable button while sending. On success, replace form with a thank-you block. On error, show inline message + keep form contents.
  - Client-side validation mirrors server (required, email format, length caps) using simple checks — no new deps.

## Out of scope

- No admin dashboard for viewing questions (you'll see them via email; can add later).
- No Shopify customer sync.
- No changes to any other file.

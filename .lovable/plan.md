# Pre-publish review: Orders page and AI summaries

## What looks good
- Orders page is behind sign-in, and the server re-checks the admin role on every request.
- Order reads use the signed-in person's own permissions; customers can only see their own orders, admins see all.
- Nobody can grant themselves admin: roles can only be read, never written, from the site.
- Summaries receive only products, prices, totals and country — no names, emails or addresses.
- A summary is generated at most once per order, and a failure never fails checkout.

## Issues to fix
1. **Checkout waits for the AI summary (main issue).** After "Continue to payment", the shopper waits for the AI to finish (several seconds, longer if slow) before the payment form appears. Fix: run the summary after the response is sent (background `waitUntil`-style), so payment opens immediately. Pending email stays as is.
2. **No admin yet.** There are 0 admins, so the Orders page shows "no access" for everyone, including you. Fix: after you sign up, I add the admin role to your account only.
3. **Old orders have no summaries.** 16 existing orders are marked "pending" summary and will never get one. Fix: show them as "No summary" instead of "Pending" (no backfill unless you ask, to avoid AI cost).
4. **Order confirmation page lookup** (existing, not new): verify it only returns the minimum needed by order number and no address/email, since 6-digit numbers are guessable. Tighten if needed.

## Verification
- Run summary/order tests, time checkout to the payment form, and sign in as admin to view the Orders page and as a non-admin to confirm access is denied.

## Technical details
- `src/lib/orders.functions.ts`: remove `summarizeNewOrder` from the awaited `Promise.all`; schedule it without blocking the response (Worker-safe background execution).
- Role grant via a one-row insert into `user_roles` for the confirmed user id.
- `orders.tsx`: map `pending` with no `ai_summary_created_at` on orders older than the feature to "No summary".
- Review `getOrderByNumber` select list.

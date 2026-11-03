# Admin Orders Dashboard

A private page at `/admin/orders`, visible only to your admin account, showing live orders from your store in a Shopify-style layout.

## What you will see

1. **Summary cards (top row)** for the chosen period (Today / 7 days / 30 days):
   - Orders (paid), items ordered, revenue, pending checkouts, pending value.
2. **Orders table**
   - Columns: order number, date, customer name, email, items count, total, status (Paid / Pending / Failed / Expired badges).
   - Search by order number, name or email.
   - Status filter tabs: All, Paid, Pending, Failed.
   - Pagination (25 per page), newest first.
3. **Order detail panel** (opens when you click a row)
   - Customer name, email, full shipping address.
   - Each product with size, quantity, price, line total, and order total.
   - Copy-address button.
4. **Admin link** in the account page header, shown only to admins.

Out of scope for now: marking orders shipped / tracking numbers (we can add later).

## Access

- Only users with the `admin` role can open the page; everyone else is sent away.
- I will check whether your account already has the admin role and, if not, add it for the email you sign in with (I'll confirm the email with you first).

## Technical details

- Route: `src/routes/_authenticated/admin.orders.tsx` (inside the existing sign-in gate), `ssr: false`, plus a role check.
- Data via `createServerFn` with `requireSupabaseAuth` in `src/lib/admin-orders.functions.ts`:
  - Verifies admin via `user_roles` through the user's own client (existing `read_own_roles` policy), throws Forbidden otherwise.
  - Reads `orders` + `order_items` through the user's client — existing `admin_read_orders` / `admin_read_order_items` policies already allow admins, so no service-role key and no schema changes needed.
  - Inputs: period, status, search, page; returns rows, totals for cards, and page count.
- Uses existing shadcn Table, Card, Sheet, Badge, Tabs, Input components and `formatMoney`.
- Head metadata with `noindex`.
- Test: small unit test for the summary-card math (revenue only counts paid orders; pending value counts pending only).

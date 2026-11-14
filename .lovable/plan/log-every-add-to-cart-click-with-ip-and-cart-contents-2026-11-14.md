# Log every "Add to Cart" click with IP and cart contents

## What you get
- Every time a shopper clicks "Add to Cart" (and changes or removes cart items), a record is saved in your database before checkout.
- Each record holds: the shopper's full IP address, country, browser/device, an anonymous cart session ID (and their account if they're signed in), the product, size, quantity, price, currency, and a snapshot of the whole cart at that moment.
- A new **Cart activity** tab in the admin orders dashboard lists these events (newest first, searchable by IP, product or session), so you can see carts that never reached checkout.
- When a shopper starts checkout, their order is linked to their cart session so you can follow the whole journey.

## Privacy
- Full IP addresses count as personal data in the UK/EU. The privacy policy page gets a short paragraph saying cart activity and IP addresses are logged for fraud prevention and order support.
- Records older than 90 days are cleared automatically (tell me if you want a different period).
- Only admins can read the log; shoppers cannot see or change other records.

## Technical details
- New table `cart_events` (id, session_id, user_id nullable, event_type add/update/remove, product_id, variant, qty, unit_price, currency, cart_snapshot jsonb, ip, country, user_agent, created_at). Grants: service_role all; authenticated SELECT only via admin policy (`user_roles.role = 'admin'`). No anon access.
- Public server function `logCartEvent` (createServerFn): reads IP from `cf-connecting-ip` / `x-forwarded-for` and country from `cf-ipcountry` on the server (never trusts browser-sent IP), validates input against the local catalog, rate-limits per session, inserts via admin client loaded inside the handler.
- Cart store (`src/stores/cart.ts`) generates a persistent random session ID and calls `logCartEvent` fire-and-forget from addItem/updateQuantity/removeItem; failures never block the cart.
- `orders` gets nullable `cart_session_id`; `createOrder` stores it.
- Daily cleanup via pg_cron deleting rows older than 90 days.
- Admin dashboard: new tab reading `cart_events` through an admin-checked server function.
- Tests: IP taken from server headers, unknown products rejected, non-admins can't read.

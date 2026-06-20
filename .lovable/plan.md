## Goal

Add Google Tag Manager (GT-NC6LQ58D), Google Tag (G-1LLX7CCVZL), and the two Shopify-channel tags (GT-MBG99QWN, GT-WPF72555) across every page, then fire GA4 e-commerce events (`page_view`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`) from the app.

## Approach

Use a single tag-loading layer in `src/routes/__root.tsx` so every route inherits it, plus a tiny `src/lib/analytics.ts` helper that pushes structured events to `window.dataLayer`. No per-route head edits needed.

### 1. Load the Google tags in `__root.tsx`

In the root `head().scripts` array, add:

- One inline bootstrap that creates `window.dataLayer` and the GTM loader snippet for `GT-NC6LQ58D` (primary container).
- One `src` script for `https://www.googletagmanager.com/gtag/js?id=G-1LLX7CCVZL` plus an inline `gtag('config', ...)` for the GA4 measurement ID and the three `GT-*` tag IDs (GT-NC6LQ58D, GT-MBG99QWN, GT-WPF72555). `gtag.js` handles multi-ID configs in one snippet.

In `RootShell`, add the GTM `<noscript><iframe>` fallback at the top of `<body>` (required by GTM).

### 2. Track SPA navigations (`page_view`)

TanStack Router doesn't fire native pageviews on client navigation. In `RootComponent`, subscribe to `router.subscribe('onResolved', ...)` and push a `page_view` event with `page_path`, `page_location`, `page_title` to `dataLayer`. This handles every internal route change.

### 3. E-commerce events helper

Create `src/lib/analytics.ts` exporting typed helpers:

- `trackViewItem(product)` — fire on product detail mount
- `trackAddToCart(product, qty)` — fire from cart store / add-to-cart buttons
- `trackBeginCheckout(cart)` — fire when user clicks checkout
- `trackPurchase(order)` — fire on Shopify checkout return (best-effort; Shopify's own GTM tag is the source of truth)

Each pushes a GA4-shaped `ecommerce` payload (`{ event, ecommerce: { currency, value, items: [...] } }`) to `dataLayer`, with a `dataLayer.push({ ecommerce: null })` reset before each call (GA4 best practice).

### 4. Wire the events

- `src/routes/products.$productId.tsx` → call `trackViewItem` in a `useEffect` on mount.
- `src/stores/cart.ts` (or the add-to-cart button sites) → call `trackAddToCart` when an item is added.
- `src/components/cart-drawer.tsx` → call `trackBeginCheckout` on the checkout button click before opening the Shopify checkout URL.
- `purchase` fires on the Shopify-hosted thank-you page via the Shopify Channel GTM tag — no app code needed; documented in a comment.

### 5. SSR safety

All `window`/`dataLayer` reads are guarded with `typeof window !== 'undefined'`. The `<script>` tags are emitted via TanStack's `head().scripts`, so they render in SSR HTML and fire on first paint.

## Files

- **edit** `src/routes/__root.tsx` — add GTM + gtag loader scripts in `head()`, noscript iframe in `RootShell`, router pageview subscriber in `RootComponent`
- **create** `src/lib/analytics.ts` — dataLayer helpers (`trackViewItem`, `trackAddToCart`, `trackBeginCheckout`, `trackPurchase`)
- **edit** `src/routes/products.$productId.tsx` — `trackViewItem` on mount
- **edit** `src/stores/cart.ts` — `trackAddToCart` on add
- **edit** `src/components/cart-drawer.tsx` — `trackBeginCheckout` on checkout click

## Notes

- IDs hardcoded as constants in `__root.tsx`; easy to swap later.
- No new dependencies.
- Shopify's own GTM-on-checkout handles `purchase`; if you later want app-side purchase tracking we can add a thank-you route handler.

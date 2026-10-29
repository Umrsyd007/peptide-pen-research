# Fix Stripe checkout: switch ui_mode to embedded_page

Stripe's current API rejects `ui_mode: "embedded"` ("no longer supported. Use `embedded_page` instead"), so "Continue to payment" fails with that error on the checkout page.

## Change
1. `src/lib/checkout.functions.ts` — in `createCheckoutSession`, change the session's `ui_mode` from `"embedded"` to `"embedded_page"`.

No other flow changes: order creation, return URL, and the webhook already work.

## Verification
- Re-run the seeded-cart Playwright test: submit the shipping form, confirm the Stripe embedded payment iframe renders with no error.
- Check build log for errors.

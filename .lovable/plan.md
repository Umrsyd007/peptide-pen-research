# Whop payment link for Retatrutide 60mg (UK, pounds)

Same rule as the 20mg link, now for the 60mg variant.

## What shoppers get
- UK delivery, paying in pounds, cart contains only Retatrutide 60mg (any quantity): they get the 60mg Whop link (plan_sFt0ZFYouVjfj).
- Shown in the same places as 20mg: Pay now button on the confirmation page, "Payment link" line in the WhatsApp / text message, Pay now button in the order email.
- Only the order number and item count are shared, no product names, same as 20mg. The link still opens without revealing it came from our site.
- Carts that mix 20mg and 60mg, or include other products, get no automatic link (handled by hand as before), since each Whop link is for one variant.
- 20mg orders are unchanged.

## Technical details
- The 60mg link is already saved in `src/lib/store-contact.ts`.
- `src/lib/payment-link.ts`: `getPaymentLink` returns the 20mg link if every item is Retatrutide 20mg, the 60mg link if every item is 60mg, otherwise null.
- `src/lib/payment-link.test.ts`: add tests for UK+GBP 60mg returning the 60mg link, 60mg in USD returning null, 60mg shipped outside the UK returning null, mixed 20mg+60mg returning null.
- Confirmation page, message and email already call `getPaymentLink`, so no other changes.

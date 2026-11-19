# Remove payment-link emails

Note: emails already delivered (Ian, Becky, and your copies) can't be recalled from inboxes. This stops them going out again.

## What changes
1. Delete the "Payment Link" email (the one with the Pay now button) and the "Payment Link Reminder" email so they can never be sent again.
2. Remove the Pay now link from the automatic customer "order received" email, so no customer email contains the Whop link.
3. Keep the order-received email itself (order number, item count, total) — just without the link.
4. Leave the Pay now button on the order confirmation page as is (not an email, so no spam impact). Say if you want that removed too.

## Technical details
- Delete `src/lib/email-templates/payment-link.tsx` and `payment-link-reminder.tsx`; drop both from `registry.ts`.
- `order-paid.server.ts`: stop computing/passing `paymentLink` to the customer email.
- `order-received.tsx`: remove `<PayButton>`; update related tests.

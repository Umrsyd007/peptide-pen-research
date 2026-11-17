# Whop payment link for UK 20mg orders + hide product names from shoppers

## Who gets the payment link
An order qualifies when all of these are true:
- Delivery country is the United Kingdom
- Paid in pounds (GBP)
- The only product in the cart is (Ret) - GLP3R (Standard Pen) **20mg** (any quantity)
- Any payment option (WhatsApp, card, bank, USDT)

Link: https://whop.com/checkout/plan_88k7Fcp3yNQYy

## Where the link shows up (for qualifying orders)
- **Order confirmation page:** a "Pay now" button that opens the link, placed above the WhatsApp card.
- **Pre-filled WhatsApp / text message:** includes "Payment link: <link>".
- **"Order received" email to the customer:** a "Pay now" button with the link, sent automatically when the order is placed.
- Orders that don't qualify keep working as they do now. You send their payment details manually.

## Product names hidden from shoppers
On the WhatsApp/text message, both customer emails ("Order received" and "Payment confirmed") and the confirmation page, shoppers see only:
- Order number (for example #482913)
- Number of items and total amount (for example "1 item · £123.00")

Product names and sizes are removed from these. Your own admin emails and the admin dashboard keep full product details so you know what to ship.

## Technical details
- `src/lib/store-contact.ts`: add `WHOP_LINK_GBP_20MG`.
- New pure helper `getPaymentLink(order)` in `src/lib/payment-link.ts` (country UK/GB, currency GBP, every item productId = Retatrutide and variant "20mg"). `getPlacedOrder` also returns `product_id`, and `ship_country` is already returned. Tests: qualifying order, USD order, a US address, a mixed cart and a 60mg cart all return the right result.
- `buildOrderMessage`: replace the item lines with `"{n} item(s)"` and add an optional payment-link line. Update its tests.
- `notifyOrderPending` / `notifyOrderPaid`: pass `paymentLink` and `itemCount` to the customer templates. `order-received.tsx` and `order-confirmation.tsx` drop `ItemsTable` and show the item count, total and an optional Pay now button. Admin templates are unchanged.
- `checkout.success.$orderNumber.tsx`: replace the item list with an item count and add the Pay now button when a link applies.

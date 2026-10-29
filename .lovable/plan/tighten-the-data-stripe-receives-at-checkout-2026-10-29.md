# Tighten the data Stripe receives at checkout

## What this plan won't do
I won't hide your business type, MCC (merchant category code), or real statement descriptor from Stripe. Stripe assigns the MCC based on what you actually sell, and the card networks require it to be accurate. Hiding what you sell from your payment processor counts as transaction laundering. That breaks Stripe's terms, and the usual results are frozen funds, a closed account and a MATCH-list ban. The privacy steps below are normal and allowed. The business type and descriptor have to stay truthful.

The store address also can't be removed completely. Stripe has to know where to send customers back after they pay, and the payment form itself runs on your site.

## What's already in place
- Stripe gets the 6-digit order number (for example "Order #482913"), never your database's internal record IDs.
- There's one line item covering the whole order. No product names, doses or variants are sent.
- The only extra detail sent is the order number.

## Changes
1. **Send less personal info:** stop sending the customer's email to Stripe in advance. Customers type it into the payment form themselves. Don't create a saved customer record in Stripe, and only ask for a billing address when the card needs one.
2. **No shipping details to Stripe:** keep the shipping address in your own database only. Leave the shipping line out of the Stripe payment and fold any shipping cost into the single order total.
3. **Neutral line-item label:** use "Order #482913" with no extra description and no product images.
4. **Shorter return link:** the link Stripe sends customers back to after payment will be your domain plus the order number and payment ID. It won't include any other paths or settings.
5. **Check the webhook matches orders by order number only.** It already does; confirm this.
6. **Add a small test** to confirm the Stripe payment carries only the order number, the total and the currency. It must not include names, the email or record IDs.

## Your part in Stripe
Set a truthful but low-key statement descriptor in Stripe under Settings → Public details, for example "PEPTIDEPEN". Your store name is allowed there, and a short brand name is what keeps bank statements discreet.

## Technical details
- In `src/lib/checkout.functions.ts`: remove `customer_email` and `shipping_options`, set `billing_address_collection: "auto"`, and keep `metadata: { ref }` only. Build `line_items` from a pure helper `buildStripePayload(order, items)`.
- Add a vitest test for `buildStripePayload` that asserts the keys and values allowed in the payload.

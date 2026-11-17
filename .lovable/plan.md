# New cart and 4-step checkout (Metatide style)

Customers no longer pay on the site. They place an order, then you send them a payment link by WhatsApp or email.

## What customers will see
1. **Add to cart** opens the cart side panel (like now). It shows items, quantity buttons, Subtotal, "Express Shipping FREE", Total with approximate other currencies, a short note, **Checkout** and **Clear Cart**.
2. **Checkout** opens a "Complete Your Order" window with 4 steps: Contact, Address, Payment, Review.
   - **Contact:** full name, email and WhatsApp/phone number, all required. Errors show as the customer types: name must be at least 2 characters, the email must be a real address format, and the phone must be a valid international number.
   - **Address:** address line 1, line 2 (optional), city, postcode/ZIP and a country picker.
   - **Payment:** Pay via WhatsApp (marked Recommended), Debit/Credit Card (Apple Pay / Google Pay), Bank Transfer, or USDT (Crypto). Each option shows a short note, for example "we'll send you a secure payment link".
   - **Review:** items, a discount code box, totals, contact details, address and payment method, then a green "Ready to Place Order" note and a **Place Order** button.
3. **Order confirmed page:** a big order ID with **Copy Order ID**, the full order summary, and a "What happens next" box for the payment method they chose. If they picked WhatsApp, a chat opens with the order details already filled in. The page also has Call Support, Email Support, Back to Home and Continue Shopping buttons.

## Behind the scenes
- Orders are saved with the phone number and payment method, and the status is "Awaiting payment".
- You get the existing new-order email at hello@getpeptidepen.com, now with the phone number and payment method.
- The customer gets an "Order received, payment link coming" email.
- The Stripe card step is removed from checkout. The Stripe code stays in place but switched off, so it can come back later.
- In the orders dashboard, you can mark an order **Paid** by hand once the customer has paid.

## Details I need from you (placeholders until you send them)
- The WhatsApp number orders should go to
- The support phone number for the Call Support button
- Any discount codes and what each one takes off. Until then, the box will show "Invalid code".
- Bank and USDT details aren't shown on the site. You send them with the payment link.

## Technical details
- Migration: add `phone` and `payment_method` columns to orders, plus a `discount_codes` table (admin-only, checked on the server). Add the "awaiting_payment" status.
- Update `createOrder` so it requires a phone (checked with zod and an E.164-style regex) and a payment method, and applies the discount on the server.
- New `CheckoutDialog` (four steps, using react-hook-form and zod) opened from `cart-drawer.tsx`. The `/checkout` page sends visitors back to the store. The success page `checkout/success/$orderNumber` is rebuilt to read the order through the signed order token.
- Email templates: update the pending/admin email and add an `order-received` customer email.
- Add an admin "Mark paid" action that triggers the existing paid-order emails.
- Add tests for checking phone and email, and for discount totals.

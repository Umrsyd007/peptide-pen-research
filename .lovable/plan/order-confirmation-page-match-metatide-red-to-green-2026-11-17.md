# Order confirmation page: match Metatide, red to green

Only the order confirmation page changes. The rest of the site keeps its red.

## What shoppers will see
1. **Top:** green check icon and green "Order Submitted Successfully!" heading.
2. **Order ID box and Order Summary:** stay as they are now.
3. **Secure Order / Free Shipping / Fast Processing row:** green shield, blue truck and orange clock icons, like Metatide's.
4. **"Opening WhatsApp…" box:** light green box with a spinning green circle on the left, green title, the text "Opening WhatsApp with your order details pre-filled. If it doesn't open, use the button." and a green **Open WhatsApp chat** button. On phones, the "Send by text message" button stays as a white button with a green outline.
5. **"Complete Your Payment" heading:** centred, with a card emoji.
6. **Payment box (light purple, like Metatide's), with content for the method the shopper picked:**
   - **Card:** "Secure Card Payment · Payment link will be sent separately", then the coloured "We accept" logos (VISA, Mastercard, AMEX, Apple Pay, G Pay), a "Secure Payment Link Coming Soon" box ("You will receive a **separate email** with a secure payment link within the next few minutes."), and the 4-step "What happens next" list in purple.
   - **WhatsApp, Bank Transfer and USDT:** the same layout with that method's title and steps, without the card logos.
   - **Bottom:** a pale yellow note: "If you don't receive the payment link within 10 minutes, please check your spam folder or contact us via email."
7. **Buttons:** Call Support (white), **Email Support** (dark navy, not red), Back to Home, and Continue Shopping.
8. **New trust strip:** "Trusted by researchers worldwide", with green ticks next to Free Worldwide Shipping, 24/7 Customer Support and 99%+ Purity Guaranteed.

I'm leaving out Metatide's certification row (cGMP and ISO numbers). I won't claim certifications unless you confirm you hold them.

## Technical details
- Add `--payment` / `--payment-soft` (purple) and `--warning` / `--warning-soft` (amber) oklch tokens to `src/styles.css`, mapped in `@theme inline`. Reuse the existing `success*` and `info*` tokens and the `brand-*` badge colours.
- Rewrite only the markup and classes in `src/routes/checkout.success.$orderNumber.tsx`. The WhatsApp auto-open, SMS fallback, order fetch and head metadata stay the same.
- Move the "We accept" badge row out of `checkout-dialog.tsx` into a small shared component, so checkout and the confirmation page show the same logos.

# Open WhatsApp after every order (any payment method)

## What changes for shoppers
- Whichever payment option they pick (WhatsApp, Card / Apple Pay / Google Pay, Bank Transfer, USDT), pressing **Confirm Order** saves the order and then opens WhatsApp to **+1 630 605 7613** with the order pre-filled.
- The confirmation page shows the green "Opening WhatsApp..." card with an **Open WhatsApp chat** button for every method (fallback if the phone blocks the auto-open), followed by the existing method-specific "Complete Your Payment" steps.
- "Call Support" button appears, using +1 630 605 7613.

## Pre-filled message (matches the Metatide screenshot)
```text
Order PP-XXXXXX
 • 1x (Ret) - GLP3R (Standard Pen) 60mg £xxx.xx
 • ...

Total £xxx.xx
Payment method: Card / Payment Link
____________________
Please send the secure payment link for this order.
```
Last line changes per method:
- WhatsApp: "I'd like to arrange payment for this order."
- Card: "Please send the secure payment link for this order."
- Bank Transfer: "Please send the bank transfer details for this order."
- USDT: "Please send the USDT wallet address and amount for this order."

Amounts use the order's chosen checkout currency.

## Payment step wording
- Card info box keeps "we'll send you a secure payment link", adds "via WhatsApp or email".
- Bank/USDT boxes mention WhatsApp opens to receive details.

## Technical details
- `src/lib/store-contact.ts`: `WHATSAPP_NUMBER = "16306057613"`, `SUPPORT_PHONE = "+1 630 605 7613"`.
- `src/routes/checkout.success.$orderNumber.tsx`: build itemized message from order items for all methods, remove the `method === "whatsapp"` gate on auto-open and the green card.
- Move message building into a small pure helper with a test asserting the per-method closing line and item/total lines.
- Unchanged: order saving, admin pending email, Stripe/paid flow, admin dashboard.

## Auto-open on Confirm and order confirmation page
- Pressing **Confirm Order** saves the order and loads the order confirmation page on the website, which shows the order summary. WhatsApp then opens on its own from that page, for every payment method.

## Shoppers without WhatsApp (text message backup)
- A website can't check whether someone has WhatsApp installed. Phones and browsers keep that private.
- Best workaround: try WhatsApp first. If the page is still on screen about 2.5 seconds later (WhatsApp never opened), show a **"No WhatsApp? Send by text message"** button.
- That button opens the phone's normal Messages app with the same order message, addressed to +1 630 605 7613.
- Both buttons always stay on the confirmation page: "Open WhatsApp chat" and "Send by text message". Shoppers can pick either one any time.
- On a computer, the WhatsApp link opens WhatsApp Web, so the text message button only shows up on phones.
- Technical: watch for `visibilitychange`/`blur` after opening `wa.me`. If neither fires, show the `sms:+16306057613?&body=...` link. This is a best guess, so the manual buttons remain the reliable path.
- Roadmap: add "WhatsApp-for-all-methods checkout + text message fallback" to roadmap.md when building.

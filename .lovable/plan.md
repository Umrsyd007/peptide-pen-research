# Checkout contact step: phone, email check, no discount box

## 1. Remove the discount code box
- Take the "Discount Code" box off the Review step. The order summary shows only the subtotal, the free lines and the total.
- Orders stop accepting discount codes. The earlier discount setup stays behind unused, so nothing breaks and you can turn it back on later.

## 2. Phone Number / WhatsApp Number, for every country
- Rename the field to **"Phone Number / WhatsApp Number \*"**.
- Add a country-code picker next to the number box. It shows the flag, the country and the dialing code (for example 🇺🇸 +1, 🇬🇧 +44, 🇦🇺 +61), covers every country, and has a search box.
- The picker starts on the shopper's own country (we already detect it for currency). Shoppers can change it.
- The customer types only their local number. We check that it's the right length for the chosen country and save it in full international form (for example +447700900123), so it works for calls and WhatsApp.
- On the Address step, the country field starts on the same country, and shoppers can still change it.

## 3. Checking that the email is real
No website can prove an inbox exists without emailing it. Here is what I can add:
- **Typo catch:** if someone types "gmil.com", "gmial.com", "hotmial.com" and similar, the form shows "Did you mean umar@gmail.com?" with a one-tap fix.
- **Domain check:** when the customer moves past the Contact step, the server checks that the email's domain can actually receive mail. Made-up addresses like "abc@asdfgh.com" get blocked with "This email address can't receive mail."
- **Throwaway inboxes blocked:** common disposable addresses (mailinator, 10minutemail and similar) are rejected.
- **What this won't catch:** a real domain with a made-up name, such as "fakeperson123@gmail.com". Only a paid checking service (such as ZeroBounce or Kickbox, which charge per check) or emailing a code can catch that. Every customer also gets an order email right away, which tells you quickly if it bounces.

## Technical details
- `checkout-dialog.tsx`: drop the discount UI/state and `checkDiscountCode`. Add a country-code Select plus a national-number Input, and default both country fields from the existing edge-country lookup.
- Add `libphonenumber-js` to validate and format numbers. `normalizePhone(country, national)` returns E.164 or null. Update `contactSchema` and its tests.
- `src/lib/email-check.ts`: a pure typo-suggestion helper (edit distance against common domains) plus a disposable-domain list, with tests.
- A new `verifyEmailDomain` server fn queries MX/A records through Cloudflare DNS-over-HTTPS (`cloudflare-dns.com/dns-query`), which works on Workers. `createOrder` re-runs the same check server-side. If the DNS lookup fails (network error), the address is allowed through so real customers aren't blocked.
- `createOrder`: ignore and stop accepting `discount_code`, and always set `discount = 0`.

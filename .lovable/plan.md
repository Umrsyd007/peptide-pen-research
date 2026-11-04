# Switch the store to pounds and add a currency picker

## What changes for shoppers
- All prices are set in pounds (£): home page, product pages, cart, checkout, receipts, admin emails and the orders dashboard.
- The "charged in USD" and "≈ local estimate" notes are removed everywhere.
- A small currency picker sits in the header (£ GBP by default, plus $ USD and € EUR). Choosing a currency changes the displayed prices **and** the amount charged at checkout, so the receipt matches.
- Visitors see £ by default. The picker remembers their choice. The site no longer guesses a currency from their location.
- Delivery wording is not changed.

## Pricing assumption (please confirm)
Each current dollar price is converted to pounds once at today's rate and rounded to the nearest whole pound (for example $145 becomes about £108). The pound prices then stay fixed. USD and EUR prices are worked out from the pound price at the latest exchange rate when the shopper checks out. If you'd rather give exact pound prices, send the list and I'll use it.

## Housekeeping
- Correct the saved shipping/currency notes, which are out of date.
- Add tests: GBP is the base price, checkout charges the chosen currency, and receipts show the same currency and total.

## Technical details
- `product-variants.ts`: store prices in GBP (`priceNum` in £, formatted `£`). `getLivePrice` stays the single source for listings.
- New `src/lib/currency.ts`: a `useCurrencyStore` with a persisted `currency` from GBP/USD/EUR, GBP→X rates with a 1-hour cache, and a `useMoney()` formatter. Remove the visitor-country detection (`currency.functions.ts`).
- Header: add a picker component.
- `orders.functions.ts`: accept `currency`, re-price lines on the server from GBP using a server-fetched rate, and store `currency` plus converted amounts on the order. Never trust prices sent by the browser.
- `checkout.functions.ts`: Stripe line items use the order's currency (lowercase). The webhook, emails, success page, admin dashboard and Google purchase event read `order.currency` instead of assuming USD.
- `stores/cart.ts`: show prices in the chosen currency while the cart keeps GBP amounts. Delete `CurrencyNotice` and the conversion notes.
- Update `mem://shipping-currency.md` and add this rule to `AGENTS.md`: the base currency is GBP and the order currency is fixed by the server.
- Record these tasks in `roadmap.md`.

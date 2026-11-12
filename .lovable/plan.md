# Pick the shopper's currency from their location

## What shoppers will see
- On their first visit, prices show in a currency based on where they are:
  - United Kingdom: pounds (£)
  - Eurozone countries (Germany, France, Ireland, Spain, Italy, Netherlands and the rest): euros (€)
  - United States: US dollars ($)
  - Anywhere else: US dollars ($)
  - If their location can't be found: pounds (£)
- The currency picker in the header stays. If a shopper picks a currency, that choice is remembered and always wins over their location.
- Checkout charges the currency shown, as it does now. Receipts and emails match.
- Catalog prices stay set in pounds; dollars and euros use today's exchange rate, worked out at checkout on the server.

## Technical details
- Re-add `src/lib/currency.functions.ts`: `getVisitorCountry` server function that reads the `cf-ipcountry` header.
- `src/lib/currency.ts`: add a pure `currencyForCountry(country)` (GB→GBP, eurozone list→EUR, else USD, null→GBP). In `init()`, if there is no saved manual choice, call `getVisitorCountry`, set the currency without saving it, and load rates. `setCurrency` keeps saving the manual choice.
- No change to `createOrder`: it still converts from GBP on the server.
- Tests in `currency.test.ts` for the country mapping (GB, DE, US, JP, null) and for a saved choice beating location.
- Update `mem://shipping-currency.md` and the `AGENTS.md` currency rule.

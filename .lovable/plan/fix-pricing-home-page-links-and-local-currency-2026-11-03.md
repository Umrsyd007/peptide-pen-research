# Fix pricing, home page links and local currency

## What I found
1. **Two price lists disagree.** Each product has a "list" price and separate size prices. The home page, the catalog's price sorting, Google product info and the AI tools use the list price. The product page and checkout use the size price. Example: (Ret) - GLP3R shows $307.40 (about £229) on the home page but $165.29 on its page and at checkout.
2. **Home page links.** The product cards already open their product pages (I clicked one to check). The large hero pen picture (BPC-157) and the "lab-tested" pen picture lower down are not clickable.
3. **Local currency is guessed from the browser language, not the visitor's country.** A US-English browser in the UK or Germany sees USD, and a plain "English" setting always shows USD. Exchange rates are fetched live, but nothing tells the shopper the price is converted.
4. **Old prices stay in carts.** Items keep the price they had when added, so they don't change when you update prices.

## Fixes
- Use one price everywhere: each product's default size price. The home page, catalog cards and sorting, product page, Google product info, AI tools and cart all read it. Checkout already charges from this list.
- Make the hero and lab pen pictures link to their product pages.
- Detect the visitor's country from the request (the hosting adds a country code), falling back to the browser language. Then convert from USD using the latest rates, refreshed every hour and kept for the visit. Show a small "≈ local estimate, charged in USD" note on the product page and cart.
- When the site loads, refresh prices for items already in carts from the current price list.
- Add tests: list and size prices match, country picks the right currency, and cart prices refresh.

## Technical details
- `src/lib/products.ts`: add `getLivePrice(id)` from the `isDefault` entry in `PRODUCT_VARIANTS`, and derive `Product.price` from it so the two can't drift apart. Update `index.tsx`, `products.index.tsx` (`parsePrice` sort), the `products.$productId.tsx` JSON-LD, and the MCP tools.
- `currency.ts`: a server function reads the `cf-ipcountry` header and maps it to a currency (the region code falls back to `navigator.language`). Cache rates in `sessionStorage` with a 1-hour TTL.
- `stores/cart.ts`: on rehydrate, map items to their current `priceNum` and drop items whose product or size no longer exists.
- Extend `currency.test.ts`; add a `products.test.ts`.

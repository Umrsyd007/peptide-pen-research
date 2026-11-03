# New home page for your needle-free injector business

Replace the current peptide home page with a single-product site for a needle-free injector.

## Ground rules
- Every word on the page is written fresh. Nothing is copied from jetinject.com: no text, no layout and no images of theirs.
- The product gets its own new address, `/products/needle-free-injector`. The old peptide address `/products/08f6ee52` stays "not found" and is never reused.
- Photos: you upload your supplier's photos once they've given you permission. Until then, the page shows a clean illustration.
- Peptide pages and products stay hidden. The peptide guides and old wording are removed from the menus and footer.

## Home page sections
1. Top area with the product name, a one-line promise, the price "from £164", and an "Order now" button
2. Three benefits: needle-free, quick to use, reusable
3. How it works in 3 steps
4. What's in the box
5. The two options side by side: Single £164, 2-pack £230
6. Delivery in 3–7 days, plus the refund policy link
7. Common questions
8. Footer with contact email, refund policy and terms

## Product page
- Same layout as today's product page, with Single (£164) and 2-pack (£230) to choose from, add to cart and checkout
- New orders switch back on, for this product only

## Technical details
- Add one product (`needle-free-injector`) to the catalog, with GBP variants of 164 and 230, and show only that product on the store
- Rewrite `src/routes/index.tsx`, giving it a fresh title and description for search results and link previews
- Strip peptide-only content from the product page (deep dives, dosing) for this product
- Update the sitemap and the store's information files to list only the new product
- Add a test checking that the two prices are exactly £164 and £230

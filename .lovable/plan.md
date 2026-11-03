# Add a genuine new product line

This plan only covers a product you actually source and ship yourself. It does not hide or swap out what the site sells now.

## Conditions (these will not change)
- The new product gets its **own web address** (for example `/products/needle-free-injector`). It will not take over `/products/08f6ee52`.
- It gets its **own prices**, set from what it really costs. They will not mirror the peptide pen variants.
- The text and photos are **yours** (from your supplier or your own photography). Nothing is copied from jetinject.com.
- Existing peptide products stay as they are unless you separately decide to remove them, and if you do, they're removed openly.
- If Stripe asks, you tell them about the new product. I can help draft that note.

## What I need from you
1. Product name, and who makes or supplies it
2. Variants, with real prices in pounds
3. Photos you have the rights to use
4. A short description, what comes in the box, and shipping times

## What I'll build
1. A new product entry with its own variants and prices in pounds
2. A product page at its own address, using your photos and wording
3. A spot on the home page featuring the product
4. A sitemap entry and page title and description for the new page
5. Cart and checkout work as they do today, charging exactly what's shown

## Technical details
- Add the item to `src/lib/products.ts` and `src/lib/product-variants.ts` under a new id
- Reuse the existing product page; upload images as project assets
- Add a test confirming each variant's price

## Goal

Stop the storefront from syncing product visibility against Shopify's live catalog. Freeze the visible list at the 25 products currently live on the storefront **plus** the 9 you specified — 34 in total. PDP behavior stays untouched.

## Final product set (34)

**25 currently live (kept):** BPC-157, AC-Selank-nH2, KPV Peptide (Nasal Spray), Kisspeptin, CJC 1295 no Dac + Ipamorelin, Thymosin Alpha-1, Thymalin, SLU-PP-332, Ipamorelin, Melanotan II, Skin Glow (GHK-Cu), TB 500, BPC-157 + TB-500, Epitalon, Spermidine, MOTS-c, Glutathione NAD+ & Resveratrol, Vitality Complex, Delta-Sleep-Inducing Peptide, HGH Fragment, CJC 1295 (no dac), NAD+ (Nicotinamide), IGF-1LR3, NMN, Curcumin.

**9 added back:** HCG Choriomon (Standard Pen), Sermorelin, PT 141 (Bremelanotide), Tirzepatide (Standard Pen), Semaglutide (Standard Pen), Somatropin HGH, Retatrutide (Standard Pen), Tesamorelin, SS-31 (Elamipretide).

The 8 remaining entries currently in `src/lib/products.ts` (Glutathione + Methylene Blue, Microbiome Test, Melanotan 2 Nasal Spray, Nootropic P21 Nasal Spray, Specialized Wellness Consultation, Personalized Gut Optimization Protocol, DNA Test, 5-Amino-1MQ) are dropped.

## Changes

1. **`src/lib/products.ts`** — Replace the 42-item `PRODUCTS` array with the 34 entries above. Each entry is copied verbatim from the current file (same `name`, `categories`, `price`, `tag`, `image`), just reordered so it's clear which set each came from. `getProduct()` continues to read from this array with no code change.

2. **`src/routes/products.index.tsx`** — Remove the Shopify availability filter so the grid always shows the curated set, no matter what the Shopify catalog reports:
   - Drop the `useAvailableProductIds` import and call.
   - Remove the `if (availableIds) list = list.filter(...)` branch in the `filtered` memo.
   - Simplify the counter to `{filtered.length} of {PRODUCTS.length}`.

3. **Leave in place (no changes):**
   - `src/lib/shopify/catalog.ts` — `useShopifyCatalog` / `useShopifyImageForProduct` still run on cards + PDPs to enrich price/image when a SKU matches; they no longer gate visibility.
   - `src/lib/product-variants.ts`, `product-descriptions.ts`, `product-deep-dives.ts` — untouched. Unreferenced entries are harmless.
   - `src/routes/products.$productId.tsx` and all other PDP code — untouched per your instruction.

## Manual-sync workflow going forward

No auto-pull from Shopify. When you want to add/remove/reorder products, tell me which ones and I'll edit `src/lib/products.ts` by hand — nothing else in the app derives the catalog list from Shopify.

## Result

- `/products` renders exactly these 34 cards; filters/search operate on that set only.
- Homepage sections that read `PRODUCTS` also show only these 34.
- Cards still enrich price/image from Shopify when a SKU matches, otherwise fall back to the local price and bundled image.
- All PDPs unchanged.

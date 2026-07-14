Move the Retatrutide product to the first position in the product catalog.

**What we will change:**
- In `src/lib/products.ts`, the `Retatrutide (Standard Pen)` entry is currently at line 24 (after 11 other products). We will move it to the top of the `PRODUCTS` array so it appears first in the catalog.

**How we will do it:**
1. Reorder the `PRODUCTS` array entries so that the Retatrutide product object is first.
2. Keep all other product entries and their order unchanged.
3. Verify the build compiles and the homepage/product catalog shows Retatrutide first.

**No other files will be modified.**
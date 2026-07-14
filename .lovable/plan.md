## Goal
Make the white photo backgrounds on product images disappear visually across the site, without reprocessing any image files.

## Approach
Add Tailwind's `mix-blend-multiply` utility to every `<img>` that renders a product photo. Because the site's card / tile surfaces are light (`bg-muted/50`, `bg-card`, `bg-background`), `multiply` blends white pixels into the surface — the white "boxes" disappear and the pen/vial shows on the card color. The product artwork itself is unaffected because multiplying non-white pixels by white surface leaves them intact.

## Changes
Add `mix-blend-multiply` to the product `<img>` elements in:

- `src/routes/products.index.tsx` — catalog grid card image (line ~106)
- `src/routes/products.$productId.tsx`
  - Main product hero image (line ~256)
  - Decorative background thumbnail (line ~270)
  - Related-products thumbnails (line ~658)
- `src/routes/index.tsx`
  - Featured product image on the homepage (line ~208)
  - "Fresh from the Lab" product image (line ~360)

No other markup, layout, or logic changes. Cart drawer and Shopify data flow stay as-is (cart thumbnails typically sit on light surfaces too — I'll include cart-drawer if its product thumbnail also shows the white box).

## Technical notes
- Tailwind v4 ships `mix-blend-multiply` out of the box; no config change needed.
- Works only where the surface behind the image is lighter than the product's darkest tones — that matches all current product surfaces on this site (light theme, light muted cards).
- If a dark section ever hosts a product image later, we'd need to either keep that section light or reprocess the image; not in scope here.

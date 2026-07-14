## Changes to `src/routes/products.$productId.tsx`

### 1. Update the unavailable-variant message (line ~376)

Replace:
> "This variant isn't available for purchase right now. Please contact us to order."

With:
> "This product is restricted and unavailable for purchase directly on this site. Please contact us to order."

The `contact us` link stays as a `mailto:hello@getpeptidepen.com` link. Since only the 9 restored products lack a Shopify SKU match, this branch renders exclusively for them — no per-product gating needed.

### 2. Add an "Ask Us A Question" collapsible directly below that message

A native `<details>/<summary>` block styled to match the existing PDP (rounded border, card background, uppercase label, chevron that rotates on open). Inside, a small form with:
- Name (text input, required)
- Email (email input, required)
- Message (textarea, required)
- "Send" button

**Submission approach:** on submit, build a `mailto:hello@getpeptidepen.com` link with the product name in the subject and the name/email/message in the body, then `window.location.href = ...` to open the user's mail client. This keeps it fully client-side — no backend, no new deps, no spam surface. (If you'd rather store submissions in Lovable Cloud or send via an edge function instead, say so and I'll wire that up.)

Placement: inside the same wrapper that currently holds the unavailable-message paragraph, so it only appears when the variant is unavailable (i.e., for the 9 restricted products).

No other files change.
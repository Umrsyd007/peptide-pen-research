## Changes to `src/routes/products.$productId.tsx`

### 1. "Contact us" now opens the dropdown (no mail client)

Replace the `<a href="mailto:...">contact us</a>` in the restricted-message paragraph with a `<button type="button">` styled the same (underline, inherits color). Clicking it calls a handler that:
- Opens the `AskUsAQuestion` dropdown (sets `open = true`)
- Scrolls it into view and focuses the Name input

Since the paragraph and the dropdown are siblings, lift the `open` state up to the parent (or expose an imperative open via a ref) so the paragraph's button can trigger it. Simplest approach: move `open`/`setOpen` and a `nameInputRef` into the parent and pass them into `AskUsAQuestion` as props.

### 2. Rename the dropdown label

Change the `<summary>`/button label from **"Ask Us A Question"** to **"Contact To Order"**. Keep the same styling (uppercase, chevron, hover). Also rename the success message's "Ask another question" link to "Send another message" for consistency.

### 3. Keep everything else the same

- The form fields, POST to `/api/public/product-question`, DB insert, and email notification stay identical.
- Component filename and function name (`AskUsAQuestion`) can stay — internal only, no need to rename.

No other files change.

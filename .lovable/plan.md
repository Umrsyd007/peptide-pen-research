## Add a favicon to Peptide Pen Research

### What I'll do

1. **Generate a favicon image** — a simple, square brand mark that reads well at 16-32px. Style: a stylized peptide pen icon in the site's primary color on a clean background. Save as `public/favicon.png` (512x512).

2. **Wire it into the root route** — in `src/routes/__root.tsx`, update the `links` array in `head()` to reference `/favicon.png`:
   ```ts
   { rel: "icon", type: "image/png", href: "/favicon.png" }
   ```

3. **Remove the default Lovable favicon** — delete `public/favicon.ico` so crawlers / clients that request `/favicon.ico` don't get served the stale default.

### Notes

- Nothing else in `__root.tsx` changes — GTM, gtag, JSON-LD, and `<Outlet />` stay intact.
- No dependencies added.
- If you'd prefer a different icon concept (e.g. a molecule, a droplet, initials "PP"), tell me before I approve and I'll adjust the image prompt.

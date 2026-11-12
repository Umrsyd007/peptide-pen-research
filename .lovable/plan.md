# "How to Use Peptide Pen" video page

## What you get
- New page at **getpeptidepen.com/how-to-use-peptide-pen** — the address for the QR code in the manual.
- Not linked from the menu, footer, or home page; reached by scanning the code (and via Google).
- Shows the how-to video large at the top, mobile-first (most visitors arrive from a phone).
- Below the video: short step-by-step written instructions, a safety/storage note, and a button to the product page.

## Video source: either option
- **YouTube link**: paste a link and the page embeds it.
- **Uploaded file**: the video is stored on the site and plays in a built-in player.
- One setting decides which is used, so you can switch any time by sending me the new link or file in chat.
- Until you send the real video, the page shows a "Video coming soon" placeholder.

## Search optimization
- Page title and description built around "how to use peptide pen".
- One main heading, clear sub-headings for each step, and alt text.
- Structured data Google understands: a video entry (title, description, thumbnail, length) and a step-by-step how-to.
- Self-referencing canonical, social share tags, and an entry in the sitemap so Google finds it even with no menu links.

## Content I need from you
- The YouTube link or the video file.
- The real usage steps from your manual. I won't invent dosing or medical instructions; I'll draft general handling steps (unbox, attach needle, prime, inject, store) and mark them for your review.

## Technical details
- Route `src/routes/how-to-use-peptide-pen.tsx` with head() meta, canonical, og/twitter tags, JSON-LD VideoObject + HowTo.
- Config constant `{ type: "youtube" | "file", src }`; YouTube via privacy-enhanced iframe (youtube-nocookie), file via `<video controls playsinline>` with the file uploaded to asset storage.
- Add URL to `sitemap[.]xml.ts`.

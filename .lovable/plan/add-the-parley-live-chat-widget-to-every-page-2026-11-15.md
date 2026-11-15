# Add the Parley live chat widget to every page

## Note on the file
This site has no `index.html` file. Every page shares one page frame instead, defined in `src/routes/__root.tsx`. That is where the Clarity code already lives. The chat code goes in that same frame, so it loads on every page.

## What changes
- Paste the Parley code unchanged, with the same site key `pk_a2_dm0RqD16PvS1aS-fbufoF`, at the end of the page body in `src/routes/__root.tsx`, just before the closing body tag. It goes in as a plain script with no package installs.
- No other chat or support widget is added. Nothing else changes.

## Check
- Open the site in a test browser and confirm Parley's script loads from chatwithparley.tech.
- Take a screenshot showing the chat button in the corner. If Parley only shows the button on your approved domain, the preview may not show it; I'll tell you if that happens.

## Technical details
- In `RootShell`, add `<script dangerouslySetInnerHTML={{ __html: "<snippet body>" }} />` right after `<Scripts />`, inside `<body>`. The snippet itself appends widget.js to `<head>`, exactly as written.

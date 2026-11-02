# Undo Google cookieless consent mode

Put Google tracking back exactly as it was before the cookieless option was added (right after the Clarity script was installed). Clarity stays as is.

## What changes for visitors
- EU/UK/Swiss visitors: Google sends nothing until they click Accept (previous behavior).
- Everywhere else: Google tracks as before.
- Privacy policy wording goes back to the earlier version.
- Purchase conversion tracking keeps working as before.

## Technical details
Restore these files to their state at commit 3a272fa:
- src/lib/google-tracking.ts
- src/lib/tracking-consent.ts
- src/lib/analytics.ts
- src/routes/checkout.success.$orderNumber.tsx
- src/routes/privacy-policy.tsx
- AGENTS.md (Google measurement rule)

Delete src/lib/cookieless-tracking.test.ts. Remove the cookieless task from roadmap.md and the cookieless note from mem://advertising.md. Run the existing purchase-tracking tests and check the build.

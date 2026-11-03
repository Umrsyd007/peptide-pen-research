# Remove the cookie banner

## What changes
- The cookie banner and the "Cookie settings" link at the bottom of the page are removed from every page.
- Google tracking stays as it is today in the US and other regions where no permission is needed.
- In the EU, UK and Switzerland, visitors can no longer click Accept. Because of that, Google tracking stays off for them. I won't switch it on without their permission, since that breaks Google's rules and privacy laws.
- Microsoft Clarity keeps running for every visitor, as it does now.
- The privacy policy will no longer mention the banner or Cookie settings. Instead it will say that tracking is off in regions where permission is required.

## Technical details
- Remove `<TrackingConsent />` and its import from `src/routes/__root.tsx`, and delete `src/components/tracking-consent.tsx`.
- Keep `src/lib/tracking-consent.ts` (region detection and permission checks) unchanged, so Google stays blocked in regions that need permission.
- Update the paragraph about privacy choices in `src/routes/privacy-policy.tsx`.
- Run the existing tracking tests and check the build.

# Restyle the cookie banner to match the screenshot

## What changes
- The banner gets the look of your screenshot. The heading reads "We value your privacy" in large, bold text.
- The body text reads: "We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies." It is followed by a Privacy policy link.
- Three equal buttons sit in one row (they stack on phones):
  - **Customise** (outlined) opens the Analytics and Advertising checkboxes with a "Save choices" button.
  - **Reject All** (solid dark) turns off optional tracking.
  - **Accept All** (solid dark) turns on all tracking.
- Who sees the banner, what each choice does, and the "Cookie settings" link at the bottom of each page all stay the same.

## Technical details
- Only `src/components/tracking-consent.tsx` changes, in its layout and text. A local `customising` state shows the checkboxes.
- The buttons use the existing design colors (`default` and `outline` variants) instead of fixed hex colors.
- `src/lib/tracking-consent.ts` and the Google behavior stay unchanged.
- Check the banner's look with a browser screenshot set to an EU region.

# Purchase tracking
- [x] Enable limited pre-choice cookieless Google measurement; 12 tests pass and browser checks confirm denied storage, no Google cookies, refusal blocking and acceptance updates. Google receipt remains unverified because collection requests failed in the sandbox; unrelated Clarity script also reports an error.
- [x] Install the confirmed Google tag and supplied purchase event with regional consent and privacy disclosure.
- [x] Return Stripe-confirmed paid totals and avoid duplicate purchase reports; retain checkout and current consent choices.
- [x] Test consent controls in the browser and purchase rules with automated tests and a simulated event.
- [ ] Verify a real test payment, published tracking and Google receipt. Blockers: no test payment performed, not published, and Google Ads account not connected; browser collection requests failed in the sandbox.

# Inquiry notifications
- [x] Repair inquiry emails using shared suppression and unsubscribe handling.
- [x] Test the fix: seven tests passed and a real verification inquiry was logged sent.
- [ ] Confirm published deployment completion. Publishing requested; deployment completion is not yet confirmed.
- [x] Re-trigger the 45 missed inquiry notifications once; all 45 recovery send records are sent.
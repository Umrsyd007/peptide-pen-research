# Purchase tracking
- [x] Install the confirmed Google tag and supplied purchase event with regional consent and privacy disclosure.
- [x] Return Stripe-confirmed paid totals and avoid duplicate purchase reports; retain checkout and current consent choices.
- [x] Test consent controls in the browser and purchase rules with automated tests and a simulated event.
- [ ] Verify a real test payment, published tracking and Google receipt. Blockers: no test payment performed, not published, and Google Ads account not connected; browser collection requests failed in the sandbox.

# Inquiry notifications
- [x] Repair inquiry emails using shared suppression and unsubscribe handling.
- [x] Test the fix: seven tests passed and a real verification inquiry was logged sent.
- [ ] Confirm published deployment completion. Publishing requested; deployment completion is not yet confirmed.
- [x] Re-trigger the 45 missed inquiry notifications once; all 45 recovery send records are sent.
# Pounds and currency picker
- [x] Convert catalog to GBP, remove USD conversion notes.
- [x] Header picker (GBP/USD/EUR) that also sets checkout and receipt currency.

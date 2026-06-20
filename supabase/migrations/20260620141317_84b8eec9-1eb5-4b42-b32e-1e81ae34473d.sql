WITH t AS (
  INSERT INTO email_unsubscribe_tokens (token, email)
  VALUES (encode(gen_random_bytes(32),'hex'), 'umarsyed18@gmail.com')
  ON CONFLICT (email) DO UPDATE SET token = EXCLUDED.token
  RETURNING token
)
SELECT pgmq.send('transactional_emails', jsonb_build_object(
  'message_id', gen_random_uuid()::text,
  'idempotency_key', 'test-' || extract(epoch from now())::text,
  'to', 'umarsyed18@gmail.com',
  'from', 'Peptide Pen <notify@notify.getpeptidepen.com>',
  'sender_domain', 'notify.getpeptidepen.com',
  'subject', 'Test email from notify.getpeptidepen.com',
  'html', '<html><body style="font-family:Arial,sans-serif;padding:24px;background:#fff"><div style="max-width:560px;margin:auto"><h1 style="color:#ea580c;margin:0 0 16px">Peptide Pen — Email infrastructure test</h1><p>Hi Umar,</p><p>This is a test confirming <strong>notify.getpeptidepen.com</strong> is sending correctly via your Lovable Cloud email queue.</p><p>If you received this in your inbox, end-to-end delivery is working.</p><p style="margin-top:24px">— Peptide Pen</p></div></body></html>',
  'text', 'Test email from notify.getpeptidepen.com — delivery is working.',
  'label', 'infra-test',
  'purpose', 'transactional',
  'unsubscribe_token', t.token,
  'queued_at', now()
)) FROM t;
export function paidPurchase(session: { payment_status: string; metadata?: Record<string, string> | null; client_reference_id?: string | null; amount_total: number | null; currency: string | null }) {
  const ref = session.metadata?.["ref"] || session.client_reference_id;
  if (session.payment_status !== "paid" || !ref || !/^\d{6}$/.test(ref) || session.amount_total === null || !session.currency) return null;
  return { transaction_id: ref, value: session.amount_total / 100, currency: session.currency.toUpperCase() };
}
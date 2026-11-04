export function formatMoney(amount: string | number, currencyCode = "GBP") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(n)) return "";
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: currencyCode, minimumFractionDigits: 2 }).format(n);
  } catch {
    return `£${n.toFixed(2)}`;
  }
}

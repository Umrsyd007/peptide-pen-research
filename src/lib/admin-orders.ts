export type SummaryOrder = { status: string; total: number; items: number };

export function summarizeOrders(orders: SummaryOrder[]) {
  let paidOrders = 0, itemsOrdered = 0, revenue = 0, pendingCount = 0, pendingValue = 0;
  for (const o of orders) {
    if (o.status === "paid") {
      paidOrders++;
      itemsOrdered += o.items;
      revenue += o.total;
    } else if (o.status === "pending") {
      pendingCount++;
      pendingValue += o.total;
    }
  }
  const r = (n: number) => Math.round(n * 100) / 100;
  return { paidOrders, itemsOrdered, revenue: r(revenue), pendingCount, pendingValue: r(pendingValue) };
}

export const PERIOD_DAYS = { today: 0, "7d": 7, "30d": 30 } as const;
export type Period = keyof typeof PERIOD_DAYS;

export function periodStart(period: Period, now = new Date()): Date {
  const d = new Date(now);
  if (period === "today") {
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }
  return new Date(d.getTime() - PERIOD_DAYS[period] * 86400000);
}

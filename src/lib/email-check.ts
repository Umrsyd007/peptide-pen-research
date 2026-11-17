// Client-safe email helpers: typo suggestions and disposable-domain detection.
const COMMON = [
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "hotmail.com", "hotmail.co.uk", "outlook.com",
  "live.com", "icloud.com", "me.com", "aol.com", "msn.com", "protonmail.com", "proton.me", "gmx.com",
  "mail.com", "btinternet.com", "sky.com", "comcast.net", "verizon.net", "att.net", "ymail.com",
];

const DISPOSABLE = new Set([
  "mailinator.com", "10minutemail.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com",
  "tempmail.com", "temp-mail.org", "yopmail.com", "trashmail.com", "getnada.com", "dispostable.com",
  "throwawaymail.com", "maildrop.cc", "fakeinbox.com", "mintemail.com", "mohmal.com", "emailondeck.com",
  "tempail.com", "burnermail.io", "spamgourmet.com", "mailnesia.com", "tempr.email", "discard.email",
  "moakt.com", "33mail.com", "inboxkitten.com", "1secmail.com", "tmpmail.org", "minuteinbox.com",
]);

function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)] as number[]);
  for (let j = 1; j <= b.length; j++) d[0]![j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i]![j] = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length]![b.length]!;
}

/** "jo@gmil.com" -> "jo@gmail.com"; null when no likely typo. */
export function suggestEmail(email: string): string | null {
  const m = email.trim().toLowerCase().match(/^([^@\s]+)@([^@\s]+\.[a-z]{2,})$/);
  if (!m) return null;
  const [, user, domain] = m as unknown as [string, string, string];
  if (COMMON.includes(domain)) return null;
  let best: string | null = null, bestD = 3;
  for (const c of COMMON) {
    const dd = distance(domain, c);
    if (dd < bestD) { best = c; bestD = dd; }
  }
  return best && bestD <= 2 ? `${user}@${best}` : null;
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return DISPOSABLE.has(domain);
}

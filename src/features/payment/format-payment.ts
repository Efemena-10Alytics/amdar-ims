const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  NGN: "₦",
};

/** Formats a monetary amount with two decimals and currency symbol (e.g. "£85.00"). */
export function formatPaymentAmount(
  amount: number,
  currency?: string | null,
): string {
  const code = currency?.trim().toUpperCase() || "GBP";
  const symbol = CURRENCY_SYMBOLS[code] ?? `${code} `;
  const formatted = amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}

/** Formats an invoice amount with currency code for summary cards (e.g. "GBP 85"). */
export function formatPaymentCodeAmount(
  amount: number,
  currency?: string | null,
): string {
  const code = currency?.trim().toUpperCase() || "GBP";
  const hasFraction = Math.abs(amount % 1) > Number.EPSILON;
  const formatted = amount.toLocaleString("en-GB", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${code} ${formatted}`;
}

function parseYmdUtc(ymd: string | null | undefined): Date | null {
  const trimmed = ymd?.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats "2026-11-15" as "Sun 15 Nov". */
export function formatBannerDueDate(ymd: string | null | undefined): string {
  const date = parseYmdUtc(ymd);
  if (!date) return ymd ?? "";
  const weekday = date.toLocaleDateString("en-GB", {
    weekday: "short",
    timeZone: "UTC",
  });
  const day = date.toLocaleDateString("en-GB", {
    day: "numeric",
    timeZone: "UTC",
  });
  const month = date.toLocaleDateString("en-GB", {
    month: "short",
    timeZone: "UTC",
  });
  return `${weekday} ${day} ${month}`;
}

/** Formats "2026-02-07" as "February 7, 2026". */
export function formatModalOverdueDate(ymd: string | null | undefined): string {
  const date = parseYmdUtc(ymd);
  if (!date) return ymd ?? "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatInstallmentPlanLabel(installments: number): string {
  if (installments <= 1) return "Full payment plan";
  return `${installments} installment payment plan`;
}

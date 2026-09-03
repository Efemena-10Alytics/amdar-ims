import type {
  ApiInvoice,
  ApiPaymentStats,
  BillingData,
  Installment,
  InstallmentStatus,
  NextPayment,
} from "./types";

function formatDateDisplay(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapInvoiceStatus(
  invoice: ApiInvoice,
  nextInvoiceId: string | number | null | undefined,
): InstallmentStatus {
  if (invoice.status === "paid") return "paid";
  if (invoice.status === "overdue") return "overdue";
  // "upcoming": highlight the one matching next_payment.next_invoice_id as due-soon,
  // matching the original mock data's highlighted-row behaviour.
  if (nextInvoiceId != null && String(invoice.invoice_id) === String(nextInvoiceId)) {
    return "due-soon";
  }
  return "upcoming";
}

/** Best-effort lookup of the next payment's amount by cross-referencing the invoices list,
 * since `payment/user/payment-stats` does not itself return a next-payment amount. */
function resolveNextPaymentAmount(
  stats: ApiPaymentStats,
  invoices: ApiInvoice[],
): number {
  const nextInvoiceId = stats.next_payment?.next_invoice_id;
  if (nextInvoiceId != null) {
    const match = invoices.find(
      (invoice) => String(invoice.invoice_id) === String(nextInvoiceId),
    );
    if (match) return match.amount;
  }
  const remainingInstallments = Math.max(
    stats.payment_plan.installments - stats.payment_history.total_payments_made,
    1,
  );
  return Math.round(stats.financial_summary.total_unpaid / remainingInstallments);
}

export function mapApiInvoicesToSchedule(
  invoices: ApiInvoice[],
  nextInvoiceId: string | number | null | undefined,
): Installment[] {
  return invoices.map((invoice, index) => ({
    id: String(invoice.invoice_id),
    no: index + 1,
    dueDate: formatDateDisplay(invoice.payment_date),
    description: invoice.payment_plan,
    amount: invoice.amount,
    status: mapInvoiceStatus(invoice, nextInvoiceId),
  }));
}

export function mapApiStatsToNextPayment(
  stats: ApiPaymentStats,
  invoices: ApiInvoice[],
): NextPayment {
  const next = stats.next_payment;
  if (!next) {
    return { dueDate: "—", daysUntilDue: 0, installmentLabel: "", amount: 0 };
  }

  return {
    dueDate: formatDateDisplay(next.date),
    daysUntilDue: next.days_until_due,
    installmentLabel: `Installment ${stats.payment_history.total_payments_made + 1} of ${stats.payment_plan.installments}`,
    amount: resolveNextPaymentAmount(stats, invoices),
  };
}

export function mapApiDataToBillingData(
  stats: ApiPaymentStats,
  invoices: ApiInvoice[],
): BillingData {
  const { payment_plan, financial_summary, payment_history } = stats;
  const installmentAmount =
    payment_plan.installments > 0
      ? Math.round(financial_summary.total_amount / payment_plan.installments)
      : financial_summary.total_amount;

  return {
    hasActivePlan: true,
    plan: {
      name: `${payment_plan.installments} Installments Plan`,
      totalAmount: financial_summary.total_amount,
      installmentsCount: payment_plan.installments,
      installmentAmount,
      installmentsPaid: payment_history.total_payments_made,
      startDate: formatDateDisplay(payment_plan.cohort_start_date),
      paymentMethod: "—",
    },
    summary: {
      totalPlanAmount: financial_summary.total_amount,
      totalPaid: financial_summary.total_paid,
      remainingBalance: financial_summary.total_unpaid,
      paymentStatus: financial_summary.total_unpaid <= 0 ? "Complete" : "Active",
    },
    nextPayment: mapApiStatsToNextPayment(stats, invoices),
    schedule: mapApiInvoicesToSchedule(invoices, stats.next_payment?.next_invoice_id),
  };
}

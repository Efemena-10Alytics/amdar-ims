export type InstallmentStatus = "paid" | "due-soon" | "upcoming" | "overdue";

export interface Installment {
  id: string;
  no: number;
  dueDate: string;
  description: string;
  amount: number;
  status: InstallmentStatus;
}

export interface PaymentPlan {
  name: string;
  totalAmount: number;
  installmentsCount: number;
  installmentAmount: number;
  installmentsPaid: number;
  startDate: string;
  paymentMethod: string;
}

export interface BillingSummary {
  totalPlanAmount: number;
  totalPaid: number;
  remainingBalance: number;
  paymentStatus: "Active" | "Complete" | "Nil";
}

export interface NextPayment {
  dueDate: string;
  daysUntilDue: number;
  installmentLabel: string;
  amount: number;
}

export interface BillingData {
  hasActivePlan: boolean;
  plan: PaymentPlan;
  summary: BillingSummary;
  nextPayment: NextPayment;
  schedule: Installment[];
}

export interface ReceiptUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  countryOfResidence: string;
  tag: string;
  statusBadge: string;
}

export interface ReceiptProgramInfo {
  cohort: string;
  program: string;
  previousCohortProgram: string;
  paymentPlan: string;
  status: string;
  programActivated: string;
  createdAt: string;
}

export interface ReceiptFinancialSummary {
  totalAmount: number;
  totalPaid: number;
  outstanding: number;
  currency: string;
  percentPaid: number;
}

export interface ReceiptInvoice {
  installmentLabel: string;
  dueDate: string;
  stripePaymentIntentId: string;
  status: string;
  paidAt: string | null;
  amount: number;
}

export interface Receipt {
  id: string;
  user: ReceiptUserInfo;
  program: ReceiptProgramInfo;
  financial: ReceiptFinancialSummary;
  invoice: ReceiptInvoice;
}

/* ------------------------------------------------------------------ */
/* Live API types — payment/user/invoices, payment/user/payment-stats,
 * payment/user/payment-plans/{id}/grace-period-date-bounds, etc.      */
/* ------------------------------------------------------------------ */

export type ApiInvoiceStatus = "upcoming" | "overdue" | "paid";

export interface ApiInvoice {
  invoice_id: string;
  payment_date: string;
  program: string;
  cohort: string;
  amount: number;
  payment_plan: string;
  status: ApiInvoiceStatus;
}

export interface ApiPaymentPlanStats {
  id: string | number;
  installments: number;
  payment_progress: number;
  cohort_start_date: string;
  cohort_name: string;
  cohort_display: string;
  cohort: string;
  program: string;
}

export interface ApiFinancialSummary {
  currency: string;
  total_amount: number;
  total_paid: number;
  total_unpaid: number;
  total_overdue: number;
}

export interface ApiPaymentHistory {
  total_payments_made: number;
  last_payment_date: string;
}

export interface ApiNextPayment {
  next_invoice_id: string | number;
  date: string;
  is_overdue: boolean;
  days_until_due: number;
}

export interface ApiPaymentStats {
  payment_plan: ApiPaymentPlanStats;
  financial_summary: ApiFinancialSummary;
  payment_history: ApiPaymentHistory;
  next_payment: ApiNextPayment | null;
}

export interface GracePeriodDateBounds {
  eligible: boolean;
  reason: string;
  pending_grace_period_exists: boolean;
  min_selectable_date: string;
  max_selectable_date: string;
}

export interface PayNowPayload {
  success_url: string;
  cancel_url: string;
}

export interface PayNowResponse {
  success: boolean;
  data: {
    checkout_session: {
      url: string;
    };
  };
}

export interface SubmitGracePeriodPayload {
  payment_plan_id: string | number;
  reason: string;
  requested_date: string;
}

export interface UpdateSecondInstallmentDatePayload {
  paymentPlanId: string | number;
  next_payment_date: string;
}

/* ------------------------------------------------------------------ */
/* GET /api/payment/user/payment-status                               */
/* ------------------------------------------------------------------ */

export type PaymentStatusState =
  | "active"
  | "due_soon"
  | "due_today"
  | "grace_period"
  | "extension_period"
  | "locked";

export type PaymentLockReason =
  | "no_payment_plan"
  | "cancelled"
  | "refunded"
  | "pending_first_payment"
  | "bad_debt"
  | "grace_period_expired"
  | "extension_expired";

export interface PaymentStatusPlan {
  id: number;
  status: string;
  installments: number;
  currency: string;
  program_activated: boolean;
  program: {
    id: number;
    title: string;
  } | null;
  cohort: {
    id: number;
    name: string;
    start_date: string | null;
  } | null;
}

export interface PaymentStatusInvoice {
  id: number;
  invoice_no: string;
  installment_number: number;
  part_number: number;
  installment_label: string;
  amount: number;
  currency: string;
  due_date: string;
  original_due_date: string;
  status: string;
}

export interface PaymentStatusGracePeriod {
  id: number | null;
  status: "approved" | null;
  requested_date: string | null;
  approved_date: string | null;
  old_due_date: string | null;
  has_pending_request: boolean;
}

export interface PaymentStatusData {
  status: PaymentStatusState;
  can_access_dashboard: boolean;
  show_modal: boolean;
  lock_reason: PaymentLockReason | null;
  deadline_at: string | null;
  seconds_remaining: number | null;
  days_until_due: number | null;
  days_overdue: number;
  grace_period_days: number;
  payment_plan: PaymentStatusPlan | null;
  invoice: PaymentStatusInvoice | null;
  grace_period: PaymentStatusGracePeriod;
}

export interface PaymentStatusResponse {
  success: boolean;
  message?: string;
  data: PaymentStatusData;
}

export interface GetPaymentStatusParams {
  cohort_id?: number | string;
  program_id?: number | string;
  payment_plan_id?: number | string;
}

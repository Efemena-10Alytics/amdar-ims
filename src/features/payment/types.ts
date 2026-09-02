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
  paymentStatus: "Active" | "Complete";
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

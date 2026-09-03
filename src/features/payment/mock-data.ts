import type { BillingData, Receipt } from "./types";

export const mockBillingData: BillingData = {
  hasActivePlan: true,
  plan: {
    name: "10 Installments Plan",
    totalAmount: 6000,
    installmentsCount: 10,
    installmentAmount: 600,
    installmentsPaid: 3,
    startDate: "15 Jan, 2026",
    paymentMethod: "Debit Card",
  },
  summary: {
    totalPlanAmount: 6000,
    totalPaid: 1800,
    remainingBalance: 4200,
    paymentStatus: "Active",
  },
  nextPayment: {
    dueDate: "Aug 15, 2026",
    daysUntilDue: 7,
    installmentLabel: "Installment 4 of 10!",
    amount: 600,
  },
  schedule: [
    { id: "1", no: 1, dueDate: "15 Feb, 2026", description: "Installment 1 of 10", amount: 600, status: "paid" },
    { id: "2", no: 2, dueDate: "15 Apr, 2026", description: "Installment 2 of 10", amount: 600, status: "paid" },
    { id: "3", no: 3, dueDate: "15 Jun, 2026", description: "Installment 3 of 10", amount: 600, status: "paid" },
    { id: "4", no: 4, dueDate: "15 Aug, 2026", description: "Installment 4 of 10", amount: 600, status: "due-soon" },
    { id: "5", no: 5, dueDate: "15 Oct, 2026", description: "Installment 5 of 10", amount: 600, status: "upcoming" },
    { id: "6", no: 6, dueDate: "15 Dec, 2026", description: "Installment 6 of 10", amount: 600, status: "upcoming" },
    { id: "7", no: 7, dueDate: "15 Feb, 2027", description: "Installment 7 of 10", amount: 600, status: "upcoming" },
    { id: "8", no: 8, dueDate: "15 Apr, 2027", description: "Installment 8 of 10", amount: 600, status: "upcoming" },
    { id: "9", no: 9, dueDate: "15 Jun, 2027", description: "Installment 9 of 10", amount: 600, status: "upcoming" },
    { id: "10", no: 10, dueDate: "15 Aug, 2027", description: "Installment 10 of 10", amount: 600, status: "upcoming" },
  ],
};

export const mockEmptyBillingData: BillingData = {
  hasActivePlan: false,
  plan: {
    name: "One-time payment",
    totalAmount: 6000,
    installmentsCount: 1,
    installmentAmount: 6000,
    installmentsPaid: 1,
    startDate: "15 Jan, 2026",
    paymentMethod: "Debit Card",
  },
  summary: {
    totalPlanAmount: 6000,
    totalPaid: 6000,
    remainingBalance: 0,
    paymentStatus: "Complete",
  },
  nextPayment: {
    dueDate: "-",
    daysUntilDue: 0,
    installmentLabel: "",
    amount: 0,
  },
  schedule: [],
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

export function formatCurrency(amount: number, currency?: string): string {
  const symbol = currency ? CURRENCY_SYMBOLS[currency] ?? `${currency} ` : "£";
  return `${symbol}${amount.toLocaleString("en-GB")}`;
}

const RECEIPT_USER = {
  firstName: "Victor Amadi",
  lastName: "Oluikpe",
  email: "oluikpe4real@yahoo.com",
  phone: "7716415265",
  gender: "Male",
  countryOfResidence: "United Kingdom",
  tag: "Amdari",
  statusBadge: "Deferred",
};

const RECEIPT_PROGRAM = {
  cohort: "July Cohort (US/Canada)",
  program: "Project Management Internship",
  previousCohortProgram: "June Cohort/Project Management",
  paymentPlan: `${mockBillingData.plan.installmentsCount} Installments`,
  status: "Ongoing",
  programActivated: "Yes",
  createdAt: "09 Jun 2026, 15:18",
};

export const mockReceipts: Record<string, Receipt> = Object.fromEntries(
  mockBillingData.schedule.map((installment) => {
    const totalAmount = mockBillingData.summary.totalPlanAmount;
    const totalPaid = mockBillingData.summary.totalPaid;
    const outstanding = mockBillingData.summary.remainingBalance;
    const percentPaid =
      totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

    const receipt: Receipt = {
      id: installment.id,
      user: RECEIPT_USER,
      program: RECEIPT_PROGRAM,
      financial: {
        totalAmount,
        totalPaid,
        outstanding,
        currency: "GBP",
        percentPaid,
      },
      invoice: {
        installmentLabel: `Installment #${installment.no}`,
        dueDate: installment.dueDate,
        stripePaymentIntentId: `pi_${installment.id.padStart(6, "0")}TyEaKLK1fELUbbW1aHxQptK`,
        status: installment.status === "paid" ? "Paid" : installment.status,
        paidAt: installment.status === "paid" ? installment.dueDate : null,
        amount: installment.amount,
      },
    };

    return [installment.id, receipt];
  }),
);

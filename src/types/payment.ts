/** Program summary returned in checkout preview */
export interface CheckoutProgram {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  banner_image: string;
  company_name: string;
  about_company: string;
  internship_description: string;
  type: string;
  industry_name: string;
  level: string;
  mentor_count: number;
  intern_title: string;
  overviews: unknown | null;
  tools: unknown | null;
}

/** Single pricing option in checkout */
export interface CheckoutPricing {
  id: number;
  currency: string;
  amount: number;
  original_amount: number;
  discounted_amount: number;
  two_installments_amount: number;
  original_two_installments_amount: number;
  discounted_two_installments_amount: number;
  three_installments_amount: number;
  original_three_installments_amount: number;
  discounted_three_installments_amount: number;
  display_three_installment_breakdown?: number[];
  five_installments_amount?: number;
  original_five_installments_amount?: number;
  discounted_five_installments_amount?: number;
  display_five_installment_breakdown?: number[];
  six_installments_amount?: number;
  original_six_installments_amount?: number;
  discounted_six_installments_amount?: number;
  display_six_installment_breakdown?: number[];
  eight_installments_amount?: number;
  original_eight_installments_amount?: number;
  discounted_eight_installments_amount?: number;
  display_eight_installment_breakdown?: number[];
  nine_installments_amount?: number;
  original_nine_installments_amount?: number;
  discounted_nine_installments_amount?: number;
  display_nine_installment_breakdown?: number[];
  ten_installments_amount?: number;
  original_ten_installments_amount?: number;
  discounted_ten_installments_amount?: number;
  display_ten_installment_breakdown?: number[];
}

/** Upcoming cohort in checkout */
export interface CheckoutCohort {
  id: number;
  name: string;
  month: string;
  year: string;
  start_date: string;
  end_date: string;
  duration: number;
}

/** Promo code result (shape when present; null when no promo applied) */
export type CheckoutPromoCodeData = Record<string, unknown> | null;

/** Checkout preview payload (data field of API response) */
export interface CheckoutData {
  program: CheckoutProgram;
  pricings: CheckoutPricing[];
  promo_code_data: CheckoutPromoCodeData;
  upcoming_cohorts: CheckoutCohort[];
}

/** Full checkout API response */
export interface CheckoutApiResponse {
  success: boolean;
  message: string;
  data: CheckoutData;
}

/** Single installment row for display (e.g. "First payment" / "GBP 250") */
export interface InstallmentBreakdownItem {
  label: string;
  amount: string;
}

/** Split info for the first installment when ?unique=1 flow is active */
export interface SplitFirstPayment {
  payNow: number;
  balance: number;
  deadline: string; // cohort start_date
}

/** Collected checkout selections to pass to Payment / PaymentDetails */
export type CheckoutSelections = {
  cohort: CheckoutCohort;
  planId: "full" | "2-installments" | "3-installments" | "5-installments" | "6-installments" | "8-installments" | "9-installments" | "10-installments";
  currency: string;
  pricing: CheckoutPricing;
  planLabel: string;
  planTotal: string;
  /** First payment amount for display (e.g. "GBP 250"); null for full payment. */
  firstPaymentAmount: string | null;
  /** Per-installment rows for 2- or 3-installment plans; null for full payment. */
  installmentBreakdown: InstallmentBreakdownItem[] | null;
  /** Set when the user splits the 1st installment via the ?unique=1 flow. */
  splitFirstPayment?: SplitFirstPayment | null;
};

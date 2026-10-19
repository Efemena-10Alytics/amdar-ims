/**
 * Referral locales. The `ln` query param on /dashboard/referrals picks one,
 * which drives the currency shown across the page and the bank fields in the
 * withdrawal drawer.
 */

/**
 * - `ng`     — default, Nigerian bank fields
 * - `uk`     — GBP payout, UK fields (sort code, account number)
 * - `uk-out` — GBP sent outside the UK, international fields (IBAN, SWIFT)
 * - `us`     — USD payout, domestic US fields (routing number, account type)
 * - `us-out` — USD sent outside the US, international fields (IBAN, SWIFT)
 * - `cad`    — CAD payout to a Canadian account via Interac
 */
export type ReferralLocale = "ng" | "uk" | "uk-out" | "us" | "us-out" | "cad";

export type ReferralCurrency = "GBP" | "USD";

const CURRENCY_SYMBOLS: Record<ReferralCurrency, string> = {
  GBP: "£",
  USD: "$",
};

const CURRENCY_NUMBER_LOCALE: Record<ReferralCurrency, string> = {
  GBP: "en-GB",
  USD: "en-US",
};

type ReferralLocaleConfig = {
  currency: ReferralCurrency;
  minWithdrawal: number;
  maxWithdrawal: number;
  phone: { flag: string; code: string };
};

export const REFERRAL_LOCALES: Record<ReferralLocale, ReferralLocaleConfig> = {
  ng: {
    currency: "GBP",
    minWithdrawal: 20,
    maxWithdrawal: 1000,
    phone: { flag: "🇳🇬", code: "+234" },
  },
  uk: {
    currency: "GBP",
    minWithdrawal: 20,
    maxWithdrawal: 1000,
    phone: { flag: "🇬🇧", code: "+44" },
  },
  cad: {
    currency: "GBP",
    minWithdrawal: 20,
    maxWithdrawal: 1000,
    phone: { flag: "🇨🇦", code: "+1" },
  },
  "uk-out": {
    currency: "GBP",
    minWithdrawal: 20,
    maxWithdrawal: 1000,
    phone: { flag: "🇬🇧", code: "+44" },
  },
  // The balance itself is held in GBP for every locale — the designs show
  // "£420.00" and "Min. of £20" alongside a Currency selector set to US Dollar.
  // USD is the *payout* currency, chosen in the drawer, not the balance currency.
  us: {
    currency: "GBP",
    minWithdrawal: 20,
    maxWithdrawal: 1000,
    phone: { flag: "🇺🇸", code: "+1" },
  },
  "us-out": {
    currency: "GBP",
    minWithdrawal: 20,
    maxWithdrawal: 1000,
    phone: { flag: "🇺🇸", code: "+1" },
  },
};

/** Anything other than a known locale falls back to the default. */
/** Underscore and hyphen are both accepted, e.g. `uk_out` and `uk-out`. */
export function parseReferralLocale(value: string | null | undefined): ReferralLocale {
  const normalized = value?.trim().toLowerCase().replace(/_/g, "-");
  if (
    normalized === "uk" ||
    normalized === "uk-out" ||
    normalized === "us" ||
    normalized === "us-out" ||
    normalized === "cad"
  ) {
    return normalized;
  }
  return "ng";
}

/** Locales whose withdrawal form uses the shared bank-details drawer. */
export type BankDrawerLocale = Extract<
  ReferralLocale,
  "uk" | "uk-out" | "us" | "us-out" | "cad"
>;

export function usesBankDrawer(locale: ReferralLocale): locale is BankDrawerLocale {
  return locale !== "ng";
}

export function getCurrencySymbol(currency: ReferralCurrency = "GBP"): string {
  return CURRENCY_SYMBOLS[currency];
}

export function formatReferralAmount(
  amount: number,
  currency: ReferralCurrency = "GBP",
): string {
  return `${CURRENCY_SYMBOLS[currency]}${amount.toLocaleString(
    CURRENCY_NUMBER_LOCALE[currency],
  )}`;
}

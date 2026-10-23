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
 * - `uk-usd` — USD payout to a UK account; one of IBAN or SWIFT is supplied
 * - `cad`    — CAD payout to a Canadian account via Interac
 * - `cad-out` — non-CAD payout from Canada; same form as `uk-out`
 */
export type ReferralLocale =
  | "ng"
  | "uk"
  | "uk-out"
  | "us"
  | "uk-usd"
  | "cad"
  | "cad-out";

export type ReferralCurrency = "GBP" | "USD" | "CAD" | "NGN";

const CURRENCY_SYMBOLS: Record<ReferralCurrency, string> = {
  GBP: "£",
  USD: "$",
  CAD: "C$",
  NGN: "₦",
};

const CURRENCY_NUMBER_LOCALE: Record<ReferralCurrency, string> = {
  GBP: "en-GB",
  USD: "en-US",
  CAD: "en-CA",
  NGN: "en-NG",
};

export const CURRENCY_LABELS: Record<ReferralCurrency, string> = {
  GBP: "GBP (£)",
  USD: "USD ($)",
  CAD: "CAD (C$)",
  NGN: "NGN (₦)",
};

/** The four countries offered in the withdrawal drawer, in design order. */
export type ReferralCountry = "canada" | "nigeria" | "united-kingdom" | "united-states";

export const REFERRAL_COUNTRIES: {
  value: ReferralCountry;
  label: string;
  /** Name used to look the flag up in the countries API. */
  apiName: string;
}[] = [
  { value: "canada", label: "Canada", apiName: "Canada" },
  { value: "nigeria", label: "Nigeria", apiName: "Nigeria" },
  { value: "united-kingdom", label: "United Kingdom", apiName: "United Kingdom" },
  { value: "united-states", label: "United State of America", apiName: "United States" },
];

/** Currencies offered per country; the first is the default. */
export const COUNTRY_CURRENCIES: Record<ReferralCountry, ReferralCurrency[]> = {
  canada: ["CAD", "GBP", "USD", "NGN"],
  nigeria: ["NGN"],
  "united-kingdom": ["GBP", "USD"],
  "united-states": ["USD"],
};

/**
 * Country + payout currency decide which withdrawal form is shown. This mirrors
 * the designs: GBP to a UK account is the domestic UK form, GBP to Canada is the
 * international one, and so on.
 */
const SELECTION_TO_LOCALE: Record<string, ReferralLocale> = {
  "united-kingdom:GBP": "uk",
  "united-kingdom:USD": "uk-usd",
  "united-states:USD": "us",
  "canada:CAD": "cad",
  "canada:GBP": "uk-out",
  "canada:USD": "cad-out",
  "canada:NGN": "cad-out",
  "nigeria:NGN": "ng",
};

export function localeFromSelection(
  country: ReferralCountry,
  currency: ReferralCurrency,
): ReferralLocale | null {
  const explicit = SELECTION_TO_LOCALE[`${country}:${currency}`];
  if (explicit) return explicit;

  // GBP to a country without its own dedicated GBP form falls back to the
  // generic "GBP outside the UK" one.
  if (currency === "GBP") return "uk-out";

  return null;
}

/** The country/currency pair a locale represents, for pre-filling the dropdowns. */
export function selectionFromLocale(locale: ReferralLocale): {
  country: ReferralCountry;
  currency: ReferralCurrency;
} {
  const entry = Object.entries(SELECTION_TO_LOCALE).find(([, value]) => value === locale);
  const [country, currency] = (entry?.[0] ?? "united-kingdom:GBP").split(":");
  return {
    country: country as ReferralCountry,
    currency: currency as ReferralCurrency,
  };
}

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
  "cad-out": {
    currency: "GBP",
    minWithdrawal: 20,
    maxWithdrawal: 1000,
    phone: { flag: "🇨🇦", code: "+1" },
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
  "uk-usd": {
    currency: "GBP",
    minWithdrawal: 20,
    maxWithdrawal: 1000,
    phone: { flag: "🇺🇸", code: "+1" },
  },
};

/** Anything other than a known locale falls back to the default. */
/** Underscore and hyphen are both accepted, e.g. `uk_out` and `uk-out`. */
export function parseReferralLocale(value: string | null | undefined): ReferralLocale {
  let normalized = value?.trim().toLowerCase().replace(/_/g, "-");
  // Former name for the UK + USD form.
  if (normalized === "us-out") normalized = "uk-usd";
  if (
    normalized === "uk" ||
    normalized === "uk-out" ||
    normalized === "us" ||
    normalized === "uk-usd" ||
    normalized === "cad" ||
    normalized === "cad-out"
  ) {
    return normalized;
  }
  return "ng";
}

/** Locales whose withdrawal form uses the shared bank-details drawer. */
export type BankDrawerLocale = Extract<
  ReferralLocale,
  "uk" | "uk-out" | "us" | "uk-usd" | "cad" | "cad-out"
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

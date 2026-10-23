"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, Check, ChevronDown, X } from "lucide-react";
import Image from "next/image";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCountries } from "@/features/portfolio/use-countries";
import {
  COUNTRY_CURRENCIES,
  CURRENCY_LABELS,
  formatReferralAmount,
  getCurrencySymbol,
  localeFromSelection,
  REFERRAL_COUNTRIES,
  REFERRAL_LOCALES,
  selectionFromLocale,
  type BankDrawerLocale,
  type ReferralCountry,
  type ReferralCurrency,
  type ReferralLocale,
} from "@/features/referral/locale";
import { SelectOneDropdown } from "./select-one-dropdown";
import { WithdrawalDrawerSkeleton } from "./withdrawal-drawer-skeleton";

const FORM_SWAP_MS = 3000;
import type { WithdrawalProfile } from "@/features/referral/types";
import { BankTransferIcon } from "./icons";

const FIELD_LABEL_CLASS = "mb-1.5 block font-sora text-sm text-[#092A31]";
const FIELD_INPUT_CLASS =
  "h-11 rounded-xl border-transparent bg-[#F6F8FA] px-3 font-sora text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none outline-none focus-visible:border-[#156374] focus-visible:ring-0";
const SELECT_TRIGGER_CLASS =
  "h-11 w-full rounded-xl border-transparent bg-[#F6F8FA] font-sora text-sm text-[#092A31] data-[placeholder]:text-[#94A3B8]";

/** `usa_flag.png` is supplied separately; `us-flag.png` also exists in /public. */
const COUNTRY_FLAG_OVERRIDES: Record<string, string> = {
  "United Kingdom": "/uk-flag.png",
  USA: "/usa_flag.png",
  Canada: "/canada-flag.png",
};

const INTL_ACCOUNT_TYPES = [
  { value: "iban", label: "IBAN / Account number" },
  { value: "swift", label: "SWIFT / BIC code" },
];

const ACCOUNT_TYPES = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
];

/** What differs between the bank forms; everything else is shared. */
type BankFormVariant = "uk" | "us" | "intl" | "cad" | "intl-single" | "gbp-out";

type LocaleConfig = {
  variant: BankFormVariant;
  defaultCountry: string;
  defaultCurrency: string;
  /** Amber notice; `placement` is relative to the "Enter Account Details" heading. */
  warning?: { text: string; placement: "above-heading" | "below-heading" };
  showHomeAddress: boolean;
  swiftPlaceholder?: string;
  accountNumberPlaceholder?: string;
};

const LOCALE_CONFIG: Record<BankDrawerLocale, LocaleConfig> = {
  uk: {
    variant: "uk",
    defaultCountry: "United Kingdom",
    defaultCurrency: "GBP",
    showHomeAddress: false,
    accountNumberPlaceholder: "12345678",
  },
  "uk-out": {
    variant: "gbp-out",
    defaultCountry: "Canada",
    defaultCurrency: "GBP",
    showHomeAddress: false,
  },
  cad: {
    variant: "cad",
    defaultCountry: "Canada",
    defaultCurrency: "CAD",
    showHomeAddress: false,
  },
  us: {
    variant: "us",
    defaultCountry: "USA",
    defaultCurrency: "USD",
    showHomeAddress: true,
  },
  "uk-usd": {
    variant: "intl-single",
    defaultCountry: "United Kingdom",
    defaultCurrency: "USD",
    warning: {
      text: "If you're sending USD to someone outside of the US, you'll be charged extra fees compared to a domestic transaction.",
      placement: "below-heading",
    },
    showHomeAddress: true,
  },
};

type AmountPreset = "min" | "max";

type FormState = {
  amount: string;
  accountCountry: string;
  payoutCurrency: string;
  accountHolder: string;
  sortCode: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
  iban: string;
  swift: string;
  /** UK + USD supplies either an IBAN or a SWIFT code, not both. */
  intlAccountType: string;
  intlAccountValue: string;
  interacEmail: string;
  institutionalNumber: string;
  transitNumber: string;
  homeCountry: string;
  saveDetails: boolean;
};

function initialFormState(locale: BankDrawerLocale): FormState {
  const config = LOCALE_CONFIG[locale];
  return {
    amount: "",
    accountCountry: config.defaultCountry,
    payoutCurrency: config.defaultCurrency,
    accountHolder: "",
    sortCode: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "",
    iban: "",
    swift: "",
    intlAccountType: "",
    intlAccountValue: "",
    interacEmail: "",
    institutionalNumber: "",
    transitNumber: "",
    homeCountry: "",
    saveDetails: false,
  };
}

function FeeWarning({ text }: { text: string }) {
  return (
    <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#FFF8EC] p-3">
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#E4BF7F]" />
      <p className="font-sora text-xs leading-relaxed text-[#8A6D3B]">{text}</p>
    </div>
  );
}

type BankWithdrawalDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: WithdrawalProfile;
  onSuccess: () => void;
  locale: BankDrawerLocale;
  /** Country/currency pick resolves to a different form; the page re-routes. */
  onLocaleChange: (locale: ReferralLocale) => void;
};

export function BankWithdrawalDrawer({
  open,
  onOpenChange,
  profile,
  onSuccess,
  locale,
  onLocaleChange,
}: BankWithdrawalDrawerProps) {
  const config = LOCALE_CONFIG[locale];
  const [form, setForm] = useState<FormState>(() => initialFormState(locale));
  const [preset, setPreset] = useState<AmountPreset | null>(null);
  const [accountTypeOpen, setAccountTypeOpen] = useState(false);
  const { data: countries } = useCountries();

  /**
   * Skeleton while a form is swapped in — on first open and whenever the
   * country/currency pick lands on a different locale. Readiness is derived
   * from the session key rather than reset in an effect, so it flips back to
   * false synchronously and avoids a set-state-in-effect lint error.
   */
  const sessionKey = `${locale}:${open}`;
  const [readyFor, setReadyFor] = useState<string | null>(null);
  const isReady = readyFor === sessionKey;

  useEffect(() => {
    const timeout = setTimeout(() => setReadyFor(sessionKey), FORM_SWAP_MS);
    return () => clearTimeout(timeout);
  }, [sessionKey]);

  const selection = selectionFromLocale(locale);
  const [country, setCountry] = useState<ReferralCountry>(selection.country);
  const [payoutCurrency, setPayoutCurrency] = useState<ReferralCurrency>(
    selection.currency,
  );

  const flagFor = (apiName: string) =>
    COUNTRY_FLAG_OVERRIDES[apiName] ??
    countries?.find((item) => item.name === apiName)?.flag;

  const countryOptions = REFERRAL_COUNTRIES.map((entry) => ({
    value: entry.value,
    label: entry.label,
    icon: flagFor(entry.apiName) ? (
      <Image
        src={flagFor(entry.apiName) as string}
        alt=""
        width={20}
        height={20}
        unoptimized
        className="size-5 shrink-0 rounded-full object-cover"
      />
    ) : undefined,
  }));

  const currencyOptions = COUNTRY_CURRENCIES[country].map((code) => ({
    value: code,
    label: CURRENCY_LABELS[code],
  }));

  /**
   * Switching country assumes that country's default currency and shows the
   * matching form straight away — Canada lands on CAD, for example. The other
   * currencies stay available in the dropdown to switch again from there.
   */
  const handleCountryChange = (next: string) => {
    const nextCountry = next as ReferralCountry;
    const [defaultCurrency] = COUNTRY_CURRENCIES[nextCountry];

    setCountry(nextCountry);
    setPayoutCurrency(defaultCurrency);

    const target = localeFromSelection(nextCountry, defaultCurrency);
    if (target && target !== locale) onLocaleChange(target);
  };

  const handleCurrencyChange = (next: string) => {
    const nextCurrency = next as ReferralCurrency;
    setPayoutCurrency(nextCurrency);
    const target = localeFromSelection(country, nextCurrency);
    if (target && target !== locale) onLocaleChange(target);
  };

  const { currency, minWithdrawal, maxWithdrawal } = REFERRAL_LOCALES[locale];
  const symbol = getCurrencySymbol(currency);

  const accountTypeLabel = ACCOUNT_TYPES.find(
    (type) => type.value === form.accountType,
  )?.label;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setForm(initialFormState(locale));
      setPreset(null);
      setAccountTypeOpen(false);
    }
    onOpenChange(nextOpen);
  };

  const updateField = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const applyPreset = (next: AmountPreset) => {
    setPreset(next);
    const amount =
      next === "min" ? minWithdrawal : Math.min(profile.availableBalance, maxWithdrawal);
    setForm((current) => ({ ...current, amount: amount.toFixed(2) }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleOpenChange(false);
    onSuccess();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col border-l-0 p-0 sm:max-w-xl"
      >
        <div className="shrink-0 border-b border-[#E2EBEF] px-6 pt-5 pb-4">
          <SheetClose className="inline-flex cursor-pointer items-center gap-1.5 font-sora text-sm font-medium text-[#F16B6B]">
            <X className="size-3.5" />
            Close
          </SheetClose>
          <SheetTitle className="mt-1 font-clash-display text-xl text-[#092A31] sm:text-2xl">
            Withdrawal Request
          </SheetTitle>
        </div>

        {!isReady ? (
          <WithdrawalDrawerSkeleton />
        ) : (
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col duration-300 animate-in fade-in-0 slide-in-from-bottom-2"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Who is withdrawing */}
            <div className="flex items-center gap-3 rounded-xl bg-[#156374] px-4 py-3.5 text-white">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 font-sora text-sm font-semibold">
                {profile.initials}
              </span>
              <div className="flex flex-col">
                <span className="font-sora text-sm font-semibold">{profile.name}</span>
                <span className="flex items-center gap-1.5 font-sora text-xs text-[#ACF0C5]">
                  <span className="size-1.5 rounded-full bg-[#4ADE80]" aria-hidden />
                  {profile.status}
                </span>
              </div>
            </div>

            {/* Balance + amount share one control */}
            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-sora text-sm text-[#092A31]">Available Balance</span>
                <label htmlFor="bank-amount" className="font-sora text-sm text-[#092A31]">
                  Withdrawal Amount
                </label>
              </div>

              <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-[#F6F8FA] p-2">
                <span className="flex shrink-0 items-center gap-2 pl-1">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#DBEAFE] text-[#3B82F6]">
                    <BankTransferIcon />
                  </span>
                  <span className="font-sora text-sm font-semibold whitespace-nowrap text-[#092A31]">
                    {formatReferralAmount(profile.availableBalance, currency)}.00
                  </span>
                </span>
                {/* Text, not number — the design shows the symbol inside the field. */}
                <Input
                  id="bank-amount"
                  type="text"
                  inputMode="decimal"
                  value={form.amount ? `${symbol}${form.amount}` : ""}
                  onChange={(event) => {
                    setPreset(null);
                    const digits = event.target.value.replace(/[^0-9.]/g, "");
                    setForm((current) => ({ ...current, amount: digits }));
                  }}
                  placeholder={`${symbol}0.00`}
                  className="h-10 min-w-0 flex-1 rounded-lg border-transparent bg-white text-right font-sora text-sm text-[#092A31] shadow-none focus-visible:border-[#156374] focus-visible:ring-0"
                />
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-sora text-xs text-[#94A3B8]">
                  Min. of {symbol}
                  {minWithdrawal} | Max. of {symbol}
                  {maxWithdrawal}
                </p>
                <div className="flex items-center gap-2">
                  {(["min", "max"] as AmountPreset[]).map((value) => {
                    const isActive = preset === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => applyPreset(value)}
                        className={`flex h-8 items-center gap-1.5 rounded-lg px-3 font-sora text-sm capitalize transition-colors ${
                          isActive ? "bg-[#156374] text-white" : "bg-[#E8EFF1] text-[#64748B]"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`size-2.5 rounded-full border ${
                            isActive ? "border-white bg-[#4ADE80]" : "border-[#94A3B8]"
                          }`}
                        />
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Account country + payout currency */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <span className={FIELD_LABEL_CLASS}>Country</span>
                <SelectOneDropdown
                  title="Country"
                  placeholder="Select country"
                  options={countryOptions}
                  value={country}
                  onChange={handleCountryChange}
                />
              </div>

              <div className="min-w-0">
                <span className={FIELD_LABEL_CLASS}>Currency</span>
                <SelectOneDropdown
                  title="Currency"
                  placeholder="Select currency"
                  options={currencyOptions}
                  value={payoutCurrency}
                  onChange={handleCurrencyChange}
                />
              </div>
            </div>

            {/* Account details */}
            {config.warning?.placement === "above-heading" && (
              <FeeWarning text={config.warning.text} />
            )}

            <h3 className="mt-6 font-sora text-base font-semibold text-[#092A31]">
              Enter Account Details
            </h3>

            {config.warning?.placement === "below-heading" && (
              <FeeWarning text={config.warning.text} />
            )}

            <div className="mt-4">
              <label htmlFor="bank-account-holder" className={FIELD_LABEL_CLASS}>
                Full name of the account holder
              </label>
              <Input
                id="bank-account-holder"
                value={form.accountHolder}
                onChange={updateField("accountHolder")}
                className={FIELD_INPUT_CLASS}
              />
            </div>

            {config.variant === "cad" && (
              <div className="mt-4">
                <label htmlFor="bank-interac-email" className={FIELD_LABEL_CLASS}>
                  Interac registered email
                </label>
                <Input
                  id="bank-interac-email"
                  type="email"
                  value={form.interacEmail}
                  onChange={updateField("interacEmail")}
                  placeholder="example@gmail.com"
                  className={FIELD_INPUT_CLASS}
                />
              </div>
            )}

            {config.variant === "gbp-out" && (
              <>
                <div className="mt-4">
                  <label htmlFor="bank-institutional-number" className={FIELD_LABEL_CLASS}>
                    Institutional number
                  </label>
                  <Input
                    id="bank-institutional-number"
                    inputMode="numeric"
                    value={form.institutionalNumber}
                    onChange={updateField("institutionalNumber")}
                    placeholder="006"
                    className={FIELD_INPUT_CLASS}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="bank-transit-number" className={FIELD_LABEL_CLASS}>
                    Transit number
                  </label>
                  <Input
                    id="bank-transit-number"
                    inputMode="numeric"
                    value={form.transitNumber}
                    onChange={updateField("transitNumber")}
                    placeholder="04841"
                    className={FIELD_INPUT_CLASS}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="bank-cad-account-number" className={FIELD_LABEL_CLASS}>
                    Account number
                  </label>
                  <Input
                    id="bank-cad-account-number"
                    inputMode="numeric"
                    value={form.accountNumber}
                    onChange={updateField("accountNumber")}
                    placeholder="1234567"
                    className={FIELD_INPUT_CLASS}
                  />
                </div>
              </>
            )}

            {config.variant === "uk" && (
              <>
                <div className="mt-4">
                  <label htmlFor="bank-sort-code" className={FIELD_LABEL_CLASS}>
                    UK sort code
                  </label>
                  <Input
                    id="bank-sort-code"
                    inputMode="numeric"
                    value={form.sortCode}
                    onChange={updateField("sortCode")}
                    className={FIELD_INPUT_CLASS}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="bank-account-number" className={FIELD_LABEL_CLASS}>
                    Account number
                  </label>
                  <Input
                    id="bank-account-number"
                    inputMode="numeric"
                    value={form.accountNumber}
                    onChange={updateField("accountNumber")}
                    placeholder={config.accountNumberPlaceholder}
                    className={FIELD_INPUT_CLASS}
                  />
                </div>
              </>
            )}

            {config.variant === "us" && (
              <>
                <div className="mt-4">
                  <label htmlFor="bank-routing-number" className={FIELD_LABEL_CLASS}>
                    Routing number
                  </label>
                  <Input
                    id="bank-routing-number"
                    inputMode="numeric"
                    maxLength={9}
                    value={form.routingNumber}
                    onChange={updateField("routingNumber")}
                    className={FIELD_INPUT_CLASS}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="bank-account-number" className={FIELD_LABEL_CLASS}>
                    Account Number
                  </label>
                  <Input
                    id="bank-account-number"
                    inputMode="numeric"
                    value={form.accountNumber}
                    onChange={updateField("accountNumber")}
                    className={FIELD_INPUT_CLASS}
                  />
                </div>

                <div className="mt-4">
                  <span className={FIELD_LABEL_CLASS}>Account type</span>
                  <Popover open={accountTypeOpen} onOpenChange={setAccountTypeOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex h-11 w-full items-center justify-between rounded-xl bg-[#F6F8FA] px-3 font-sora text-sm"
                      >
                        <span className={accountTypeLabel ? "text-[#092A31]" : "text-[#94A3B8]"}>
                          {accountTypeLabel ?? "Select type"}
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-[#64748B]" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-(--radix-popover-trigger-width) border-[#E2EBEF] p-4"
                    >
                      <p className="font-sora text-base font-semibold text-[#092A31]">
                        Account type
                      </p>
                      <p className="font-sora text-sm text-[#94A3B8]">Select one</p>

                      <div className="mt-3">
                        {ACCOUNT_TYPES.map(({ value, label }) => {
                          const isSelected = form.accountType === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => {
                                setForm((current) => ({ ...current, accountType: value }));
                                setAccountTypeOpen(false);
                              }}
                              className="flex w-full items-center justify-between py-3 text-left"
                            >
                              <span className="font-sora text-sm text-[#092A31]">{label}</span>
                              <span
                                aria-hidden
                                className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                  isSelected
                                    ? "bg-[#C7F5D8] text-[#1F7A4A]"
                                    : "border border-[#DCE5E9] bg-white"
                                }`}
                              >
                                {isSelected && <Check className="size-5" strokeWidth={2.5} />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            {config.variant === "intl-single" && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="min-w-0">
                  <span className={FIELD_LABEL_CLASS}>Account type</span>
                  <SelectOneDropdown
                    title="Account type"
                    placeholder="Select type"
                    options={INTL_ACCOUNT_TYPES}
                    value={form.intlAccountType}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, intlAccountType: value }))
                    }
                  />
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="bank-intl-account" className={FIELD_LABEL_CLASS}>
                    Account number / BIC code
                  </label>
                  <Input
                    id="bank-intl-account"
                    value={form.intlAccountValue}
                    onChange={updateField("intlAccountValue")}
                    placeholder="Enter number"
                    // Stays inert until a type is picked, so it is clear which
                    // of the two numbers is being asked for.
                    disabled={!form.intlAccountType}
                    className={`${FIELD_INPUT_CLASS} disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                </div>
              </div>
            )}

            {config.variant === "intl" && (
              <>
                <div className="mt-4">
                  <label htmlFor="bank-iban" className={FIELD_LABEL_CLASS}>
                    IBAN / Account number
                  </label>
                  <Input
                    id="bank-iban"
                    value={form.iban}
                    onChange={updateField("iban")}
                    className={FIELD_INPUT_CLASS}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="bank-swift" className={FIELD_LABEL_CLASS}>
                    SWIFT / BIC code
                  </label>
                  <Input
                    id="bank-swift"
                    value={form.swift}
                    onChange={updateField("swift")}
                    placeholder={config.swiftPlaceholder}
                    className={FIELD_INPUT_CLASS}
                  />
                </div>
              </>
            )}

            {config.showHomeAddress && (
              <>
                <h3 className="mt-6 font-sora text-base font-semibold text-[#092A31]">
                  Enter their home address
                </h3>

                <div className="mt-3">
                  <span className={FIELD_LABEL_CLASS}>Country</span>
                  <Select
                    value={form.homeCountry}
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, homeCountry: value }))
                    }
                  >
                    <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                      <SelectValue placeholder="Choose a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {(countries ?? []).map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <label className="mt-5 flex items-center gap-2 font-sora text-sm text-[#092A31]">
              <Checkbox
                checked={form.saveDetails}
                onCheckedChange={(checked) =>
                  setForm((current) => ({ ...current, saveDetails: checked === true }))
                }
              />
              Save details?
            </label>
          </div>

          <div className="border-t border-[#E2EBEF] px-6 py-4">
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#156374] font-sora text-base font-semibold text-white transition-colors hover:bg-[#156374]/90"
            >
              Proceed
            </button>
          </div>
        </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, X } from "lucide-react";
import Image from "next/image";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CURRENCY_LABELS,
  formatReferralAmount,
  getCurrencySymbol,
  toAmount,
  toReferralCurrency,
  type ReferralCurrency,
} from "@/features/referral/locale";
import type {
  WithdrawalCountryOption,
  WithdrawalCurrencyOption,
  WithdrawalField,
  WithdrawalQuoteData,
  WithdrawalRecord,
} from "@/features/referral/referral-api.types";
import {
  referralErrorData,
  referralErrorMessage,
  referralErrorStatus,
} from "@/features/referral/referral-api";
import {
  quoteFromConflict,
  usePayoutAccount,
  useSubmitWithdrawal,
  useWithdrawalOptions,
  useWithdrawalQuote,
} from "@/features/referral/use-referral-withdrawal";
import { SelectOneDropdown } from "./select-one-dropdown";
import { WithdrawalDrawerSkeleton } from "./withdrawal-drawer-skeleton";
import { BankTransferIcon } from "./icons";

const FIELD_LABEL_CLASS = "mb-1.5 block font-sora text-sm text-[#092A31]";
const FIELD_INPUT_CLASS =
  "h-11 rounded-xl border-transparent bg-[#F6F8FA] px-3 font-sora text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none outline-none focus-visible:border-[#156374] focus-visible:ring-0";

type AmountPreset = "min" | "max";

function FeeWarning({ text }: { text: string }) {
  return (
    <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#FFF8EC] p-3">
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#E4BF7F]" />
      <p className="font-sora text-xs leading-relaxed text-[#8A6D3B]">{text}</p>
    </div>
  );
}

/** The options payload identifies countries by ISO code, which flagcdn serves. */
function flagUrl(code: string): string {
  return `https://flagcdn.com/${code.trim().toLowerCase()}.svg`;
}

function currencyLabel(code: string): string {
  const normalized = code.trim().toUpperCase();
  return normalized in CURRENCY_LABELS
    ? CURRENCY_LABELS[normalized as ReferralCurrency]
    : normalized;
}

/** Payout amounts can be in currencies we carry no symbol for. */
function formatPayout(amount: string, code: string): string {
  const normalized = code.trim().toUpperCase();
  const value = toAmount(amount).toLocaleString(undefined, { minimumFractionDigits: 2 });
  return normalized in CURRENCY_LABELS
    ? `${getCurrencySymbol(normalized as ReferralCurrency)}${value}`
    : `${value} ${normalized}`;
}

/**
 * A field is shown only when its `required_if` condition holds — that is what
 * splits Canada's Interac route from its bank-account route, for instance.
 */
function isFieldVisible(field: WithdrawalField, values: Record<string, string>): boolean {
  if (!field.required_if) return true;
  return values[field.required_if.field] === field.required_if.value;
}

function isFieldRequired(field: WithdrawalField, values: Record<string, string>): boolean {
  if (field.required) return true;
  return Boolean(field.required_if) && isFieldVisible(field, values);
}

function expiryLabel(expiresAt: string): string {
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export type WithdrawalProfileInfo = {
  name: string;
  initials: string;
  status: string;
};

export function ApiWithdrawalDrawer({
  open,
  onOpenChange,
  profile,
  onSuccess,
  initialCountry = null,
  initialCurrency = null,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: WithdrawalProfileInfo;
  onSuccess: (record: WithdrawalRecord) => void;
  /** ISO country code to preselect, from the `ln` param. */
  initialCountry?: string | null;
  initialCurrency?: string | null;
}) {
  const options = useWithdrawalOptions(open);
  const payoutAccount = usePayoutAccount(open);
  const quoteMutation = useWithdrawalQuote();
  const submitMutation = useSubmitWithdrawal();

  const [countryCode, setCountryCode] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [amount, setAmount] = useState("");
  const [preset, setPreset] = useState<AmountPreset | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  /** null until the box is touched, so a saved account can default it on. */
  const [saveDetails, setSaveDetails] = useState<boolean | null>(null);
  const [quote, setQuote] = useState<WithdrawalQuoteData | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const data = options.data ?? null;
  const countries = data?.countries ?? [];

  // The saved payout account seeds the form as a layer underneath local state
  // rather than being copied into it - no effect, and no state set during render.
  const savedAccount = payoutAccount.account;
  const savedUsable =
    !!savedAccount && countries.some((country) => country.code === savedAccount.country);
  // Either picker being touched drops the saved-account layer: a different
  // country or currency means a different field set entirely.
  const untouched = countryCode === "" && currencyCode === "";

  // Precedence: what the user picked, then the `ln` preselection, then the
  // saved payout account, then whatever the API lists first.
  const selectedCountryCode =
    countryCode || initialCountry || (savedUsable ? savedAccount!.country : "");
  const activeCountry: WithdrawalCountryOption | null =
    countries.find((country) => country.code === selectedCountryCode) ?? countries[0] ?? null;

  const selectedCurrencyCode =
    currencyCode ||
    (untouched ? initialCurrency : null) ||
    (untouched && savedUsable ? savedAccount!.currency : "");
  const activeCurrency: WithdrawalCurrencyOption | null =
    activeCountry?.currencies.find((entry) => entry.currency === selectedCurrencyCode) ??
    activeCountry?.currencies[0] ??
    null;

  // Typed values win; a field edited to empty still overrides the saved one.
  const fieldValues: Record<string, string> = {
    ...(untouched && savedUsable ? savedAccount!.account ?? {} : {}),
    ...values,
  };
  const effectiveSaveDetails = saveDetails ?? savedUsable;

  const walletCurrency = toReferralCurrency(data?.currency);
  const symbol = getCurrencySymbol(walletCurrency);
  const minWithdrawal = toAmount(data?.min_withdrawal);
  const maxWithdrawable = toAmount(data?.max_withdrawable);
  const fields = activeCurrency?.fields ?? [];

  const resetFlow = () => {
    setQuote(null);
    setFormError(null);
    setNotice(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      resetFlow();
      setPreset(null);
    }
    onOpenChange(next);
  };

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    // A new country brings a different field set, so clear what was typed.
    setCurrencyCode("");
    setValues({});
    resetFlow();
  };

  const handleCurrencyChange = (code: string) => {
    setCurrencyCode(code);
    setValues({});
    resetFlow();
  };

  const applyPreset = (next: AmountPreset) => {
    setPreset(next);
    setAmount(String(next === "min" ? minWithdrawal : maxWithdrawable));
    resetFlow();
  };

  const setFieldValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    resetFlow();
  };

  const validate = (): string | null => {
    if (!activeCountry || !activeCurrency) return "Choose a country and payout currency.";

    const requested = toAmount(amount);
    if (!requested) return "Enter an amount to withdraw.";
    if (requested < minWithdrawal) {
      return `The minimum withdrawal is ${formatReferralAmount(minWithdrawal, walletCurrency)}.`;
    }
    if (requested > maxWithdrawable) {
      return `You can withdraw up to ${formatReferralAmount(maxWithdrawable, walletCurrency)}.`;
    }

    const missing = fields.find(
      (field) => isFieldRequired(field, fieldValues) && !fieldValues[field.key]?.trim(),
    );
    return missing ? `${missing.label} is required.` : null;
  };

  /** Step 1: take an official quote so the payout amount can be confirmed. */
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setFormError(problem);
      return;
    }
    setFormError(null);
    setNotice(null);

    try {
      const result = await quoteMutation.mutateAsync({
        amount_gbp: toAmount(amount),
        country: activeCountry!.code,
        payout_currency: activeCurrency!.currency,
      });
      setQuote(result);
    } catch (error) {
      setFormError(referralErrorMessage(error, "Unable to get an exchange rate quote."));
    }
  };

  /** Step 2: submit against the quote token. */
  const handleConfirm = async () => {
    if (!quote || !activeCountry || !activeCurrency) return;
    setFormError(null);
    setNotice(null);

    // Only the fields on show are part of this payout route.
    const account = Object.fromEntries(
      fields
        .filter((field) => isFieldVisible(field, fieldValues))
        .map((field) => [field.key, fieldValues[field.key] ?? ""]),
    );

    try {
      const record = await submitMutation.mutateAsync({
        quote_token: quote.quote_token,
        country: activeCountry.code,
        payout_currency: activeCurrency.currency,
        save_details: effectiveSaveDetails,
        account,
      });
      resetFlow();
      onSuccess(record);
    } catch (error) {
      const status = referralErrorStatus(error);
      const message = referralErrorMessage(error, "Unable to submit your withdrawal request.");

      if (status === 409) {
        // Finance moved the rate; the response carries a fresh quote to confirm.
        const replacement = quoteFromConflict(referralErrorData(error));
        if (replacement) setQuote(replacement);
        setNotice(message);
        return;
      }
      if (status === 422) {
        setQuote(null);
        setNotice(message);
        return;
      }
      setFormError(message);
    }
  };

  const canWithdraw = data?.can_withdraw !== false;
  const isWorking = quoteMutation.isPending || submitMutation.isPending;

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

        {options.isPending ? (
          <WithdrawalDrawerSkeleton />
        ) : options.errorMessage ? (
          <div className="flex-1 px-6 py-6">
            <p className="font-sora text-sm text-[#AA3030]">{options.errorMessage}</p>
            <button
              type="button"
              onClick={() => options.refetch()}
              className="mt-4 h-10 rounded-lg bg-[#E8EFF1] px-4 font-sora text-sm text-[#0C3640]"
            >
              Try again
            </button>
          </div>
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

              {!canWithdraw && (
                <FeeWarning text="Withdrawals are not available on your account yet." />
              )}

              {/* Balance + amount share one control */}
              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-sora text-sm text-[#092A31]">Available Balance</span>
                  <label htmlFor="withdraw-amount" className="font-sora text-sm text-[#092A31]">
                    Withdrawal Amount
                  </label>
                </div>

                <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-[#F6F8FA] p-2">
                  <span className="flex shrink-0 items-center gap-2 pl-1">
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#DBEAFE] text-[#3B82F6]">
                      <BankTransferIcon />
                    </span>
                    <span className="font-sora text-sm font-semibold whitespace-nowrap text-[#092A31]">
                      {formatReferralAmount(
                        toAmount(data?.available_balance),
                        walletCurrency,
                      )}
                    </span>
                  </span>
                  {/* Text, not number — the design shows the symbol inside the field. */}
                  <Input
                    id="withdraw-amount"
                    type="text"
                    inputMode="decimal"
                    value={amount ? `${symbol}${amount}` : ""}
                    onChange={(event) => {
                      setPreset(null);
                      resetFlow();
                      setAmount(event.target.value.replace(/[^0-9.]/g, ""));
                    }}
                    placeholder={`${symbol}0.00`}
                    className="h-10 min-w-0 flex-1 rounded-lg border-transparent bg-white text-right font-sora text-sm text-[#092A31] shadow-none focus-visible:border-[#156374] focus-visible:ring-0"
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-sora text-xs text-[#94A3B8]">
                    Min. of {symbol}
                    {minWithdrawal} | Max. of {symbol}
                    {maxWithdrawable}
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
                    value={activeCountry?.code ?? ""}
                    onChange={handleCountryChange}
                    options={countries.map((country) => ({
                      value: country.code,
                      label: country.name,
                      icon: (
                        <Image
                          src={flagUrl(country.code)}
                          alt=""
                          width={20}
                          height={14}
                          className="h-3.5 w-5 shrink-0 rounded-xs object-cover"
                        />
                      ),
                    }))}
                  />
                </div>

                <div className="min-w-0">
                  <span className={FIELD_LABEL_CLASS}>Currency</span>
                  <SelectOneDropdown
                    title="Currency"
                    placeholder="Select currency"
                    value={activeCurrency?.currency ?? ""}
                    onChange={handleCurrencyChange}
                    options={(activeCountry?.currencies ?? []).map((entry) => ({
                      value: entry.currency,
                      label: currencyLabel(entry.currency),
                    }))}
                  />
                </div>
              </div>

              {/* Account details, from the selected currency's field definitions */}
              <h3 className="mt-6 font-sora text-base font-semibold text-[#092A31]">
                Enter Account Details
              </h3>

              {activeCurrency?.note && <FeeWarning text={activeCurrency.note} />}

              {fields.filter((field) => isFieldVisible(field, fieldValues)).map((field) => (
                <div key={field.key} className="mt-4 min-w-0">
                  {field.type === "select" ? (
                    <>
                      <span className={FIELD_LABEL_CLASS}>{field.label}</span>
                      <SelectOneDropdown
                        title={field.label}
                        placeholder="Select one"
                        value={fieldValues[field.key] ?? ""}
                        onChange={(value) => setFieldValue(field.key, value)}
                        options={Object.entries(field.options ?? {}).map(([value, label]) => ({
                          value,
                          label,
                        }))}
                      />
                    </>
                  ) : (
                    <>
                      <label htmlFor={`field-${field.key}`} className={FIELD_LABEL_CLASS}>
                        {field.label}
                      </label>
                      <Input
                        id={`field-${field.key}`}
                        type={field.type === "email" ? "email" : "text"}
                        inputMode={field.type === "number" ? "numeric" : undefined}
                        value={fieldValues[field.key] ?? ""}
                        onChange={(event) => setFieldValue(field.key, event.target.value)}
                        className={FIELD_INPUT_CLASS}
                      />
                    </>
                  )}
                </div>
              ))}

              <label className="mt-5 flex items-center gap-2 font-sora text-sm text-[#092A31]">
                <Checkbox
                  checked={effectiveSaveDetails}
                  onCheckedChange={(checked) => setSaveDetails(checked === true)}
                />
                Save details?
              </label>

              {/* Quote confirmation */}
              {quote && (
                <div className="mt-5 rounded-xl border border-[#C7F5D8] bg-[#F3FDF7] p-4">
                  <p className="font-sora text-sm font-semibold text-[#092A31]">
                    Confirm your payout
                  </p>
                  <dl className="mt-3 flex flex-col gap-2 font-sora text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-[#64748B]">You withdraw</dt>
                      <dd className="font-semibold text-[#092A31]">
                        {formatReferralAmount(toAmount(quote.amount_gbp), walletCurrency)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-[#64748B]">Exchange rate</dt>
                      <dd className="font-semibold text-[#092A31]">
                        {toAmount(quote.exchange_rate).toLocaleString()}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-[#64748B]">They receive</dt>
                      <dd className="font-semibold text-[#156374]">
                        {formatPayout(quote.payout_amount, quote.payout_currency)}
                      </dd>
                    </div>
                  </dl>
                  {expiryLabel(quote.expires_at) && (
                    <p className="mt-3 font-sora text-xs text-[#64748B]">
                      This rate holds until {expiryLabel(quote.expires_at)}.
                    </p>
                  )}
                </div>
              )}

              {notice && <FeeWarning text={notice} />}

              {formError && (
                <p className="mt-4 font-sora text-sm text-[#AA3030]" role="alert">
                  {formError}
                </p>
              )}
            </div>

            <div className="border-t border-[#E2EBEF] px-6 py-4">
              {quote ? (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isWorking || !canWithdraw}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-[#156374] font-sora text-base font-semibold text-white transition-colors hover:bg-[#156374]/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitMutation.isPending ? "Submitting…" : "Confirm withdrawal"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isWorking || !canWithdraw}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-[#156374] font-sora text-base font-semibold text-white transition-colors hover:bg-[#156374]/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {quoteMutation.isPending ? "Getting rate…" : "Proceed"}
                </button>
              )}
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

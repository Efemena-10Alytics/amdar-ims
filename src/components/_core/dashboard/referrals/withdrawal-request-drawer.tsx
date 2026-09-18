"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatReferralCurrency } from "@/features/referral/mock-data";
import type { WithdrawalProfile } from "@/features/referral/types";
import { BankTransferIcon } from "./icons";

const NIGERIAN_BANKS = [
  "Access Bank",
  "First Bank",
  "GTBank",
  "Opay",
  "Palmpay",
  "UBA",
  "Zenith Bank",
];

const PERCENT_OPTIONS = [25, 50, 75, 100] as const;

const FALLBACK_ACCOUNT_MASKED = "**** **** **** 1234";
const FALLBACK_ACCOUNT_LABEL = "Opay | Ojay Adams";

const FIELD_LABEL_CLASS = "mb-1.5 block font-sora text-sm text-[#092A31]";
const FIELD_INPUT_CLASS =
  "h-11 rounded-xl border border-[#DCE5E9] bg-[#F6F8FA] px-3 font-sora text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none outline-none focus-visible:border-[#156374] focus-visible:ring-0";

type WithdrawalRequestDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: WithdrawalProfile;
  onSuccess: () => void;
};

type WithdrawalStep = "form" | "confirm";

type FormState = {
  amount: string;
  withdrawalMethod: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  email: string;
  phone: string;
  saveDetails: boolean;
  note: string;
};

const INITIAL_FORM_STATE: FormState = {
  amount: "",
  withdrawalMethod: "bank-transfer",
  accountName: "",
  bankName: "",
  accountNumber: "",
  email: "",
  phone: "",
  saveDetails: false,
  note: "",
};

export function WithdrawalRequestDrawer({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: WithdrawalRequestDrawerProps) {
  const [step, setStep] = useState<WithdrawalStep>("form");
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [selectedPercent, setSelectedPercent] = useState<number | null>(null);

  const resetState = () => {
    setStep("form");
    setForm(INITIAL_FORM_STATE);
    setSelectedPercent(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetState();
    onOpenChange(nextOpen);
  };

  const updateField = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const applyPercent = (percent: number) => {
    setSelectedPercent(percent);
    const amount = Math.round((profile.availableBalance * percent) / 100);
    setForm((current) => ({ ...current, amount: String(amount) }));
  };

  const handleProceed = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep("confirm");
  };

  const handleRequestWithdrawal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleOpenChange(false);
    onSuccess();
  };

  const accountMasked = form.accountNumber
    ? `**** **** **** ${form.accountNumber.slice(-4).padStart(4, "0")}`
    : FALLBACK_ACCOUNT_MASKED;
  const accountLabel =
    form.bankName || form.accountName
      ? `${form.bankName || "Opay"} | ${form.accountName || "Ojay Adams"}`
      : FALLBACK_ACCOUNT_LABEL;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" showCloseButton={false} className="flex w-full flex-col border-l-0 p-0 sm:max-w-xl">
        <div className="shrink-0 border-b border-[#E2EBEF] px-6 pt-5 pb-4">
          <SheetClose className="inline-flex cursor-pointer items-center gap-1.5 font-sora text-sm font-medium text-[#F16B6B]">
            <X className="size-3.5" />
            Close
          </SheetClose>
          <SheetTitle className="mt-1 font-clash-display text-xl text-[#092A31] sm:text-2xl">
            Withdrawal Request
          </SheetTitle>
        </div>

        {step === "form" ? (
          <form onSubmit={handleProceed} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-5">
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

              <div className="mt-4">
                <label className={FIELD_LABEL_CLASS}>Available Balance</label>
                <div className="flex h-11 items-center justify-between rounded-xl border border-[#DCE5E9] bg-[#F6F8FA] px-3">
                  <span className="font-sora text-sm text-[#092A31]">
                    {formatReferralCurrency(profile.availableBalance)}
                  </span>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-[#3B82F6]">
                    <BankTransferIcon />
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="withdrawal-amount" className={FIELD_LABEL_CLASS}>
                  Withdrawal Amount
                </label>
                <Input
                  id="withdrawal-amount"
                  type="number"
                  inputMode="decimal"
                  value={form.amount}
                  onChange={(event) => {
                    setSelectedPercent(null);
                    updateField("amount")(event);
                  }}
                  placeholder="Enter amount"
                  className={FIELD_INPUT_CLASS}
                />
                <p className="mt-1.5 font-sora text-xs text-[#94A3B8]">
                  Minimum of £20 | Maximum of £1000
                </p>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {PERCENT_OPTIONS.map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => applyPercent(percent)}
                      className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border font-sora text-sm ${
                        selectedPercent === percent
                          ? "border-[#156374] bg-[#E8EFF1] text-[#156374]"
                          : "border-[#DCE5E9] text-[#64748B]"
                      }`}
                    >
                      <span
                        className={`size-3 rounded-full border ${
                          selectedPercent === percent
                            ? "border-[#156374] bg-[#156374]"
                            : "border-[#94A3B8]"
                        }`}
                        aria-hidden
                      />
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className={FIELD_LABEL_CLASS}>Withdrawal Method</label>
                <Select
                  value={form.withdrawalMethod}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, withdrawalMethod: value }))
                  }
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border-[#DCE5E9] bg-[#F6F8FA] font-sora text-sm text-[#092A31]">
                    <span className="flex items-center gap-2">
                      <BankTransferIcon />
                      <SelectValue />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <label htmlFor="withdrawal-account-name" className={FIELD_LABEL_CLASS}>
                  Account Name
                </label>
                <Input
                  id="withdrawal-account-name"
                  value={form.accountName}
                  onChange={updateField("accountName")}
                  placeholder="Enter name"
                  className={FIELD_INPUT_CLASS}
                />
              </div>

              <div className="mt-4">
                <label className={FIELD_LABEL_CLASS}>Bank Name</label>
                <Select
                  value={form.bankName}
                  onValueChange={(value) => setForm((current) => ({ ...current, bankName: value }))}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border-[#DCE5E9] bg-[#F6F8FA] font-sora text-sm text-[#092A31] data-[placeholder]:text-[#94A3B8]">
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_BANKS.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <label htmlFor="withdrawal-account-number" className={FIELD_LABEL_CLASS}>
                  Account Number
                </label>
                <Input
                  id="withdrawal-account-number"
                  inputMode="numeric"
                  value={form.accountNumber}
                  onChange={updateField("accountNumber")}
                  placeholder="1234 1234 1234 1234"
                  className={FIELD_INPUT_CLASS}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="withdrawal-email" className={FIELD_LABEL_CLASS}>
                  Email Address
                </label>
                <Input
                  id="withdrawal-email"
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  placeholder="example@gmail.com"
                  className={FIELD_INPUT_CLASS}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="withdrawal-phone" className={FIELD_LABEL_CLASS}>
                  Phone Number
                </label>
                <div className="flex h-11 items-center gap-2 rounded-xl border border-[#DCE5E9] bg-[#F6F8FA] pl-3">
                  <span className="flex items-center gap-1 border-r border-[#DCE5E9] pr-2 font-sora text-sm text-[#092A31]">
                    <span aria-hidden>🇳🇬</span>
                    +234
                  </span>
                  <input
                    id="withdrawal-phone"
                    value={form.phone}
                    onChange={updateField("phone")}
                    placeholder="Your phone number"
                    className="h-full w-full bg-transparent pr-3 font-sora text-sm text-[#092A31] placeholder:text-[#94A3B8] outline-none"
                  />
                </div>
              </div>

              <label className="mt-4 flex items-center gap-2 font-sora text-sm text-[#092A31]">
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
        ) : (
          <form onSubmit={handleRequestWithdrawal} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-5">
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

              <div className="mt-4">
                <label className={FIELD_LABEL_CLASS}>Available Balance</label>
                <div className="flex h-11 items-center justify-between rounded-xl border border-[#DCE5E9] bg-[#F6F8FA] px-3">
                  <span className="font-sora text-sm text-[#092A31]">
                    {formatReferralCurrency(profile.availableBalance)}
                  </span>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-[#3B82F6]">
                    <BankTransferIcon />
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="withdrawal-amount-confirm" className={FIELD_LABEL_CLASS}>
                  Withdrawal Amount
                </label>
                <Input
                  id="withdrawal-amount-confirm"
                  type="number"
                  inputMode="decimal"
                  value={form.amount}
                  onChange={(event) => {
                    setSelectedPercent(null);
                    updateField("amount")(event);
                  }}
                  placeholder="Enter amount"
                  className={FIELD_INPUT_CLASS}
                />
                <p className="mt-1.5 font-sora text-xs text-[#94A3B8]">
                  Minimum of £20 | Maximum of £1000
                </p>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {PERCENT_OPTIONS.map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => applyPercent(percent)}
                      className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border font-sora text-sm ${
                        selectedPercent === percent
                          ? "border-[#156374] bg-[#E8EFF1] text-[#156374]"
                          : "border-[#DCE5E9] text-[#64748B]"
                      }`}
                    >
                      <span
                        className={`size-3 rounded-full border ${
                          selectedPercent === percent
                            ? "border-[#156374] bg-[#156374]"
                            : "border-[#94A3B8]"
                        }`}
                        aria-hidden
                      />
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className={FIELD_LABEL_CLASS}>Withdrawal Method</label>
                <div className="flex h-11 items-center justify-between rounded-xl border border-[#DCE5E9] bg-[#F6F8FA] px-3 font-sora text-sm text-[#092A31]">
                  <span className="flex items-center gap-2">
                    <BankTransferIcon />
                    Bank Transfer
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#F6F8FA] px-4 py-3.5">
                <div className="flex flex-col gap-1">
                  <span className="font-sora text-sm font-semibold text-[#092A31]">
                    Account Details
                  </span>
                  <span className="font-sora text-sm text-[#092A31]">{accountMasked}</span>
                  <span className="font-sora text-sm text-[#64748B]">{accountLabel}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="shrink-0 rounded-full border border-[#BFDBFE] bg-white px-3 py-1 font-sora text-xs font-medium text-[#3B82F6]"
                >
                  Change
                </button>
              </div>

              <div className="mt-4">
                <label htmlFor="withdrawal-note" className={FIELD_LABEL_CLASS}>
                  Note (Optional)
                </label>
                <textarea
                  id="withdrawal-note"
                  value={form.note}
                  onChange={updateField("note")}
                  placeholder="Add a note for withdrawal request"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#DCE5E9] bg-[#F6F8FA] px-3 py-3 font-sora text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none outline-none focus-visible:border-[#156374]"
                />
              </div>
            </div>

            <div className="border-t border-[#E2EBEF] px-6 py-4">
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#156374] font-sora text-base font-semibold text-white transition-colors hover:bg-[#156374]/90"
              >
                Request Withdrawal
              </button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

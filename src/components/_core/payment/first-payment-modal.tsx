"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const MIN_AMOUNT = 100;

interface FirstPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstInstallmentTotal: number;
  currency: string;
  cohortStartDate: string;
  onConfirm: (payNow: number) => void;
}

export function FirstPaymentModal({
  open,
  onOpenChange,
  firstInstallmentTotal,
  currency,
  cohortStartDate,
  onConfirm,
}: FirstPaymentModalProps) {
  const [rawInput, setRawInput] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!open) {
      setRawInput("");
      setAgreed(false);
    }
  }, [open]);

  const payNow = rawInput === "" ? NaN : Number(rawInput);
  const isValidAmount =
    !isNaN(payNow) &&
    payNow >= MIN_AMOUNT &&
    payNow < firstInstallmentTotal;
  const balance = isValidAmount ? firstInstallmentTotal - payNow : null;
  const canContinue = isValidAmount && agreed;

  const handleContinue = () => {
    if (!isValidAmount) return;
    onConfirm(payNow);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-clash-display text-xl font-bold text-[#092A31]">
            First Payment Plan
          </DialogTitle>
          <DialogDescription className="text-sm text-[#4a5568]">
            Set how you would like to make your first payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6b7280]">Total amount</span>
            <span className="font-clash-display font-bold text-primary text-lg">
              {currency} {firstInstallmentTotal}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#092A31]">
              Amount you would like to pay now
            </label>
            <div className="relative flex items-center">
              <Input
                type="number"
                min={MIN_AMOUNT}
                max={firstInstallmentTotal - 1}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Enter amount to pay here"
                className="pr-14 h-11"
              />
              <span className="absolute right-3 text-sm font-medium text-[#6b7280] pointer-events-none">
                {currency}
              </span>
            </div>
            <p className="text-xs text-[#6b7280]">
              Min amount: {currency}{MIN_AMOUNT}
            </p>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] p-4 space-y-2.5">
            <p className="text-sm font-semibold text-[#092A31]">
              Balance details
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6b7280]">Balance of 1st installment</span>
              <span className="font-bold text-[#092A31]">
                {balance !== null ? `${currency} ${balance}` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6b7280]">Deadline</span>
              <span className="rounded-full bg-[#FEF08A] px-2.5 py-0.5 text-xs font-medium text-[#713F12]">
                {cohortStartDate}
              </span>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full h-12 font-medium disabled:opacity-50 disabled:pointer-events-none"
          >
            Continue
          </Button>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <Checkbox
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
              className="mt-0.5"
            />
            <span className="text-[#4a5568]">
              I agree to pay balance on or before the program begins
            </span>
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}

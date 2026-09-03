import { formatCurrency } from "@/features/payment/mock-data";
import type { PaymentPlan } from "@/features/payment/types";

export function CurrentPlanCard({
  plan,
  nextDueDate,
}: {
  plan: PaymentPlan;
  nextDueDate?: string;
}) {
  const rows: Array<[string, string]> = [
    ["Plan Amount", formatCurrency(plan.totalAmount)],
    ["Installments", String(plan.installmentsCount)],
    ["Installment Amount", formatCurrency(plan.installmentAmount)],
    ["Start Date", plan.startDate],
    ["Next Due Date", nextDueDate ?? plan.startDate],
    ["Payment Method", plan.paymentMethod],
  ];

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-4 font-clash-display text-lg text-[#092A31] fnt-semibold">
        Current Plan
      </h2>
      <div className="flex flex-col gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <span className="font-sora text-sm text-[#64748B]">{label}</span>
            <span className="font-sora text-sm font-semibold text-[#092A31]">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { formatCurrency } from "@/features/payment/mock-data";
import type { Installment } from "@/features/payment/types";
import { DownloadIcon, ViewReceiptIcon } from "./icons";
import { StatusBadge, getRowHighlightClass } from "./status-badge";
import { EmptyScheduleState } from "./empty-schedule-state";


export function PaymentScheduleTable({
  schedule,
  installmentsCount,
}: {
  schedule: Installment[];
  installmentsCount?: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-sora text-lg text-[#092A31] font-bold">
            Payment Schedule
          </h2>
          <p className="font-sora text-sm text-[#092A31]">
            {installmentsCount ?? schedule.length} Installments Plan
          </p>
        </div>
        {schedule.length > 0 ? (
          <button
            type="button"
            className="flex h-8.5 items-center gap-1 rounded-lg bg-[#B6CFD4] px-2 font-sora text-sm text-[#0C3640] transition-colors hover:bg-[#B6CFD4]/80"
          >
            <DownloadIcon />
            Download
          </button>
        ) : null}
      </div>

      {schedule.length === 0 ? (
        <EmptyScheduleState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 border-collapse">
            <thead>
              <tr className="h-13 bg-[#E8EFF1] font-sora text-base text-[#5C6777]">
                <th className="rounded-l-lg px-4 text-left">Installment</th>
                <th className="px-4 text-left">Due Date</th>
                <th className="px-4 text-left">Amount</th>
                <th className="px-4 text-left">Status</th>
                <th className="rounded-r-lg px-4 text-left">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((installment) => (
                <tr
                  key={installment.id}
                  className={`h-14 font-sora text-sm font-medium text-[#092A31] ${getRowHighlightClass(installment.status)}`}
                >
                  <td className="px-4">{installment.description}</td>
                  <td className="px-4">{installment.dueDate}</td>
                  <td className="px-4">{formatCurrency(installment.amount)}</td>
                  <td className="px-4">
                    <StatusBadge status={installment.status} />
                  </td>
                  <td className="px-4">
                    {installment.status === "paid" ? (
                      <Link
                        href={`/dashboard/billing?receiptid=${installment.id}`}
                        aria-label="View receipt"
                        className="flex items-center gap-1"
                      >
                        <ViewReceiptIcon />
                        View Receipt
                      </Link>
                    ) : (
                      <span className="text-[#B6CFD4]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

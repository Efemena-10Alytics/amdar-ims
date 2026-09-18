"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatReferralCurrency } from "@/features/referral/mock-data";
import type { WithdrawalEntry } from "@/features/referral/types";
import { ExportIcon } from "./icons";
import { WithdrawalStatusBadge } from "./status-badge";
import { EmptyWithdrawalState } from "./empty-withdrawal-state";

const PAGE_SIZE = 9;

export function WithdrawalHistoryTable({ withdrawals }: { withdrawals: WithdrawalEntry[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(withdrawals.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return withdrawals.slice(start, start + PAGE_SIZE);
  }, [withdrawals, currentPage]);

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-clash-display text-lg font-semibold text-[#092A31]">
          Withdrawal History
        </h2>
        <button
          type="button"
          className="flex h-8.5 items-center gap-1 rounded-lg bg-[#B6CFD4] px-2 font-sora text-sm text-[#0C3640] transition-colors hover:bg-[#B6CFD4]/80"
        >
          <ExportIcon />
          {withdrawals.length > 0 ? "Export" : "Download"}
        </button>
      </div>

      {withdrawals.length === 0 ? (
        <EmptyWithdrawalState />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-200 border-collapse">
              <thead>
                <tr className="h-13 bg-[#E8EFF1] font-sora text-sm text-[#5C6777]">
                  <th className="rounded-l-lg px-4 text-left">#</th>
                  <th className="px-4 text-left">Date</th>
                  <th className="px-4 text-left">Amount</th>
                  <th className="px-4 text-left">Method</th>
                  <th className="px-4 text-left">Account</th>
                  <th className="px-4 text-left">Status</th>
                  <th className="px-4 text-left">Reference</th>
                  <th className="rounded-r-lg px-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((withdrawal, index) => (
                  <tr
                    key={withdrawal.id}
                    className="h-16 border-b border-[#EEF2F6] font-sora text-sm font-medium text-[#092A31] last:border-b-0"
                  >
                    <td className="px-4 text-[#94A3B8]">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 text-[#64748B]">{withdrawal.date}</td>
                    <td className="px-4">{formatReferralCurrency(withdrawal.amount)}.00</td>
                    <td className="px-4 text-[#64748B]">{withdrawal.method}</td>
                    <td className="px-4">
                      <div className="flex flex-col">
                        <span>{withdrawal.accountMasked}</span>
                        <span className="text-xs text-[#94A3B8]">{withdrawal.accountLabel}</span>
                      </div>
                    </td>
                    <td className="px-4">
                      <WithdrawalStatusBadge status={withdrawal.status} />
                    </td>
                    <td className="px-4 text-[#64748B]">{withdrawal.reference}</td>
                    <td className="px-4 max-w-40 truncate text-[#64748B]">
                      {withdrawal.notes ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-end gap-1 font-sora text-sm">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[#64748B] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`flex size-8 items-center justify-center rounded-md ${
                    pageNumber === currentPage
                      ? "bg-[#E8EFF1] font-semibold text-[#092A31]"
                      : "text-[#64748B] hover:bg-[#F6F8FA]"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[#64748B] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="size-4" />
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

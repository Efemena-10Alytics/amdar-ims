"use client";

import { useState } from "react";
import {
  CURRENCY_LABELS,
  formatReferralAmount,
  formatReferralDate,
  getCurrencySymbol,
  toAmount,
  type ReferralCurrency,
} from "@/features/referral/locale";
import type {
  ReferralPagination,
  WithdrawalRecord,
} from "@/features/referral/referral-api.types";
import { ExportIcon } from "./icons";
import { WithdrawalStatusBadge } from "./status-badge";
import { EmptyWithdrawalState } from "./empty-withdrawal-state";
import { TablePagination } from "./table-pagination";

const COLUMN_COUNT = 8;

/** Payout currencies outside the four we carry symbols for show the code. */
function formatPayout(amount: string, code: string): string {
  const normalized = code?.trim().toUpperCase();
  if (normalized in CURRENCY_LABELS) {
    return `${getCurrencySymbol(normalized as ReferralCurrency)}${toAmount(
      amount,
    ).toLocaleString()}`;
  }
  return `${toAmount(amount).toLocaleString()} ${normalized}`;
}

export function WithdrawalHistoryTable({
  withdrawals,
  currency,
  pagination,
  onPageChange,
  onExport,
  isLoading = false,
  errorMessage = null,
}: {
  withdrawals: WithdrawalRecord[];
  currency: ReferralCurrency;
  pagination: ReferralPagination | null;
  onPageChange: (page: number) => void;
  onExport: () => void | Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      await onExport();
    } catch {
      setExportError("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const rowOffset = pagination ? (pagination.current_page - 1) * pagination.per_page : 0;

  return (
    <div className="min-w-0 rounded-2xl bg-white p-5 shadow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-clash-display text-lg font-semibold text-[#092A31]">
          Withdrawal History
        </h2>
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting || withdrawals.length === 0}
          className="flex h-8.5 items-center gap-1 rounded-lg bg-[#B6CFD4] px-2 font-sora text-sm text-[#0C3640] transition-colors hover:bg-[#B6CFD4]/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ExportIcon />
          {isExporting ? "Exporting…" : "Export"}
        </button>
      </div>

      {exportError && <p className="mb-3 font-sora text-sm text-[#AA3030]">{exportError}</p>}

      {errorMessage ? (
        <p className="font-sora text-sm text-[#AA3030]">{errorMessage}</p>
      ) : withdrawals.length === 0 && !isLoading ? (
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
                  <th className="px-4 text-left">Payout</th>
                  <th className="px-4 text-left">Account</th>
                  <th className="px-4 text-left">Status</th>
                  <th className="px-4 text-left">Reference</th>
                  <th className="rounded-r-lg px-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && withdrawals.length === 0
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <tr key={index} className="h-16 border-b border-[#EEF2F6] last:border-b-0">
                        {Array.from({ length: COLUMN_COUNT }).map((__, cell) => (
                          <td key={cell} className="px-4">
                            <span className="block h-3 animate-pulse rounded bg-[#E8EFF1]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : withdrawals.map((withdrawal, index) => (
                      <tr
                        key={withdrawal.id}
                        className="h-16 border-b border-[#EEF2F6] font-sora text-sm font-medium text-[#092A31] last:border-b-0"
                      >
                        <td className="px-4 text-[#94A3B8]">{rowOffset + index + 1}</td>
                        <td className="px-4 text-[#64748B]">
                          {formatReferralDate(withdrawal.date)}
                        </td>
                        <td className="px-4">
                          {formatReferralAmount(toAmount(withdrawal.amount_gbp), currency)}
                        </td>
                        <td className="px-4">
                          <div className="flex flex-col">
                            <span>
                              {formatPayout(
                                withdrawal.payout_amount,
                                withdrawal.payout_currency,
                              )}
                            </span>
                            {toAmount(withdrawal.exchange_rate) !== 1 && (
                              <span className="text-xs text-[#94A3B8]">
                                @ {toAmount(withdrawal.exchange_rate).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4">
                          <div className="flex flex-col">
                            <span>{withdrawal.account.masked_number}</span>
                            <span className="text-xs text-[#94A3B8]">
                              {withdrawal.account.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-4">
                          <WithdrawalStatusBadge status={withdrawal.status} />
                        </td>
                        <td className="px-4 text-[#64748B]">{withdrawal.invoice_id}</td>
                        <td
                          className="max-w-40 truncate px-4 text-[#64748B]"
                          title={withdrawal.decline_reason ?? undefined}
                        >
                          {withdrawal.decline_reason ?? "—"}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <TablePagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

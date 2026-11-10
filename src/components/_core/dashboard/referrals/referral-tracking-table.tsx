"use client";

import { useState } from "react";
import {
  formatReferralAmount,
  formatReferralDate,
  toAmount,
  type ReferralCurrency,
} from "@/features/referral/locale";
import type {
  ReferralPagination,
  ReferralTrackingItem,
} from "@/features/referral/referral-api.types";
import { ExportIcon } from "./icons";
import { ReferralPaymentPlanBadge } from "./status-badge";
import { EmptyReferralState } from "./empty-referral-state";
import { TablePagination } from "./table-pagination";

const COLUMN_COUNT = 7;

export function ReferralTrackingTable({
  referrals,
  currency,
  pagination,
  onPageChange,
  onExport,
  isLoading = false,
  errorMessage = null,
}: {
  referrals: ReferralTrackingItem[];
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

  // Row numbers continue across pages, matching the API's own `number`.
  const rowOffset = pagination ? (pagination.current_page - 1) * pagination.per_page : 0;

  return (
    <div className="min-w-0 rounded-2xl bg-white p-5 shadow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-clash-display text-lg font-semibold text-[#092A31]">
          Referral Tracking
        </h2>
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting || referrals.length === 0}
          className="flex h-8.5 items-center gap-1 rounded-lg bg-[#B6CFD4] px-2 font-sora text-sm text-[#0C3640] transition-colors hover:bg-[#B6CFD4]/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ExportIcon />
          {isExporting ? "Exporting…" : "Export"}
        </button>
      </div>

      {exportError && (
        <p className="mb-3 font-sora text-sm text-[#AA3030]">{exportError}</p>
      )}

      {errorMessage ? (
        <p className="font-sora text-sm text-[#AA3030]">{errorMessage}</p>
      ) : referrals.length === 0 && !isLoading ? (
        <EmptyReferralState />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 border-collapse">
              <thead>
                <tr className="h-13 bg-[#E8EFF1] font-sora text-xs tracking-wide text-[#5C6777] uppercase">
                  <th className="rounded-l-lg px-4 text-left">#</th>
                  <th className="px-4 text-left">Referee Name</th>
                  <th className="px-4 text-left">Email</th>
                  <th className="px-4 text-left">Programme</th>
                  <th className="px-4 text-left">Payment Plan</th>
                  <th className="px-4 text-left">Joined On</th>
                  <th className="rounded-r-lg px-4 text-left">Reward</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && referrals.length === 0
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <tr key={index} className="h-14 border-b border-[#EEF2F6] last:border-b-0">
                        {Array.from({ length: COLUMN_COUNT }).map((__, cell) => (
                          <td key={cell} className="px-4">
                            <span className="block h-3 animate-pulse rounded bg-[#E8EFF1]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : referrals.map((referral, index) => (
                      <tr
                        key={referral.id}
                        className="h-14 border-b border-[#EEF2F6] font-sora text-sm font-medium text-[#092A31] last:border-b-0"
                      >
                        <td className="px-4 text-[#94A3B8]">{rowOffset + index + 1}</td>
                        <td className="px-4">{referral.referee_name}</td>
                        <td className="px-4 text-[#64748B]">{referral.email}</td>
                        <td className="px-4">{referral.programme}</td>
                        <td className="px-4">
                          <ReferralPaymentPlanBadge
                            current={referral.payment_plan.paid}
                            total={referral.payment_plan.total}
                            status={referral.payment_plan.status}
                          />
                        </td>
                        <td className="px-4 text-[#64748B]">
                          {formatReferralDate(referral.joined_on)}
                        </td>
                        <td
                          className={
                            referral.reward_is_projected ? "px-4 text-[#94A3B8]" : "px-4 text-[#156374]"
                          }
                          title={
                            referral.reward_is_projected
                              ? "Projected reward, not yet earned"
                              : undefined
                          }
                        >
                          {formatReferralAmount(toAmount(referral.reward), currency)}
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

"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Pagination from "./pagination";
import { WEEK_REPORT, WeekReportRow } from "./types";

const STATUS_STYLES: Record<WeekReportRow["status"], string> = {
  Completed: "bg-[#C7F5D8] text-[#297A46]",
  Pending: "bg-[#FFF5E9] text-[#92600C]",
  Missed: "bg-[#FEE2E2] text-[#B91C1C]",
};

const PAGE_SIZE = 6;

const SurveyReportTable = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(WEEK_REPORT.length / PAGE_SIZE));
  const paginated = WEEK_REPORT.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openSurvey = (week: string) => {
    const surveyId = week.toLowerCase().replace(/\s+/g, "-");
    router.push(`${pathname}?view=${surveyId}`);
  };

  return (
    <div>
      <h3 className="font-sora text-lg font-semibold text-[#092A31]">Survey report</h3>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-[#E6EBF0]">
              {["WEEK", "AVG. RATE", "STATUS", "TIME", "DATE SUBMITTED"].map((label) => (
                <th
                  key={label}
                  className="whitespace-nowrap py-3 text-left font-sora text-base font-medium text-[#5C6777]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr
                key={row.week}
                onClick={() => openSurvey(row.week)}
                className="cursor-pointer border-b border-[#F1F5F9] last:border-none hover:bg-[#F8FAFC]"
              >
                <td className="whitespace-nowrap py-4 font-sora text-sm text-[#092A31]">{row.week}</td>
                <td className="whitespace-nowrap py-4 font-sora text-sm text-[#092A31]">{row.avgRate}</td>
                <td className="whitespace-nowrap py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-[24px] px-2 py-1 font-sora text-xs ${STATUS_STYLES[row.status]}`}
                  >
                    <span className="text-[10px]">•</span>
                    {row.status}
                  </span>
                </td>
                <td className="whitespace-nowrap py-4 font-sora text-sm text-[#092A31]">{row.time}</td>
                <td className="whitespace-nowrap py-4 font-sora text-sm text-[#092A31]">{row.dateSubmitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default SurveyReportTable;
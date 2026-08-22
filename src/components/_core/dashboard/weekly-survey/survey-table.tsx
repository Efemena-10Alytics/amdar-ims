"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExportIcon, FilterIcon, SearchIcon } from "./icons";
import PeriodDropdown, { PeriodOption } from "./period-dropdown";
import Pagination from "./pagination";
import { INTERNS } from "./types";

const PERIOD_OPTIONS: PeriodOption[] = [
  { label: "All time", value: "all-time" },
  { label: "Current period", value: "current-period" },
  { label: "Previous period", value: "previous-period" },
  { label: "Custom", value: "custom" },
];

const PAGE_SIZE = 10;

const SurveyTable = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("current-period");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return INTERNS;
    return INTERNS.filter(
      (i) => i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExport = () => {
    // Wire this up to the real export endpoint
    console.log("Exporting survey report...");
  };

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="font-sora text-lg font-semibold text-[#092A31]">Survey report</h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search interns name or email"
              className="h-[42px] w-[260px] rounded-2xl border border-[#E6EBF0] bg-[#F8FAFC] py-3 pl-9 pr-3 font-sora text-sm text-[#092A31] outline-none placeholder:text-[#94A3B8]"
            />
          </div>

          <PeriodDropdown
            variant="button"
            options={PERIOD_OPTIONS}
            selected={period}
            onChange={(v) => {
              setPeriod(v);
              setPage(1);
            }}
          />

          <button
            type="button"
            className="flex h-[34px] items-center gap-1.5 rounded-lg bg-[#E8EFF1] px-3 font-sora text-sm text-[#156374]"
          >
            <FilterIcon />
            Filter
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="flex h-[34px] items-center gap-1 rounded-lg bg-[#B6CFD4] p-2 px-3 font-sora text-sm text-[#0C3640] transition-opacity hover:opacity-90"
          >
            <ExportIcon />
            Export
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-[#E6EBF0]">
              {["NAME", "EMAIL", "SUBMISSIONS", "TIME", "DATE"].map((label) => (
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
            {paginated.map((intern) => (
              <tr
                key={intern.id}
                onClick={() => router.push(`/dashboard/weekly-survey/${intern.id}`)}
                className="cursor-pointer border-b border-[#F1F5F9] last:border-none hover:bg-[#F8FAFC]"
              >
                <td className="whitespace-nowrap py-4 font-sora text-sm text-[#092A31]">{intern.name}</td>
                <td className="whitespace-nowrap py-4 font-sora text-sm text-[#092A31]">{intern.email}</td>
                <td className="whitespace-nowrap py-4 font-sora text-sm text-[#092A31]">{intern.submissions}</td>
                <td className="whitespace-nowrap py-4 font-sora text-sm text-[#092A31]">{intern.time}</td>
                <td className="whitespace-nowrap py-4 font-sora text-sm text-[#092A31]">{intern.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginated.length === 0 && (
          <p className="mt-6 font-sora text-sm text-[#64748B]">No interns match your search.</p>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default SurveyTable;
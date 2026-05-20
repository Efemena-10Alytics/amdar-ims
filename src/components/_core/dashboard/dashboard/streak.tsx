"use client";

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"] as const;
const COMPLETED_DAYS = new Set(["Sun", "Mon", "Tue", "Wed"]);

const Streak = () => {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0B2B33]">Streak</h3>
        <p className="text-sm font-medium text-[#98A2B3]">21 Dec - 27 Dec</p>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {WEEK_DAYS.map((day) => {
          const isDone = COMPLETED_DAYS.has(day);
          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <span
                className={`flex size-5 items-center justify-center rounded-full border text-[10px] ${
                  isDone
                    ? "border-[#0E6174] bg-[#0E6174] text-white"
                    : "border-[#B6D9E2] bg-white text-transparent"
                }`}
                aria-hidden
              >
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span className="text-xs font-medium text-[#98A2B3]">{day}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col items-center">
        <span className="text-7xl leading-none" aria-hidden>
          🔥
        </span>
        <p className="mt-1 text-2xl font-bold text-[#0B2B33]">
          19<span className="ml-1 text-base font-semibold">days</span>
        </p>
      </div>

      <div className="mt-6 border-t border-[#EEF2F6] pt-4">
        <p className="text-sm text-[#667085]">Complete a task today to keep your streak going.</p>
        <Link
          href="/dashboard/internship"
          className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#1A6B8A] hover:text-[#0E6174]"
        >
          Submit assignment
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </section>
  );
};

export default Streak;

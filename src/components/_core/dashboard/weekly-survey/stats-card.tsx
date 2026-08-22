"use client";

import React, { ReactNode } from "react";
import PeriodDropdown, { PeriodOption } from "./period-dropdown";

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  percentage: string;
  /** Footer text, e.g. "80% target" or "On 80% target" */
  targetText: string;
  /** When provided, renders a "period" pill + dropdown on the right of the footer (main page only) */
  periodOptions?: PeriodOption[];
  selectedPeriod?: string;
  onPeriodChange?: (value: string) => void;
}

const StatsCard = ({
  icon,
  title,
  percentage,
  targetText,
  periodOptions,
  selectedPeriod,
  onPeriodChange,
}: StatsCardProps) => {
  return (
    <div className="flex h-[128px] flex-col justify-between rounded-[12px] border border-[#E6EBF0] bg-[#F8FAFC] p-4">
      <div className="flex items-center justify-between">
        <p className="font-sora text-sm font-normal leading-none text-[#092A31]">{title}</p>
        {icon}
      </div>

      <div>
        <p className="font-sora text-2xl font-semibold leading-none text-[#359E5B]">{percentage}</p>

        <div className="mt-3 flex items-center justify-between">
          <p className="font-sora text-xs font-normal leading-none text-[#A1A8B1]">{targetText}</p>

          {periodOptions && (
            <PeriodDropdown
              options={periodOptions}
              selected={selectedPeriod ?? periodOptions[0]?.value ?? ""}
              onChange={onPeriodChange ?? (() => {})}
              variant="pill"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
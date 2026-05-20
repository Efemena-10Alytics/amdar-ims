"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ActivityLevel = 0 | 1 | 2;
type Timeframe = "daily" | "weekly" | "monthly";

const ACTIVITY_BY_TIMEFRAME: Record<
  Timeframe,
  { date: string; labels: string[]; rows: ActivityLevel[][] }
> = {
  daily: {
    date: "27 Dec",
    labels: ["12am", "4am", "8am", "12pm", "4pm", "8pm", "11pm"],
    rows: [[2, 2, 2, 0, 1, 0, 0]],
  },
  weekly: {
    date: "21 Dec - 27 Dec",
    labels: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
    rows: [
      [2, 2, 1, 0, 1, 0, 0],
      [2, 2, 2, 0, 1, 0, 0],
      [1, 2, 2, 0, 1, 0, 0],
      [1, 2, 2, 0, 1, 0, 0],
    ],
  },
  monthly: {
    date: "1 Dec - 31 Dec",
    labels: ["W1", "W2", "W3", "W4"],
    rows: [
      [2, 2, 2, 2, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0],
      [2, 2, 2, 2, 2, 2, 0, 0, 1, 1, 0, 0, 0, 0],
      [1, 1, 2, 2, 2, 2, 0, 0, 1, 1, 0, 0, 0, 0],
    ],
  },
};

function getCellClass(level: ActivityLevel) {
  if (level === 2) return "border-[#0C5970] bg-[#0C5970]";
  if (level === 1) return "border-[#9DC7D2] bg-[#9DC7D2]";
  return "border-[#EAF2F6] bg-white";
}

const ActivityPeak = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>("weekly");
  const data = ACTIVITY_BY_TIMEFRAME[timeframe];
  const rowColumns = data.rows[0]?.length ?? 7;
  const timeframeLabel =
    timeframe.charAt(0).toUpperCase() + timeframe.slice(1);

  return (
    <section className="rounded-2xl flex flex-col justify-between border border-[#E2E8F0] bg-white p-4 sm:p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#0B2B33]">Acivities peak</h3>
            <p className="text-sm font-medium text-[#98A2B3]">{data.date}</p>
          </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A6B8A] outline-none"
              aria-label="Activity filter"
            >
              {timeframeLabel}
              <ChevronDown className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-30">
            <DropdownMenuItem onClick={() => setTimeframe("daily")}>
              Daily
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeframe("weekly")}>
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeframe("monthly")}>
              Monthly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#98A2B3]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#0C5970]" />
            Pick hour
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#9DC7D2]" />
            Low Average
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#9DC7D2]" />
            Low Average
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full border border-[#EAF2F6] bg-white" />
            No record
          </span>
        </div>
      </div>

      <div>
        <div className="mt-3 space-y-1.5">
          {data.rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${rowColumns}, minmax(0, 1fr))` }}
            >
              {row.map((level, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`h-7 rounded-md border ${getCellClass(level)}`}
                />
              ))}
            </div>
          ))}
        </div>

        <div
          className="mt-3 grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${data.labels.length}, minmax(0, 1fr))` }}
        >
          {data.labels.map((label) => (
            <span
              key={label}
              className="text-center text-xs font-medium text-[#98A2B3]"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivityPeak;

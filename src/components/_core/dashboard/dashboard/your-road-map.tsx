"use client";

import { Star } from "lucide-react";

const stars = [
  { left: "13%", top: "79%" },
  { left: "20%", top: "69%" },
  { left: "28%", top: "62%" },
  { left: "36%", top: "47%" },
  { left: "46%", top: "54%" },
  { left: "54%", top: "42%" },
  { left: "66%", top: "30%" },
];

const checkpoints = [
  { label: "Start", left: "9%", top: "70%" },
  { label: "You have completed your first Project", left: "25%", top: "29%" },
  { label: "CV Review Completed", left: "58%", top: "24%" },
];

const YourRoadMap = () => {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
      <div className="px-4 pt-4 sm:px-6 sm:pt-5">
        <h2 className="text-xl font-semibold text-[#0B2B33]">Your road map</h2>
      </div>

      <div className="relative h-64 w-full sm:h-72">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 360"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 335 C 85 310, 130 286, 200 248 C 272 208, 292 132, 370 128 C 455 124, 500 186, 588 150 C 666 118, 688 64, 760 58 C 846 50, 900 35, 1000 0"
            fill="none"
            stroke="#D9EEF2"
            strokeWidth="128"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0 335 C 85 310, 130 286, 200 248 C 272 208, 292 132, 370 128 C 455 124, 500 186, 588 150 C 666 118, 688 64, 760 58 C 846 50, 900 35, 1000 0"
            fill="none"
            stroke="#6FA9B6"
            strokeWidth="6"
            strokeDasharray="12 14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 330 C 44 322, 70 314, 95 304"
            fill="none"
            stroke="#0F3E49"
            strokeWidth="6"
            strokeDasharray="12 12"
            strokeLinecap="round"
          />
        </svg>

        {stars.map((item) => (
          <div
            key={`${item.left}-${item.top}`}
            className="absolute text-[#FFB547]"
            style={{ left: item.left, top: item.top }}
          >
            <Star className="size-3 fill-current" />
          </div>
        ))}

        {checkpoints.map((item, index) => (
          <div
            key={item.label}
            className="absolute max-w-37.5 rounded-md bg-white/95 px-2 py-1 text-[11px] leading-tight text-[#64748B] shadow-[0_2px_8px_rgba(13,42,49,0.08)] sm:max-w-45 sm:text-xs"
            style={{ left: item.left, top: item.top }}
          >
            <span className="block font-semibold text-[#0F3E49]">
              {index === 0 ? "Start" : item.label}
            </span>
          </div>
        ))}

        <div className="absolute left-[8.5%] top-[77%] flex size-6 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#FFC8A6] text-[10px]">
          🙂
        </div>

        <div className="absolute left-[10%] top-[87%] flex size-6 items-center justify-center rounded-full border border-[#B7E8C4] bg-[#E4F8E8] text-[#1F7A4A]">
          ✦
        </div>

        <div className="absolute bottom-5 left-5 rounded-lg bg-[#E4F8E8] px-3 py-2 text-[11px] font-medium leading-tight text-[#1F7A4A] shadow-[0_2px_8px_rgba(13,42,49,0.08)]">
          Building experiences
          <br />
          that recruiters hire for
        </div>
      </div>
    </section>
  );
};

export default YourRoadMap;

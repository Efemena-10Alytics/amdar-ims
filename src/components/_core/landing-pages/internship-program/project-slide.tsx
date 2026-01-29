"use client";

import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

const FIRST_TEXT = "Real"; // constant, only the rest changes

const GAIN_ITEMS = [
  "Projects",
  "Responsibilities",
  "Collaboration",
  "Documentation",
  "Contributions",
  "Reference",
];

const AUTO_ADVANCE_MS = 4000;

const ProjectSlide = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % GAIN_ITEMS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-start">
      <div className="mb-6 text-start">
        <span className="text-[#64748B] text-xl lg:text-2xl font-semibold">
          {FIRST_TEXT}{" "}
        </span>
        <span className="text-[#092A31] text-2xl lg:text-3xl font-bold">
          {GAIN_ITEMS[activeIndex] ?? GAIN_ITEMS[0]}
        </span>
      </div>
      <div className="flex gap-1 flex-wrap justify-start">
        {GAIN_ITEMS.map((_, i) => (
          <div key={i}>
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex justify-start gap-1 py-1 text-sm font-medium transition-colors min-w-10",
                activeIndex === i ? "text-[#092A31]" : "text-[#B6CFD4]",
              )}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
            </button>
            <div className="h-2 xl:w-20 w-16 overflow-hidden bg-[#B6CFD4]">
              <div
                className={cn(
                  "h-full bg-[#0C3640] transition-[width] duration-500 ease-out",
                  activeIndex === i ? "w-full" : "w-0",
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSlide;

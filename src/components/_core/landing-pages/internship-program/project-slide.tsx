"use client";

import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

const DEFAULT_FIRST_TEXT = "Real"; // constant, only the rest changes
const DEFAULT_GAIN_ITEMS = [
  "Projects",
  "Responsibilities",
  "Collaboration",
  "Documentation",
  "Contributions",
  "Reference",
];

const AUTO_ADVANCE_MS = 4000;

interface ProjectSlideProps {
  firstText?: string;
  items?: string[];
}

const ProjectSlide = ({
  firstText = DEFAULT_FIRST_TEXT,
  items = DEFAULT_GAIN_ITEMS,
}: ProjectSlideProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const gainItems = items.length > 0 ? items : DEFAULT_GAIN_ITEMS;

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % gainItems.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [gainItems.length]);

  return (
    <div className="text-start">
      <div className="mb-6 text-start">
        {firstText ? (
          <span className="text-[#64748B] text-xl lg:text-2xl font-semibold">
            {firstText}{" "}
          </span>
        ) : null}
        <span className="text-[#092A31] text-2xl lg:text-3xl font-semibold">
          {gainItems[activeIndex] ?? gainItems[0]}
        </span>
      </div>
      <div className="flex gap-1 flex-wrap justify-start">
        {gainItems.map((_, i) => (
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

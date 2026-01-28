import { cn } from "@/lib/utils";
import React from "react";

const ProjectSlide = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const GAIN_ITEMS = [
    "Real Projects",
    "Structured Experience",
    "Team Collaboration",
    "Leadership Guidance",
    "Deliverables & Results",
    "Portfolio Evidence",
  ];
  return (
    <div className="text-start">
      <div className="mb-6 text-start">
        {(() => {
          const phrase = GAIN_ITEMS[activeIndex] ?? GAIN_ITEMS[0];
          const parts = phrase.split(" ");
          const first = parts[0];
          const rest = parts.slice(1).join(" ");
          return (
            <>
              <span className="text-[#64748B] text-xl lg:text-2xl font-medium">
                {first}{" "}
              </span>
              <span className="text-[#092A31] text-2xl lg:text-3xl font-bold">
                {rest}
              </span>
            </>
          );
        })()}
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
            <div
              className={cn(
                "h-2 xl:w-20 transition-colors",
                activeIndex === i ? "bg-[#092A31]" : "bg-[#B6CFD4]",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSlide;

"use client";

import { ArrowUpRight } from "lucide-react";

export type WorkExperienceItem = {
  id?: string;
  company: string;
  category: string;
  role: string;
  duration: string;
  linkUrl?: string;
};

type MyWorkExperienceProps = {
  items?: WorkExperienceItem[];
  onItemClick?: (item: WorkExperienceItem) => void;
};

export function MyWorkExperience({
  items = [],
  onItemClick,
}: MyWorkExperienceProps) {
  return (
    <section className="mt-20" aria-label="My work experience">
      <span className="text-xl font-semibold text-[#A1A8B1] mb-4">
        My Work Experience
      </span>
      <ul className="divide- divide-zinc-200">
        {items.map((item, index) => (
          <li key={item.id ?? index}>
            <button
              type="button"
              onClick={() => onItemClick?.(item)}
              className="w-full flex items-start gap-3 py-4 text-left hover:bg-zinc-50/80 transition-colors rounded-lg -mx-1 px-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`View ${item.company} experience`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-[#092A31]">{item.company}</h2>
                  <h3 className="text-sm text-[#B6CFD4] font-semibold">{item.category}</h3>
                </div>
                <p className="mt-0.5 text-sm text-[#64748B]">
                  {item.role}
                  <span className="mx-1.5" aria-hidden>
                    ·
                  </span>
                  {item.duration}
                </p>
              </div>
              <span className="shrink-0 flex size-9 items-center justify-center rounded-full text-primary mt-0.5" aria-hidden>
                <ArrowUpRight className="size-4" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

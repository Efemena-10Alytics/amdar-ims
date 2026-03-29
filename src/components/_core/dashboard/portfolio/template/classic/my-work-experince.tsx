"use client";

import { ArrowUpRight } from "lucide-react";
import Aos from "aos";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type WorkExperienceItem = {
  id?: string;
  company: string;
  category: string;
  role: string;
  duration: string;
  descriptions?: string[];
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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Aos.init()
  }, [])

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section data-aos="fade-up" className="mt-20" aria-label="My work experience">
      <div className="text-xl font-semibold text-[#A1A8B1] mb-4">
        My Work Experience
      </div>
      <div className="">
        {items.map((item, index) => {
          const itemKey = String(item.id ?? index);
          const isExpanded = expandedItems[itemKey] ?? false;
          return (
            <div key={item.id ?? index}
              className="w-full"
            >

              <button
                type="button"
                className={cn("flex p-4 cursor-pointer group rounded-lg text-left transition-colors hover:bg-[#156374] justify-between w-full",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.descriptions && item.descriptions.length > 0) {
                    toggleExpanded(itemKey);
                  }
                }}
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap text-left">
                    <h2 className="text-2xl font-semibold text-[#092A31] transition-colors group-hover:text-white">
                      {item.company}
                    </h2>
                    <h3 className="text-sm md:text-base font-semibold text-[#B6CFD4] transition-colors group-hover:text-[#D6E8EC]">
                      {item.category}
                    </h3>
                  </div>
                  <p className="mt-0.5 text-sm text-[#64748B] transition-colors group-hover:text-white/90">
                    {item.role}
                    <span className="mx-1.5" aria-hidden>
                      ·
                    </span>
                    {item.duration}
                  </p>

                </div>
                <ArrowUpRight
                  className={cn("size-5 transition-transform text-[#092A31] group-hover:text-white", isExpanded ? "rotate-45" : "rotate-0")}
                  aria-hidden
                />
              </button>

              {item.descriptions && item.descriptions.length > 0 ? (
                <div className="">
                  {isExpanded ? (
                    <ul className="list-disc space-y-1 pl-8 text-sm leading-relaxed text-[#64748B] marker:text-[#64748B]">
                      {item.descriptions.map((description, descriptionIndex) => (
                        <li className="capitalize" key={`${item.id ?? index}-desc-${descriptionIndex}`}>
                          {description}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>

          )
        })}
      </div>
    </section>
  );
}

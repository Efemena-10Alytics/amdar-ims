"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { initClassicAos } from "./init-classic-aos";
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
};

export function MyWorkExperience({
  items = [],
}: MyWorkExperienceProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    initClassicAos();
  }, []);

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
      <div className="space-y-4">
        {items.map((item, index) => {
          const itemKey = String(item.id ?? index);
          const isExpanded = expandedItems[itemKey] ?? false;
          return (
            <div key={item.id ?? index}
              className={cn("w-full", isExpanded ? "bg-[#E8EFF1] pb-2" : "bg-white")}
            >

              <button
                type="button"
                className={cn("flex p-4 cursor-pointer group text-left transition-colors justify-between w-full", isExpanded? "": "hover:bg-[#156374]"
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
                    <h2 className={cn("text-2xl font-semibold text-[#092A31] transition-colors", isExpanded ? "": "group-hover:text-white")}>
                      {item.company}
                    </h2>
                    <h3 className={cn("text-sm md:text-base font-semibold text-[#B6CFD4] transition-colors", isExpanded ? "": "group-hover:text-[#D6E8EC]")}>
                      {item.category}
                    </h3>
                  </div>
                  <p className={cn("mt-0.5 text-sm text-[#64748B] transition-colors ", isExpanded ? "": "group-hover:text-white")}>
                    {item.role}
                    <span className="mx-1.5" aria-hidden>
                      ·
                    </span>
                    {item.duration}
                  </p>

                </div>
                <ArrowUpRight
                  className={cn("size-5 transition-transform text-[#092A31] group-hover:hidden",)}
                  aria-hidden
                />
                {isExpanded ? (
                  <div className="hidden group-hover:flex text-primary bg-white p-1 rounded-full text-[10px] text-center h-10 w-10 items-center justify-center">
                    <ArrowUpRight
                      className={cn("size-5 transition-transform text-primary",)}
                      aria-hidden
                    />
                  </div>) : <div className="hidden group-hover:flex text-primary bg-amdari-yellow p-1 rounded-full text-[10px] text-center h-10 w-10 items-center justify-center">
                  view
                </div>
                }
              </button>

              {item.descriptions && item.descriptions.length > 0 ? (
                <div className="">
                  {isExpanded ? (
                    <ul className="list-disc space-y-3 pl-8 text-sm leading-relaxed text-[#092A31] marker:text-[#64748B]">
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

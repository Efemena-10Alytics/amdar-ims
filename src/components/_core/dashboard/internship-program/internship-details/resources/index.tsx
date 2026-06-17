"use client";

import { useState } from "react";
import { ExternalLink, FileText, Link2, Play, Triangle, TriangleRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrangleIcon } from "../../../svg";

const RESOURCE_CATEGORIES = [
  "Onboarding",
  "Session Recording",
  "Mentorship",
  "Drop-in session",
  "Project hub",
  "employability session",
  "FAQs",
  "Others",
] as const;

const RESOURCE_FILTERS = ["All", "Videos", "Links", "Materials"] as const;

const RESOURCE_ITEMS = [
  { id: "1", title: "How to speak with confident", date: "Jan 12, 2026", type: "video" },
  { id: "2", title: "How to speak with confident", date: "Jan 12, 2026", type: "link" },
  { id: "3", title: "How to speak with confident", date: "Jan 12, 2026", type: "material" },
  { id: "4", title: "How to speak with confident", date: "Jan 12, 2026", type: "video" },
] as const;

type ResourceFilter = (typeof RESOURCE_FILTERS)[number];
type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

function ResourceTypeIcon({ type }: { type: (typeof RESOURCE_ITEMS)[number]["type"] }) {
  if (type === "video") return <Play className="size-4 fill-current" aria-hidden />;
  if (type === "link") return <Link2 className="size-4" aria-hidden />;
  return <FileText className="size-4" aria-hidden />;
}

const Resources = () => {
  const [activeCategory, setActiveCategory] =
    useState<ResourceCategory>("Session Recording");
  const [activeFilter, setActiveFilter] = useState<ResourceFilter>("All");

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-3 sm:p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <aside className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
          <h2 className="text-base font-semibold text-[#092A31]">Resources</h2>

          <ul className="mt-3 space-y-1">
            {RESOURCE_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;

              return (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-left text-sm font-medium transition",
                      isActive
                        ? "bg-[#E8EFF1] text-[#156374]"
                        : "text-[#64748B] hover:bg-[#EEF2F6] hover:text-[#334155]",
                    )}
                  >
                    <span>{category}</span>
                    {isActive ? <TrangleIcon /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-4 pb-1">
            {RESOURCE_FILTERS.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "cursor-pointer border-b-2 pb-2 text-sm font-medium transition",
                    isActive
                      ? "border-[#156374] text-[#156374]"
                      : "border-transparent text-[#9AA7B3] hover:text-[#64748B]",
                  )}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <div className="space-y-2.5">
            {RESOURCE_ITEMS.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] px-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#156374] text-white">
                    <ResourceTypeIcon type={item.type} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium text-[#173740]">
                      {item.title}
                    </p>
                    <p className="text-sm text-[#64748B]">{item.date}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="cursor-pointer text-[#1A6B8A] transition hover:text-[#0E6174]"
                  aria-label={`Open ${item.title}`}
                >
                  <ExternalLink className="size-4" aria-hidden />
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;

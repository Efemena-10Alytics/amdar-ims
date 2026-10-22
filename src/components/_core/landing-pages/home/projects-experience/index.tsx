"use client";

import { useState } from "react";
import { Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import ClientImpact from "./client-impact";
import IndustriesImpact from "./industries-impact";
import Capabilities from "./capabilities";

const TABS = [
  { id: "client-impact", label: "Project Partners" },
  { id: "industries", label: "Industries" },
  { id: "capabilities", label: "Capability" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const ProjectExperience = () => {
  const [tab, setTab] = useState<TabId>("client-impact");
  const [hasChangedTab, setHasChangedTab] = useState(false);

  const selectTab = (next: TabId) => {
    if (next === tab) return;
    setHasChangedTab(true);
    setTab(next);
  };

  return (
    <section className="bg-white">
      <div className="app-width flex flex-col gap-4 pt-14 sm:flex-row sm:items-center sm:justify-between lg:pt-20">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EDE4F7] py-1.5 pr-4 pl-1.5 text-sm font-semibold text-[#4C3A63]">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#7B5EA7] text-white">
            <Crosshair className="size-3.5" />
          </span>
          Where we make impact
        </p>

        <div className="inline-flex w-fit items-center rounded-full bg-[#FFFCF3] p-1.5">
          {TABS.map((item) => {
            const isActive = tab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectTab(item.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-[#FFF1C6] text-[#3D3A1F]"
                    : "text-[#6E6758] hover:text-[#3D3A1F]",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden">
        <div key={tab} className={hasChangedTab ? "tab-slide-from-right" : undefined}>
          {tab === "client-impact" ? <ClientImpact /> : null}
          {tab === "industries" ? <IndustriesImpact /> : null}
          {tab === "capabilities" ? <Capabilities /> : null}
        </div>
      </div>
      <style>{`
        .tab-slide-from-right {
          animation: tab-slide-from-right 500ms ease;
        }
        @keyframes tab-slide-from-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tab-slide-from-right { animation: none; }
        }
      `}</style>
    </section>
  );
};

export default ProjectExperience;

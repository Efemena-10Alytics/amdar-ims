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
                onClick={() => setTab(item.id)}
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

      {tab === "client-impact" ? <ClientImpact /> : null}
      {tab === "industries" ? <IndustriesImpact /> : null}
      {tab === "capabilities" ? <Capabilities /> : null}
    </section>
  );
};

export default ProjectExperience;

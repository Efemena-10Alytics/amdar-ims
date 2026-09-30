"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import CareerStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage";
import CareerCenter from "@/components/_core/dashboard/internship-program/internship-details/career-center";
import Resources from "@/components/_core/dashboard/internship-program/internship-details/resources";
import ContinueTaskButton from "@/components/_core/dashboard/internship-program/internship-details/continue-task-button";

const TABS = [
  { id: "career-stage", label: "Career Stage" },
  // { id: "performance", label: "Performance" },
  { id: "career-center", label: "Career center" },
  { id: "resources", label: "Resources" },
] as const;

export type InternshipProgramTabId = (typeof TABS)[number]["id"];

function isInternshipProgramTabId(
  value: string | null,
): value is InternshipProgramTabId {
  return TABS.some((tab) => tab.id === value);
}

type InternshipDetailsProps = {
  defaultTab?: InternshipProgramTabId;
  onWhoIsOnlineClick?: () => void;
};

const InternshipDetails = ({
  defaultTab = "career-stage",
}: InternshipDetailsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab");
  const activeTab = isInternshipProgramTabId(queryTab) ? queryTab : defaultTab;

  useEffect(() => {
    if (isInternshipProgramTabId(queryTab)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", defaultTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [defaultTab, pathname, queryTab, router, searchParams]);

  const handleTabChange = (tabId: InternshipProgramTabId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "career-stage":
        return <CareerStage />;
      case "career-center":
        return <CareerCenter />;
      case "resources":
        return <Resources />;
      default:
        return <CareerStage />;
    }
  };

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 overflow-x-auto">
          <div
            className="inline-flex min-w-max rounded-full bg-[#EEF2F6] p-2"
            role="tablist"
            aria-label="Internship program sections"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-[#C5D6DC] text-[#092A31] shadow-sm"
                      : "text-[#98A2B3] hover:text-[#64748B]",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <ContinueTaskButton />
      </div>

      <div role="tabpanel" className="min-w-0">
        {renderTabContent()}
      </div>
    </section>
  );
};

export default InternshipDetails;

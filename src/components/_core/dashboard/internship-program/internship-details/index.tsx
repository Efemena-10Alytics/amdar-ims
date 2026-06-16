"use client";

import { useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { cn } from "@/lib/utils";
import InternshipInfo from "@/components/_core/dashboard/internship-program/internship-details/internship-info";
import CareerStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage";
import AssessmentRecords from "@/components/_core/dashboard/internship-program/internship-details/assessment-records";
import CareerCenter from "@/components/_core/dashboard/internship-program/internship-details/career-center";
import Resources from "@/components/_core/dashboard/internship-program/internship-details/resources";
import type { InternshipInfoData } from "@/components/_core/dashboard/internship-program/internship-details/internship-info";

const TABS = [
  { id: "internship-info", label: "Internship info" },
  { id: "career-stage", label: "Career Stage" },
  { id: "assessment-records", label: "Assessment records" },
  { id: "career-center", label: "Career center" },
  { id: "resources", label: "Resources" },
] as const;

export type InternshipProgramTabId = (typeof TABS)[number]["id"];

type InternshipDetailsProps = {
  internshipInfo?: InternshipInfoData;
  defaultTab?: InternshipProgramTabId;
  onWhoIsOnlineClick?: () => void;
};

function WhoIsOnlineButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-[#EDE4FF] to-[#F4EEFF] px-4 py-2.5 text-sm font-semibold text-[#5B4B8A] transition hover:from-[#E4D8FF] hover:to-[#EDE4FF]"
    >
      Who is online?
      <span className="flex size-7 items-center justify-center rounded-full bg-[#5B4B8A] text-white">
        <MessageCircleMore className="size-4" strokeWidth={2.25} aria-hidden />
      </span>
    </button>
  );
}

const InternshipDetails = ({
  internshipInfo,
  defaultTab = "internship-info",
  onWhoIsOnlineClick,
}: InternshipDetailsProps) => {
  const [activeTab, setActiveTab] = useState<InternshipProgramTabId>(defaultTab);

  const renderTabContent = () => {
    switch (activeTab) {
      case "internship-info":
        return <InternshipInfo info={internshipInfo} />;
      case "career-stage":
        return <CareerStage />;
      case "assessment-records":
        return <AssessmentRecords />;
      case "career-center":
        return <CareerCenter />;
      case "resources":
        return <Resources />;
      default:
        return <InternshipInfo info={internshipInfo} />;
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
                  onClick={() => setActiveTab(tab.id)}
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

        <WhoIsOnlineButton onClick={onWhoIsOnlineClick} />
      </div>

      <div role="tabpanel">{renderTabContent()}</div>
    </section>
  );
};

export default InternshipDetails;

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import SideNavExpandCollapse from "../side-nav-expand-collapse";
// import { CohortSwitcher } from "./cohort-switcher";
import { DeferInternshipButton } from "./defer-internship-button";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { formatCohortLabel } from "@/types/internship-program/user-program";

type JourneyAsideHeaderProps = {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

export function JourneyAsideHeader({
  isCollapsed,
  onToggleCollapse,
}: JourneyAsideHeaderProps) {
  const [showDeferButton, setShowDeferButton] = useState(false);
  const { data: enrollment } = useGetUserEnrollment();
  const currentCohortLabel = enrollment?.cohort
    ? formatCohortLabel(enrollment.cohort)
    : null;

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex items-center gap-2",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link href="/" className="inline-flex w-fit shrink-0">
          {isCollapsed ? (
            <Image
              src="/favicon-white.svg"
              height={28}
              width={36}
              alt="amdari"
              className="h-7 w-7 object-contain object-left"
            />
          ) : (
            <Image
              src="/logo-white.svg"
              height={28}
              width={126}
              alt="amdari"
              className="object-contain object-left"
            />
          )}
        </Link>

        {!isCollapsed ? (
          <div className="flex min-w-0 items-center gap-2">
            {/* <CohortSwitcher /> */}
            {currentCohortLabel ? (
              <button
                type="button"
                onClick={() => setShowDeferButton((visible) => !visible)}
                aria-expanded={showDeferButton}
                aria-controls="defer-internship-toggle"
                className="inline-flex items-center gap-1 rounded-full bg-[#0C5A66] px-3 py-1.5 text-left text-xs font-medium text-[#E8F4F6] transition hover:bg-[#0A4E58]"
                title={currentCohortLabel}
              >
                <span className="min-w-0 flex-1 truncate">
                  {currentCohortLabel}
                </span>
                <ChevronDown
                  className={cn(
                    "size-3.5 shrink-0 text-[#C4DEE3] transition-transform",
                    showDeferButton && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
            ) : null}
            <SideNavExpandCollapse
              isCollapsed={isCollapsed}
              onToggle={onToggleCollapse}
            />
          </div>
        ) : (
          <SideNavExpandCollapse
            isCollapsed={isCollapsed}
            onToggle={onToggleCollapse}
          />
        )}
      </div>

      {!isCollapsed && showDeferButton ? (
        <div id="defer-internship-toggle" className="flex justify-end">
          <DeferInternshipButton />
        </div>
      ) : null}
    </div>
  );
}

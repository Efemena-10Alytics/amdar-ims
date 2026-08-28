"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import SideNavExpandCollapse from "../side-nav-expand-collapse";
import { CohortSwitcher } from "./cohort-switcher";
import { DeferInternshipButton } from "./defer-internship-button";

type JourneyAsideHeaderProps = {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

export function JourneyAsideHeader({
  isCollapsed,
  onToggleCollapse,
}: JourneyAsideHeaderProps) {
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
            <CohortSwitcher />
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

      {!isCollapsed ? (
        <div className="flex justify-end">
          <DeferInternshipButton />
        </div>
      ) : null}
    </div>
  );
}

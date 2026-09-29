"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function ExpandCollapseIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        d="M5.5 2.5L2.5 2.5L2.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 11.5L11.5 11.5L11.5 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 2.5L6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11.5 11.5L8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SidebarCollapseToggle({
  className,
}: {
  className?: string;
}) {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "absolute top-24 -right-3.5 z-20 hidden size-7 items-center justify-center rounded-full bg-[#FFE082] text-[#092A31] shadow-[0_2px_8px_rgba(9,42,49,0.18)] transition-colors hover:bg-[#FFD54F] lg:flex",
        className,
      )}
    >
      <ExpandCollapseIcon />
    </button>
  );
}

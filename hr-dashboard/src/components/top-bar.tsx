"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Search } from "lucide-react";

/** Second crumb per route; the first is always "Recruitment". */
const CRUMBS: Record<string, string> = {
  "/": "Overview",
  "/jobs/create": "Create a job",
  "/open-roles": "Open roles",
  "/applicants": "Applicants",
  "/interviews": "Interviews",
  "/reports": "Reports",
  "/hiring-team": "Hiring team",
};

export function TopBar() {
  const pathname = usePathname();
  const crumb = CRUMBS[pathname] ?? "Overview";

  return (
    <header className="flex h-20 shrink-0 items-center gap-4 border-b border-[#EEF2F6] bg-white px-4 lg:px-8">
      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-2 text-sm sm:flex">
        <span className="text-[#64748B]">Recruitment</span>
        <span className="text-[#CBD5E1]">/</span>
        <span className="truncate font-semibold text-[#092A31]">{crumb}</span>
      </nav>

      <div className="relative ml-auto w-full max-w-85">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#94A3B8]"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search applicants or roles"
          aria-label="Search applicants or roles"
          className="h-11 w-full rounded-xl border border-[#E6EDEF] bg-white pr-4 pl-11 text-sm text-[#092A31] outline-none placeholder:text-[#94A3B8] focus:border-[#156374]"
        />
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="relative flex size-10 shrink-0 items-center justify-center rounded-full text-[#092A31] transition-colors hover:bg-[#F1F5F6]"
      >
        <Bell className="size-5" aria-hidden />
        <span className="absolute top-2 right-2.5 size-2 rounded-full bg-[#FFC107]" aria-hidden />
      </button>

      <span className="hidden h-8 w-px bg-[#EEF2F6] sm:block" aria-hidden />

      <button
        type="button"
        className="flex shrink-0 items-center gap-2.5 rounded-xl px-1 py-1 text-left transition-colors hover:bg-[#F1F5F6]"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-[#E8EFF1] text-sm font-semibold text-[#156374]">
          ZA
        </span>
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-sm font-semibold text-[#092A31]">Zainab Akinfenwa</span>
          <span className="text-xs text-[#64748B]">HR Manager</span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-[#64748B]" aria-hidden />
      </button>
    </header>
  );
}

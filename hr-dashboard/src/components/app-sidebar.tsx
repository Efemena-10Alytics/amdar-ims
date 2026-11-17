"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarDays,
  LayoutGrid,
  LineChart,
  User,
  Users,
} from "lucide-react";
import { BrandMark } from "./brand-mark";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Open roles", href: "/open-roles", icon: BriefcaseBusiness },
  { label: "Applicants", href: "/applicants", icon: User },
  { label: "Interviews", href: "/interviews", icon: CalendarDays },
  { label: "Reports", href: "/reports", icon: LineChart },
  { label: "Hiring team", href: "/hiring-team", icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-[#EEF2F6] bg-white lg:flex">
      <div className="flex h-20 items-center px-6">
        <Link href="/" aria-label="Amdari recruitment home">
          <BrandMark />
        </Link>
      </div>

      <nav className="flex flex-col gap-1 px-4 py-2">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-12 items-center gap-3 rounded-xl px-4 text-sm transition-colors",
                active
                  ? "bg-[#156374] font-medium text-white"
                  : "text-[#475569] hover:bg-[#F1F5F6]",
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

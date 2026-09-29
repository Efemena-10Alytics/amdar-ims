"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BillingIcon,
  BlogIcon,
  InternshipProgramIcon,
  JobReadinessIcon,
  LearnIcon,
  PortfolioIcon,
} from "../svg";
// import { ReferralsSidebarIcon } from "../referrals/icons";
import { NavMain } from "./nav-main";
import { SidebarCollapseToggle } from "./sidebar-collapse-toggle";
import { SidebarSupportFooter } from "./sidebar-footer";

const navMain = [
  // { title: "Dashboard", url: "/dashboard", icon: DashboardFilledIcon },
  { title: "Internship program", url: "/dashboard/internship-program", icon: InternshipProgramIcon },
  // { title: "Project vault", url: "/dashboard-projects/dashboard-project-paths/filter", icon: ProjectVaultIcon },
  // { title: "Interview prep", url: "/dashboard/portfolio", icon: InterviewPrepIcon },
  { title: "Job Readiness", url: "/dashboard/job-readiness", icon: JobReadinessIcon },
  { title: "Portfolio", url: "/dashboard/portfolio", icon: PortfolioIcon },
  // { title: "Hackathons", url: "/live-hackathon", icon: HackathonIcon },
  { title: "Learn", url: "/learn", icon: LearnIcon },
  { title: "Blog", url: "/dashboard-blog", icon: BlogIcon },
  { title: "Billings", url: "/dashboard/billing", icon: BillingIcon },
  // { title: "Referrals", url: "/dashboard/referrals", icon: ReferralsSidebarIcon },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="AMDARI"
              className="data-[slot=sidebar-menu-button]:p-1.5! group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-1!"
            >
              <Link href="/home" className="flex items-center gap-2">
                <Image
                  src="/favicon.svg"
                  height={28}
                  width={28}
                  alt="AMDARI"
                  className="hidden size-7 group-data-[collapsible=icon]:block"
                />
                <Image
                  src="/logo.svg"
                  height={22}
                  width={170}
                  alt="AMDARI"
                  className="group-data-[collapsible=icon]:hidden"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarSupportFooter />
      <SidebarCollapseToggle />
    </Sidebar>
  );
}

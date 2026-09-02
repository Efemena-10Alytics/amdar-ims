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
  InterviewPrepIcon,
  LearnIcon,
  PortfolioIcon,
} from "../svg";
import { NavMain } from "./nav-main";

const navMain = [
  // { title: "Dashboard", url: "/dashboard", icon: DashboardFilledIcon },
  { title: "Internship program", url: "/dashboard/internship-program", icon: InternshipProgramIcon },
  // { title: "Project vault", url: "/dashboard-projects/dashboard-project-paths/filter", icon: ProjectVaultIcon },
  // { title: "Interview prep", url: "/dashboard/portfolio", icon: InterviewPrepIcon },
  { title: "Job board", url: "#", icon: InterviewPrepIcon },
  { title: "Portfolio", url: "/dashboard/portfolio", icon: PortfolioIcon },
  // { title: "Hackathons", url: "/live-hackathon", icon: HackathonIcon },
  { title: "Learn", url: "/learn", icon: LearnIcon },
  { title: "Blog", url: "/dashboard-blog", icon: BlogIcon },
  // { title: "Billings", url: "/dashboard/billing", icon: BillingIcon },
];


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/home" className="flex items-center gap-2">
                <Image src="/logo.svg" height={22} width={170} alt="AAMDARI" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
    </Sidebar>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  BillingIcon,
  BlogIcon,
  DashboardFilledIcon,
  HackathonIcon,
  InternshipProgramIcon,
  InterviewPrepIcon,
  LearnIcon,
  PortfolioIcon,
  ProjectVaultIcon,
} from "../svg";
import { NavMain } from "./nav-main";
import { Leaf } from "lucide-react";

const navMain = [
  { title: "Dashboard", url: "/dashboard-dev", icon: DashboardFilledIcon },
  { title: "Internship program", url: "#", icon: InternshipProgramIcon },
  { title: "Project vault", url: "#", icon: ProjectVaultIcon },
  { title: "Interview prep", url: "#", icon: InterviewPrepIcon },
  { title: "Portfolio", url: "#", icon: PortfolioIcon },
  { title: "Hackathons", url: "#", icon: HackathonIcon },
  { title: "Learn", url: "#", icon: LearnIcon },
  { title: "Blog", url: "#", icon: BlogIcon },
  { title: "Billings", url: "#", icon: BillingIcon },
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
      <SidebarFooter>
        <div className="mx-2 mb-2 rounded-xl bg-primary p-3 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/90 text-white">
              <Leaf className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">Agada Queen</p>
              <p className="text-xs opacity-90">Mon - Fri (10am - 11pm)</p>
            </div>
          </div>
          <p className="mt-2 text-xs opacity-90">
            Book an office hour session with your team Lead
          </p>
          <Button
            asChild
            size="sm"
            className="mt-3 w-full bg-amdari-yellow text-zinc-900 hover:bg-amdari-yellow/90"
          >
            <Link href="#">Book session</Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

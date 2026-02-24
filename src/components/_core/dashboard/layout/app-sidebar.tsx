"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DashboardFilledIcon, InternshipProgramIcon } from "../svg";
import { NavMain } from "./nav-main";
import Link from "next/link";
import Image from "next/image";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: DashboardFilledIcon,
    },
    {
      title: "Internship program",
      url: "#",
      icon: InternshipProgramIcon,
    },
    {
      title: "Project vault",
      url: "#",
      icon: InternshipProgramIcon,
    },
    {
      title: "Interview prep",
      url: "#",
      icon: InternshipProgramIcon,
    },
    {
      title: "Interview prep",
      url: "#",
      icon: InternshipProgramIcon,
    },
    {
      title: "Job board",
      url: "#",
      icon: InternshipProgramIcon,
    },
    {
      title: "Hackathons",
      url: "#",
      icon: InternshipProgramIcon,
    },
    {
      title: "Learn",
      url: "#",
      icon: InternshipProgramIcon,
    },
    {
      title: "Blog",
      url: "#",
      icon: InternshipProgramIcon,
    },
    {
      title: "Billings",
      url: "#",
      icon: InternshipProgramIcon,
    },
  ],
};

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
                <Image src={"/logo.svg"} height={22} width={170} alt="amdari" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}

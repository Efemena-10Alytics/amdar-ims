import ExternalAuthBootstrap from "@/components/_core/auth/external-auth-bootstrap";
import { AppSidebar } from "@/components/_core/dashboard/layout/app-sidebar";
import { SiteHeader } from "@/components/_core/dashboard/layout/site-header";
import DashboardEnrollmentGuard from "@/components/_core/dashboard/layout/dashboard-enrollment-guard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    // Wraps the whole layout, not just the page: the sidebar and header run
    // auth-gated queries of their own, and an inbound handoff has to be applied
    // before any of them mount.
    <ExternalAuthBootstrap>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
            "--sidebar": "#fff",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col rounded-2xl shadow">
            <DashboardEnrollmentGuard>{children}</DashboardEnrollmentGuard>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ExternalAuthBootstrap>
  );
};

export default DashboardLayout;

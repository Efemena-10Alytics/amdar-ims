import ExternalAuthBootstrap from "@/components/_core/auth/external-auth-bootstrap";
import { AppSidebar } from "@/components/_core/dashboard/layout/app-sidebar";
import { SiteHeader } from "@/components/_core/dashboard/layout/site-header";
import DashboardEnrollmentGuard from "@/components/_core/dashboard/layout/dashboard-enrollment-guard";
import { DashboardSidebarProvider } from "@/components/_core/dashboard/layout/dashboard-sidebar-provider";
import { SidebarInset } from "@/components/ui/sidebar";
import { ReferralBanner } from "@/components/_core/dashboard/layout/referral-banner";
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
      <DashboardSidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--sidebar-width-icon": "3.5rem",
            "--header-height": "calc(var(--spacing) * 12)",
            "--sidebar": "#fff",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <ReferralBanner />
          <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden rounded-2xl shadow">
            <DashboardEnrollmentGuard>{children}</DashboardEnrollmentGuard>
          </div>
        </SidebarInset>
      </DashboardSidebarProvider>
    </ExternalAuthBootstrap>
  );
};

export default DashboardLayout;

"use client";

import Image from "next/image";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, ChevronRight, LogOut, ArrowLeftRight } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserInfo, getAvatarUrlFromUser } from "@/features/auth/use-get-user-info";
import type { AuthUser } from "@/store/auth-store";
import { UserAvatar } from "../../landing-pages/internship-program/svg";
import { ConfirmLogout } from "../../landing-pages/shared/navbar/confirm-logout";
import { useAuthStore } from "@/store/auth-store";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";
import { EnrollmentSwitcher } from "./enrollment-switcher";
import { PlatformSwitchButton } from "./platform-switch-button";
import { DefermentDialog } from "./deferment-dialog";

const pathToTitle: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/internship-program": "Internship Program",
  "/dashboard/portfolio": "Portfolio",
  "/dashboard/billing": "Billings",
};

function getHeaderTitle(pathname: string): string {
  return (
    pathToTitle[pathname] ??
    pathToTitle[pathname.replace(/\/$/, "")] ??
    "Dashboard"
  );
}

function getUserDisplayName(user: AuthUser | null | undefined): string {
  if (!user || typeof user !== "object") return "";
  const record = user as Record<string, unknown>;
  const nested =
    record.user && typeof record.user === "object"
      ? (record.user as Record<string, unknown>)
      : record;
  const first =
    nested.firstName ?? nested.first_name ?? nested.name ?? nested.username;
  const last = nested.lastName ?? nested.last_name;
  const firstName = typeof first === "string" ? first.trim() : "";
  const lastName = typeof last === "string" ? last.trim() : "";
  return [firstName, lastName].filter(Boolean).join(" ");
}

function getUserEmail(user: AuthUser | null | undefined): string {
  if (!user || typeof user !== "object") return "";
  const record = user as Record<string, unknown>;
  const nested =
    record.user && typeof record.user === "object"
      ? (record.user as Record<string, unknown>)
      : record;
  return typeof nested.email === "string" ? nested.email.trim() : "";
}

export function SiteHeader() {
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [defermentOpen, setDefermentOpen] = useState(false);
  const pathname = usePathname();
  const title = getHeaderTitle(pathname);
  const { data: userInfo } = useGetUserInfo();
  const logout = useAuthStore((s) => s.logout);
  const clearEnrollmentSelection = useEnrollmentSelectionStore(
    (s) => s.clearSelection,
  );
  const avatarUrl = getAvatarUrlFromUser(userInfo ?? null);
  const displayName = getUserDisplayName(userInfo);
  const email = getUserEmail(userInfo);

  return (
    <header className="grid h-22 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-b-2xl bg-white px-4 shadow-sm lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger
          className="lg:hidden"
          aria-label="Toggle sidebar"
        />
        <h1 className="truncate text-lg font-semibold text-zinc-900 lg:text-xl">
          {title}
        </h1>
      </div>
      <div className="flex min-w-0 items-center justify-center gap-2">
        <EnrollmentSwitcher />
        <PlatformSwitchButton />
      </div>
      <div className="flex min-w-0 items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-zinc-100 px-3 py-2 text-zinc-600 hover:bg-zinc-200 transition-colors"
        >
          <Bell className="size-5" />
          <span className="h-px w-5 bg-zinc-400" aria-hidden />
        </button>
        <div className="flex gap-2 bg-[#F8FAFC] p-1 border  rounded-lg">
          <button
            type="button"
            aria-label="Profile"
            className="relative flex size-10 items-center justify-center rounded-xl bg-primary text-zinc-600 overflow-hidden hover:bg-rose-200 transition-colors"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile"
                width={40}
                height={40}
                className="size-full object-cover"
                unoptimized={avatarUrl.startsWith("http")}
              />
            ) : (
              <UserAvatar />
            )}
            <span
              className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500"
              aria-hidden
            />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Menu"
                className="flex items-center justify-end rounded-xl px-1 py-2 text-zinc-600"
              >
                <ChevronRight className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 px-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-zinc-900">
                    {displayName || "Account"}
                  </span>
                  {email ? (
                    <span className="truncate text-xs font-normal text-zinc-500">
                      {email}
                    </span>
                  ) : null}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setDefermentOpen(true)}>
                <ArrowLeftRight className="size-4" />
                Defer internship
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setConfirmLogoutOpen(true)}
              >
                <LogOut className="size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DefermentDialog open={defermentOpen} onOpenChange={setDefermentOpen} />
      <ConfirmLogout
        open={confirmLogoutOpen}
        onOpenChange={setConfirmLogoutOpen}
        reloadOnConfirm={false}
        onConfirm={() => {
          clearEnrollmentSelection();
          logout();
          window.location.replace("/home");
        }}
      />
    </header>
  );
}

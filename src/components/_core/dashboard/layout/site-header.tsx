"use client";

import Image from "next/image";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, ChevronRight, LogOut } from "lucide-react";
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
import { UserAvatar } from "../../landing-pages/internship-program/svg";
import { ConfirmLogout } from "../../landing-pages/shared/navbar/confirm-logout";
import { useAuthStore } from "@/store/auth-store";

const pathToTitle: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/internship": "Internship Program",
  "/dashboard/portfolio": "Portfolio",
};

function getHeaderTitle(pathname: string): string {
  return (
    pathToTitle[pathname] ??
    pathToTitle[pathname.replace(/\/$/, "")] ??
    "Dashboard"
  );
}

export function SiteHeader() {
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const pathname = usePathname();
  const title = getHeaderTitle(pathname);
  const { data: userInfo } = useGetUserInfo();
  const logout = useAuthStore((s) => s.logout);
  const avatarUrl = getAvatarUrlFromUser(userInfo ?? null);


  return (
    <header className="flex h-22 shrink-0 items-center gap-4 rounded-b-2xl bg-white px-4 lg:px-6 shadow-sm">
      <SidebarTrigger
        className="mr-auto lg:hidden"
        aria-label="Toggle sidebar"
      />
      <h1 className="text-lg font-semibold text-zinc-900 lg:text-xl">
        {title}
      </h1>
      <div className="ml-auto flex items-center gap-2">
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
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setConfirmLogoutOpen(true)}
              >
                <LogOut className="size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ConfirmLogout
        open={confirmLogoutOpen}
        onOpenChange={setConfirmLogoutOpen}
        reloadOnConfirm={false}
        onConfirm={() => {
          logout();
          window.location.replace("/home");
        }}
      />
    </header>
  );
}

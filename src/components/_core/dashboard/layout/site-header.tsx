"use client";

import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useGetUserInfo, getAvatarUrlFromUser } from "@/features/auth/use-get-user-info";
import { UserAvatar } from "../../landing-pages/internship-program/svg";

const pathToTitle: Record<string, string> = {
  "/dashboard-dev": "Dashboard",
  "/dashboard-dev/internship": "Internship Program",
};

function getHeaderTitle(pathname: string): string {
  return (
    pathToTitle[pathname] ??
    pathToTitle[pathname.replace(/\/$/, "")] ??
    "Dashboard"
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const title = getHeaderTitle(pathname);
  const { data: userInfo } = useGetUserInfo();
  const avatarUrl = getAvatarUrlFromUser(userInfo ?? null);

  return (
    <header className="flex h-22 shrink-0 items-center gap-4 rounded-b-2xl bg-white px-4 md:px-6 shadow-sm">
      <SidebarTrigger
        className="mr-auto md:hidden"
        aria-label="Toggle sidebar"
      />
      <h1 className="text-lg font-semibold text-zinc-900 md:text-xl">
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
          <button
            type="button"
            aria-label="Menu"
            className="flex items-center justify-end rounded-xl  px-1 py-2 text-zinc-600"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MobileDrawer from "../navbar/mobile-drawer";
import { ConfirmLogout } from "../navbar/confirm-logout";
import { useAuthStore } from "@/store/auth-store";
import {
  useGetUserInfo,
  getAvatarUrlFromUser,
} from "@/features/auth/use-get-user-info";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "../../internship-program/svg";
import { SalesBanner } from "../navbar/sales-banner";
import { MoreDropdown } from "../navbar/more-dropdown";

const ABOUT_SECTION_PREFIXES = [
  "/about",
  "/team",
  "/pricing-plan",
  "/project-contributors",
  "/faqs",
  "/contact",
  "/privacy",
] as const;

function isAboutSectionActive(pathname: string) {
  return ABOUT_SECTION_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

const linkClass = (isActive: boolean) =>
  cn(
    "text-sm text-white transition-colors relative pb-0.5",
    "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-white after:transition-[width] after:duration-300 after:ease-out",
    isActive ? "after:w-full" : "after:w-0 hover:after:w-full",
    "hover:text-white/90",
  );

/** White “More Program” trigger on teal bar — styling lives here only (no shared navbar edits). */
function MoreProgramOnTealNav() {
  return (
    <MoreDropdown
      showWhiteNav={false}
      className="[&_button]:text-white! [&_button:hover]:text-white/90!"
    />
  );
}

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [useGlassNav, setUseGlassNav] = useState(false);
  const navBarRef = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { data: userInfo } = useGetUserInfo();
  const avatarUrl = getAvatarUrlFromUser(userInfo ?? null);

  const isLoggedIn = user != null;
  const isInternshipProgramRoute =
    pathname === "/internship" ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/internship");

  const showSalesBanner =
    !pathname.startsWith("/internship/") && !pathname.startsWith("/payment");

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const updateGlass = () => {
      const h = navBarRef.current?.getBoundingClientRect().height ?? 96;
      const threshold = Math.max(4, Math.round(h * 0.92));
      setUseGlassNav(window.scrollY >= threshold);
    };
    updateGlass();
    window.addEventListener("scroll", updateGlass, { passive: true });
    window.addEventListener("resize", updateGlass);
    return () => {
      window.removeEventListener("scroll", updateGlass);
      window.removeEventListener("resize", updateGlass);
    };
  }, []);

  const navLinks: { label: string; href: string }[] = [
    { label: "Real World Project", href: "/projects" },
    { label: "Internship Program", href: "/internship" },
  ];

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {showSalesBanner && <SalesBanner />}
      <div className="sticky top-0 left-0 right-0 z-50">
        <nav
          ref={navBarRef}
          className={cn(
            "relative w-full border-b border-t-0! border-primary shadow-sm",
            "transition-[background-color,backdrop-filter,border-b-color,box-shadow] duration-300 ease-out",
            useGlassNav
              ? cn(
                  "border-b-white/25 bg-[#0F4652]/20 backdrop-blur-xl backdrop-saturate-150",
                  "supports-backdrop-filter:bg-[#0F4652]/15",
                  // "[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.12)]",
                )
              : cn(
                  "border-white/15 bg-transparent backdrop-blur-none",
                ),
          )}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-300",
              useGlassNav ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          >
            <div className="absolute -left-[12%] top-1/2 size-[min(55vw,400px)] -translate-y-1/2 rounded-full bg-white/6 blur-3xl" />
            <div className="absolute right-[8%] top-0 size-[min(38vw,260px)] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute right-[28%] -bottom-1/4 size-[min(42vw,220px)] rounded-full bg-cyan-200/5 blur-3xl" />
          </div>

          <div className="app-width relative z-10">
            <div className="flex h-25 items-center justify-between gap-3">
              <Link href="/home" className="flex shrink-0 items-center gap-2 bg-primary/15 p-2 rounded">
                <Image
                  src="/logo-white.svg"
                  height={26}
                  width={182}
                  alt="Amdari"
                  className="h-6 w-auto"
                />
              </Link>

              <div className="hidden items-center gap-6 lg:flex xl:gap-10">
                <Link
                  href="/about"
                  className={linkClass(isAboutSectionActive(pathname))}
                >
                  About Us
                </Link>
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/internship"
                      ? isInternshipProgramRoute
                      : link.href !== "#" && pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={linkClass(isActive)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <MoreProgramOnTealNav />
              </div>

              <div className="hidden shrink-0 items-center gap-3 lg:flex">
                {isLoggedIn ? (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="https://www.amdari.io/dashboard"
                          className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-white/15 transition-colors hover:bg-white/25 xl:size-12"
                          aria-label="Profile"
                        >
                          {avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt="Profile"
                              width={48}
                              height={48}
                              className="size-full object-cover"
                              unoptimized={avatarUrl.startsWith("http")}
                            />
                          ) : (
                            <UserAvatar />
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Go to Dashboard</p>
                      </TooltipContent>
                    </Tooltip>
                    <button
                      type="button"
                      onClick={() => setConfirmLogoutOpen(true)}
                      className="group flex h-11 w-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#B6CFD4] text-[#0f4d5a] transition-[width,color] duration-200 hover:bg-[#FAC5C5] hover:px-3 xl:h-12 xl:w-12"
                      aria-label="Log out"
                    >
                      <LogOut className="size-5 shrink-0 group-hover:hidden" />
                      <span className="hidden whitespace-nowrap text-[8px] font-semibold text-[#EF4444] group-hover:inline">
                        Logout
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/sign-in">
                      <Button
                        variant="outline"
                        className="h-10 rounded-full border-white bg-transparent px-8 text-white hover:bg-white/10 hover:text-white xl:h-11 xl:px-12"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button className="h-11 rounded-full border-0 bg-white px-8 text-[#0F4652] hover:bg-white/90 xl:h-12 xl:px-12">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 text-white transition-colors hover:text-white/80 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-6" />
              </button>
            </div>
          </div>
        </nav>
      </div>

      <MobileDrawer
        isDrawerOpen={isDrawerOpen}
        onClose={closeDrawer}
        navLinks={[{ label: "About Us", href: "/about" }, ...navLinks]}
        isLoggedIn={isLoggedIn}
        onLogoutClick={() => {
          closeDrawer();
          setConfirmLogoutOpen(true);
        }}
      />

      <ConfirmLogout
        open={confirmLogoutOpen}
        onOpenChange={setConfirmLogoutOpen}
        onConfirm={logout}
      />
    </>
  );
};

export default Navbar;

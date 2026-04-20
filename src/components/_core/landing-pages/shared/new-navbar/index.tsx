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

const linkClass = (isActive: boolean, useWhiteText: boolean) =>
  cn(
    "text-sm transition-colors relative pb-0.5",
    "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-current after:transition-[width] after:duration-300 after:ease-out",
    isActive ? "after:w-full" : "after:w-0 hover:after:w-full",
    useWhiteText
      ? "text-white hover:text-white/90"
      : "text-primary hover:text-[#0f4d5a]",
  );

/** White “More Program” trigger on teal bar — styling lives here only (no shared navbar edits). */
function MoreProgramOnTealNav({ showWhiteNav }: { showWhiteNav: boolean }) {
  return (
    <MoreDropdown
      showWhiteNav={showWhiteNav}
      className={
        showWhiteNav
          ? "[&_button]:text-primary! [&_button:hover]:text-[#0f4d5a]!"
          : "[&_button]:text-white! [&_button:hover]:text-white/90!"
      }
    />
  );
}

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [useGlassNav, setUseGlassNav] = useState(false);
  const [isPastHomeHero, setIsPastHomeHero] = useState(false);
  const navBarRef = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { data: userInfo } = useGetUserInfo();
  const avatarUrl = getAvatarUrlFromUser(userInfo ?? null);

  const isLoggedIn = user != null;
  const isHomePageRoute = pathname === "/home";
  const shouldStickNav = !isHomePageRoute || isPastHomeHero;
  const shouldUseScrolledNavStyles = isHomePageRoute
    ? shouldStickNav
    : useGlassNav;
  const showWhiteNav = useGlassNav && shouldStickNav;
  const logoImg = shouldUseScrolledNavStyles
    ? "/logo.svg"
    : isHomePageRoute
      ? "/logo-white.svg"
      : "/logo.svg";
  const useWhiteNavLinkText = isHomePageRoute && !shouldUseScrolledNavStyles;
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

  useEffect(() => {
    if (!isHomePageRoute) {
      setIsPastHomeHero(true);
      return;
    }

    const updateStickyState = () => {
      const hero = document.getElementById("home-hero-section");
      if (!hero) {
        setIsPastHomeHero(false);
        return;
      }
      const navHeight = navBarRef.current?.getBoundingClientRect().height ?? 0;
      const heroTop = window.scrollY + hero.getBoundingClientRect().top;
      const heroBottom = heroTop + hero.getBoundingClientRect().height;
      setIsPastHomeHero(window.scrollY >= heroBottom - navHeight);
    };

    updateStickyState();
    window.addEventListener("scroll", updateStickyState, { passive: true });
    window.addEventListener("resize", updateStickyState);
    return () => {
      window.removeEventListener("scroll", updateStickyState);
      window.removeEventListener("resize", updateStickyState);
    };
  }, [isHomePageRoute]);

  const navLinks: { label: string; href: string }[] = [
    { label: "Real World Project", href: "/projects" },
    { label: "Internship Program", href: "/internship" },
  ];

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* {showSalesBanner && <SalesBanner />} */}
      <div
        className={cn(
          "top-0 left-0 right-0 z-50 -mt-px",
          shouldStickNav ? "sticky" : "relative",
        )}
      >
        <nav
          ref={navBarRef}
          className={cn(
            "relative w-full mt-0 border-b border-t-0 shadow-sm",
            "transition-[background-color,backdrop-filter,border-b-color,box-shadow,color] duration-300 ease-out",
            showWhiteNav
              ? cn(
                  "border-gray-200 bg-white text-primary backdrop-blur-none",
                )
              : cn(
                  "border-transparent bg-transparent text-white backdrop-blur-none",
                ),
          )}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-300",
              useGlassNav ? "opacity-0" : "opacity-100",
            )}
            aria-hidden
          >
            <div className="absolute -left-[12%] top-1/2 size-[min(55vw,400px)] -translate-y-1/2 rounded-full bg-white/6 blur-3xl" />
            <div className="absolute right-[8%] top-0 size-[min(38vw,260px)] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute right-[28%] -bottom-1/4 size-[min(42vw,220px)] rounded-full bg-cyan-200/5 blur-3xl" />
          </div>

          <div className="app-width relative z-10">
            <div className="flex h-20 lg:h-25 items-center justify-between gap-3">
              <Link
                href="/home"
                className={cn(
                  "flex shrink-0 items-center gap-2 p-2 rounded",
                    shouldUseScrolledNavStyles ? "bg-transparent" : "",
                )}
              >
                <Image
                  src={logoImg}
                  height={26}
                  width={182}
                  alt="Amdari"
                  className="h-6 w-auto"
                />
              </Link>

              <div className="hidden items-center gap-6 lg:flex xl:gap-10">
                <Link
                  href="/about"
                  className={linkClass(
                    isAboutSectionActive(pathname),
                    useWhiteNavLinkText,
                  )}
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
                      className={linkClass(isActive, useWhiteNavLinkText)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <MoreProgramOnTealNav showWhiteNav={useGlassNav} />
              </div>

              <div className="hidden shrink-0 items-center gap-3 lg:flex">
                {isLoggedIn ? (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="https://www.amdari.io/dashboard"
                          className={cn(
                            "flex size-11 items-center justify-center overflow-hidden rounded-full transition-colors xl:size-12",
                            shouldUseScrolledNavStyles
                              ? "bg-[#156374] hover:bg-[#156374]/80"
                              : "bg-white/15 hover:bg-white/25",
                          )}
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
                        className={cn(
                          "h-10 rounded-full px-8 xl:h-11 xl:px-12",
                          shouldUseScrolledNavStyles
                            ? "border-[#156374] text-[#156374] bg-white hover:bg-[#156374]/5 hover:border-[#0f4d5a] hover:text-[#0f4d5a]"
                            : "border-white bg-transparent text-white hover:bg-white/10 hover:text-white",
                        )}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button
                        className={cn(
                          "h-11 rounded-full border-0 px-8 xl:h-12 xl:px-12",
                          shouldUseScrolledNavStyles
                            ? "bg-[#156374] text-white hover:bg-amdari-yellow hover:text-primary"
                            : "bg-white text-[#0F4652] hover:bg-white/90",
                        )}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className={cn(
                  "p-2 transition-colors lg:hidden",
                  shouldUseScrolledNavStyles
                    ? "text-[#156374] hover:text-[#0f4d5a]"
                    : "text-white hover:text-white/80",
                )}
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

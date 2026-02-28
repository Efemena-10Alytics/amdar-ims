"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import MobileDrawer from "./mobile-drawer";
import { ConfirmLogout } from "./confirm-logout";
import { useAuthStore } from "@/store/auth-store";
import { useGetUserInfo, getAvatarUrlFromUser } from "@/features/auth/use-get-user-info";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "../../internship-program/svg";
import AboutBar from "../../about/AboutBar";
import { ChevronDown } from "lucide-react";

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  );
}

const Navbr = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const aboutCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAboutCloseTimeout = () => {
    if (aboutCloseTimeoutRef.current) {
      clearTimeout(aboutCloseTimeoutRef.current);
      aboutCloseTimeoutRef.current = null;
    }
  };

  const scheduleAboutClose = () => {
    clearAboutCloseTimeout();
    aboutCloseTimeoutRef.current = setTimeout(() => setAboutDropdownOpen(false), 120);
  };

  useEffect(() => () => clearAboutCloseTimeout(), []);

  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { data: userInfo } = useGetUserInfo();
  const avatarUrl = getAvatarUrlFromUser(userInfo ?? null);

  console.log(avatarUrl);
  const isLoggedIn = user != null;
  const isHomePageRoute = pathname === "/home";
  const isInternshipProgramRoute =
    pathname === "/internship" ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/internship");

  const showWhiteNav = isScrolled || !isHomePageRoute;

  // Track scroll to add white bg on home when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when drawer is open
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

  const navLinks = [
    { label: "Real World Project", href: "/projects" },
    { label: "Internship Program", href: "/internship" },
    { label: "Job Application", href: "/talent-loop" },
    { label: "Hackathon", href: "/hackathon" },
  ];

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  const logoImg = isHomePageRoute ? "/logo.svg" : "/logo.svg";
  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-50 transition-colors duration-300",
          showWhiteNav
            ? "bg-white border-gray-200 border-b"
            : "bg-transparent border-white/20",
        )}
      >
        <div className="app-width">
          <div className="flex gap-2 items-center justify-between h-20">
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-2">
              <Image src={logoImg} height={22} width={154} alt="amdari" />
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-8">
              {/* About dropdown - pt-1 bridges gap so cursor stays inside wrapper when moving to panel */}
              <div
                className="relative"
                onMouseEnter={() => {
                  clearAboutCloseTimeout();
                  setAboutDropdownOpen(true);
                }}
                onMouseLeave={scheduleAboutClose}
              >
                <button
                  type="button"
                  className={cn(
                    "text-sm transition-colors relative pb-0.5 flex items-center gap-0.5",
                    "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-current after:transition-[width] after:duration-300 after:ease-out",
                    aboutDropdownOpen ? "after:w-full" : "after:w-0 hover:after:w-full",
                    showWhiteNav
                      ? "text-[#156374] hover:text-[#0f4d5a]"
                      : "text-primary hover:text-[#0f4d5a]",
                  )}
                  aria-expanded={aboutDropdownOpen}
                  aria-haspopup="true"
                >
                  About
                  <ChevronDown
                    className={cn("size-4 transition-transform", aboutDropdownOpen && "rotate-180")}
                  />
                </button>
                {aboutDropdownOpen && (
                  <AboutBar
                    closeAboutBar={scheduleAboutClose}
                    className="absolute top-full left-0 pt-4 z-50 w-max"
                  />
                )}
              </div>
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/internship"
                    ? isInternshipProgramRoute
                    : link.href !== "#" && pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "text-sm transition-colors relative pb-0.5",
                      "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-current after:transition-[width] after:duration-300 after:ease-out",
                      isActive
                        ? "after:w-full"
                        : "after:w-0 hover:after:w-full",
                      showWhiteNav
                        ? "text-[#156374] hover:text-[#0f4d5a]"
                        : "text-primary hover:text-[#0f4d5a]",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Action Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {isLoggedIn ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="https://www.amdari.io/dashboard"
                        className={cn(
                          "flex size-10 xl:size-11 items-center justify-center rounded-full overflow-hidden transition-colors",
                          "bg-[#156374] hover:bg-[#156374]/80",
                        )}
                        aria-label="Profile"
                      >
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt="Profile"
                            width={44}
                            height={44}
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
                    className={cn(
                      "group flex h-10 xl:h-11 w-10 xl:w-11 items-center justify-center gap-2 rounded-full overflow-hidden transition-[width,color] duration-200 hover:px-3",
                      "bg-[#B6CFD4] text-[#0f4d5a] hover:bg-[#FAC5C5]",
                    )}
                    aria-label="Log out"
                  >
                    <LogOut className="size-5 shrink-0 group-hover:hidden" />
                    <span className="hidden whitespace-nowrap text-[8px] font-semibold group-hover:inline text-[#EF4444]">
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
                        "rounded-full whitespace-nowrap px-10 xl:px-14 xl:h-12",
                        showWhiteNav
                          ? "border-[#156374] text-[#156374] bg-white hover:bg-[#156374]/5 hover:border-[#0f4d5a] hover:text-[#0f4d5a]"
                          : "border-primary text-primary bg-transparent hover:border-amdari-yellow",
                      )}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button
                      className={cn(
                        "rounded-full whitespace-nowrap px-10 border-0 xl:h-12",
                        showWhiteNav
                          ? "bg-[#156374] text-white hover:bg-amdari-yellow hover:text-primary"
                          : "bg-white text-[#156374] hover:bg-amdari-yellow hover:text-primary",
                      )}
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger Menu - Mobile */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={cn(
                "lg:hidden p-2 transition-colors",
                showWhiteNav
                  ? "text-[#156374] hover:text-[#0f4d5a]"
                  : "text-primary hover:text-white/80",
              )}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

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

export default Navbr;

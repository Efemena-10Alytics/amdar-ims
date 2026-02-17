"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import MobileDrawer from "./mobile-drawer";
import { ConfirmLogout } from "./confirm-logout";
import { useAuthStore } from "@/store/auth-store";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "../../internship-program/svg";

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
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const isLoggedIn = user != null;
  const isHomePageRoute = pathname === "/home";
  const isInternshipProgramRoute =
    pathname === "/internship-program" ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/internship-program");

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
    { label: "About Us", href: "#" },
    { label: "Real World Project", href: "#" },
    { label: "Internship Program", href: "/internship-program" },
    { label: "More Program", href: "#" },
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
        <div className="max-w-325 w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 items-center justify-between h-20">
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-2">
              <Image src={logoImg} height={22} width={154} alt="amdari" />
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-8">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/internship-program"
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
                          "flex size-10 xl:size-11 items-center justify-center rounded-full transition-colors",
                          "bg-[#156374] hover:bg-[#156374]/80",
                        )}
                        aria-label="Profile"
                      >
                        <UserAvatar />
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
        navLinks={navLinks}
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

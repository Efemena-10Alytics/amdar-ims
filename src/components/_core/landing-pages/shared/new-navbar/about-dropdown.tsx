"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import AboutBar from "../../about/AboutBar";

const ABOUT_SECTION_PREFIXES = [
  "/about",
  "/team",
  "/pricing-plan",
  "/project-contributors",
  "/faqs",
  "/contact",
  "/privacy",
] as const;

const isAboutSectionActive = (pathname: string) =>
  ABOUT_SECTION_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

interface AboutDropdownProps {
  pathname: string;
  useWhiteNavLinkText: boolean;
  linkClass: (isActive: boolean, useWhiteText: boolean) => string;
}

const AboutDropdown = ({
  pathname,
  useWhiteNavLinkText,
  linkClass,
}: AboutDropdownProps) => {
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const aboutCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearAboutCloseTimeout = () => {
    if (aboutCloseTimeoutRef.current) {
      clearTimeout(aboutCloseTimeoutRef.current);
      aboutCloseTimeoutRef.current = null;
    }
  };

  const scheduleAboutClose = () => {
    clearAboutCloseTimeout();
    aboutCloseTimeoutRef.current = setTimeout(
      () => setAboutDropdownOpen(false),
      120,
    );
  };

  useEffect(() => () => clearAboutCloseTimeout(), []);

  return (
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
          linkClass(
            isAboutSectionActive(pathname) || aboutDropdownOpen,
            useWhiteNavLinkText,
          ),
          "flex items-center gap-1",
        )}
        aria-expanded={aboutDropdownOpen}
        aria-haspopup="true"
      >
        About Us
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            aboutDropdownOpen && "rotate-180",
          )}
        />
      </button>
      {aboutDropdownOpen && (
        <AboutBar
          closeAboutBar={scheduleAboutClose}
          className="absolute top-full left-0 z-50 w-max pt-4"
        />
      )}
    </div>
  );
};

export default AboutDropdown;

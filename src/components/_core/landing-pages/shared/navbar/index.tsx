"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import MobileDrawer from "./mobile-drawer";

const Navbr = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-325 w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image src={"/logo.svg"} height={22} width={154} alt="amdari" />
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-[#156374] hover:text-[#0f4d5a] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Action Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                className={cn(
                  "border-[#156374] text-[#156374] bg-white hover:bg-[#156374]/5 rounded-full whitespace-nowrap px-10",
                  "hover:border-[#0f4d5a] hover:text-[#0f4d5a]",
                )}
              >
                Login
              </Button>
              <Button
                className={cn(
                  "bg-[#156374] text-white hover:bg-[#0f4d5a] rounded-full whitespace-nowrap px-10",
                  "border-0",
                )}
              >
                Get Started
              </Button>
            </div>

            {/* Hamburger Menu - Mobile */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden p-2 text-[#156374] hover:text-[#0f4d5a] transition-colors"
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
      />
    </>
  );
};

export default Navbr;

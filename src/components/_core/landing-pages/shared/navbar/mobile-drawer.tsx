"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface MobileDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ label: string; href: string }>;
  isLoggedIn?: boolean;
  onLogoutClick?: () => void;
}

const MobileDrawer = ({
  isDrawerOpen,
  onClose,
  navLinks,
  isLoggedIn = false,
  onLogoutClick,
}: MobileDrawerProps) => {
  const pathname = usePathname();
  return (
    <>
      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-60 transform transition-transform duration-300 ease-in-out lg:hidden",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col justify-between h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-xl font-semibold text-[#156374]">Menu</span>
            <button
              onClick={onClose}
              className="p-2 text-[#156374] hover:text-[#0f4d5a] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto p-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive =
                  link.href !== "#" && pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "text-base font-medium transition-colors py-2 relative",
                      isActive && "underline underline-offset-4",
                      "text-[#156374] hover:text-[#0f4d5a]",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Buttons */}
            <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-gray-200 mb-10">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-pink-100 text-[#156374] hover:bg-pink-200 transition-colors"
                  >
                    <User className="size-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogoutClick?.();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-teal-100 text-[#0f4d5a] hover:bg-teal-200 transition-colors font-medium"
                  >
                    <LogOut className="size-5" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/sign-in">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className={cn(
                        "w-full border-[#156374] text-[#156374] bg-white hover:bg-[#156374]/5",
                        "hover:border-[#0f4d5a] hover:text-[#0f4d5a]",
                      )}
                    >
                      Login
                    </Button>
                  </Link>

                  <Link href="/auth/sign-up">
                    <Button
                      onClick={onClose}
                      className={cn(
                        "w-full bg-[#156374] text-white hover:bg-amdari-yellow hover:text-primary",
                        "border-0",
                      )}
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;

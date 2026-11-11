"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Aos from "aos";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

/** The careers page asks for the internship, not for an account. */
const CAREERS_COPY = {
  heading: "Ready to Build Experience That Employers Value?",
  tagline:
    "Join Amdari and start working on projects that help you grow your skills, strengthen your portfolio, and prepare for your next career opportunity.",
  ctaHref: "/internship",
  ctaLabel: "Apply for an Internship",
};

const CTAbanner = () => {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const isCareers = pathname === "/hr-job-listing";

  const heading = isCareers
    ? CAREERS_COPY.heading
    : "Ready To Get the job you always wanted?";
  const tagline = isCareers
    ? CAREERS_COPY.tagline
    : "Start here - with a career experience Internship";
  const ctaHref = isCareers
    ? CAREERS_COPY.ctaHref
    : user != null
      ? "/dashboard"
      : "/auth/sign-up";
  const ctaLabel = isCareers
    ? CAREERS_COPY.ctaLabel
    : user != null
      ? "Go to dashboard"
      : "Create an account";

  React.useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);
  return (
    <div data-aos="zoom-in" className="app-width pt-12 lg:pt-16 pb-8">
      <div className="bg-[#156374] rounded-2xl p-8 lg:p-12 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Section - Headline & Tagline */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 leading-tight">
              {heading}
            </h2>
            <p className="text-lg sm:text-xl text-white/90">{tagline}</p>
          </div>

          {/* Right Section - CTA Text & Button */}
          <div className="flex flex-col items-start lg:items-end gap-4 lg:text-right">
            <div>
              <p className="text-base sm:text-lg font-medium mb-2">
                Apply for AMDARI Internship Now
              </p>
              <p className="text-sm sm:text-base text-white/80">
                Your future hiring manager will thank you
              </p>
            </div>
            <Button
              asChild
              className={cn(
                "bg-amdari-yellow text-[#156374] hover:bg-amdari-yellow/90",
                "rounded-full px-6 py-6 text-base font-medium",
                "flex items-center gap-2",
              )}
            >
              <Link href={ctaHref}>
                {ctaLabel}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAbanner;

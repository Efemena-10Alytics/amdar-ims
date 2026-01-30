"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Aos from "aos";
import { ArrowRight } from "lucide-react";

const CTAbanner = () => {
  React.useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);
  return (
    <div data-aos="zoom-in" className="max-w-325  mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-8">
      <div className="bg-[#156374] rounded-2xl p-8 lg:p-12 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Section - Headline & Tagline */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 leading-tight">
              Ready To Get the job you always wanted?
            </h2>
            <p className="text-lg sm:text-xl text-white/90">
              Start here - with a career experience Internship
            </p>
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
              className={cn(
                "bg-amdari-yellow text-[#156374] hover:bg-amdari-yellow/90",
                "rounded-full px-6 py-6 text-base font-medium",
                "flex items-center gap-2",
              )}
            >
              Create an account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAbanner;

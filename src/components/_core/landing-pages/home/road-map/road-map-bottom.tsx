"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ToolsSlider from "./tools-slider";
import Aos from "aos";

const RoadMapBottom = () => {
  // Technology icons - placeholder for now, you can replace with actual icons
  React.useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div className="bg-[#092A31] py-12 lg:py-20 relative overflow-hidden">
      <div data-aos="fade-up" className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side */}
          <div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-8 leading-tight">
              Learn New Tools and Technology from Experts
            </h2>

            {/* Technology Icons Row */}
            <ToolsSlider />
          </div>

          {/* Right Side */}
          <div>
            <p className="text-white text-base lg:text-lg leading-relaxed mb-6">
              Work on projects to gain expertise in new tools and technologies
              through expert-guided instruction and carefully curated project
              videos.
            </p>

            <Button
              className={cn(
                "bg-amdari-yellow text-[#092A31] hover:bg-amdari-yellow/90",
                "rounded-full px-6 py-6 text-base font-medium",
                "inline-flex items-center gap-2 w-fit",
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

export default RoadMapBottom;

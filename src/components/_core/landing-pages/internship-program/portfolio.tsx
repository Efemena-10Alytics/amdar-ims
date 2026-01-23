"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const Portfolio = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white py-12 lg:py-20 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left Section - Promotional Content */}
        <div className="bg-[#E8EFF1] flex-1 p-6 lg:p-12 flex flex-col justify-">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#092A31] mb-6 leading-tight">
            Build a Professional Portfolio Website
          </h2>
          <p className="text-[#092A31]/70 text-base lg:text-lg mb-8 leading-relaxed">
            Showcase your experience, projects and proficiency level with our
            portfolio builder to stand out in the competitive tech landscape.
          </p>
          <Button
            className={cn(
              "bg-primary text-white hover:bg-[#0f4d5a] rounded-full px-8 py-6 text-base",
              "inline-flex items-center gap-2 w-fit justify-center",
            )}
          >
            Create your portfolio
            <div className="flex h-5 w-5 rounded-full justify-center items-center bg-amdari-yellow">
              <ArrowUpRight className="w-3 h-3" color="#156374" />
            </div>
          </Button>
        </div>

        {/* Right Section - Laptop Display */}
        <div className="relative flex-1">
          <div className="relative w-full h-[400px] lg:h-[600px]">
            {!imageError ? (
              <Image
                src="/images/pngs/laptop.png"
                alt="Portfolio website on laptop"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Portfolio Preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

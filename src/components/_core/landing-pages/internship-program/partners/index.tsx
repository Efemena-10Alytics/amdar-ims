"use client";

import React, { useState } from "react";
import Image from "next/image";
import LogoSlider from "./logo-slider";

const Partners = () => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  

  return (
    <div className="bg-[#F8FAFB] py-12 lg:py-20 mt-10 relative overflow-hidden">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-1/2 w-32 h-32 bg-primary rounded-lg transform -translate-x-1/2" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-primary rounded-lg" />
        <div className="absolute bottom-32 left-1/2 w-28 h-28 bg-primary rounded-lg transform -translate-x-1/2" />
      </div>

      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Heading */}
          <div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#092A31] leading-tight mb-6">
              Businesses We Have Partnered With
            </h2>
          </div>

          {/* Description */}
          <div className="flex items-start">
            <p className="text-[#092A31]/80 text-base lg:text-lg leading-relaxed">
              Amdari collaborates with a growing network of forward-thinking
              businesses, SMEs, and digital-first organizations in the UK, US
              and Canada to source real business challenges that power our
              internship projects.
            </p>
          </div>
        </div>

        {/* Partner Logos */}
        <LogoSlider />
      </div>
    </div>
  );
};

export default Partners;

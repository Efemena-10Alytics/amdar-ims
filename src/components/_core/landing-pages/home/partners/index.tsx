"use client";

import React from "react";
import LogoSlider from "./logo-slider";
import Aos from "aos";

const Partners = () => {
  React.useEffect(() => {
    Aos.init();
  }, []);
  return (
    <div data-aos="fade-up" className="bg-[#F8FAFB] min-h-150 py-12 lg:py-20 relative overflow-hidden">
      {/* Ellipse Overlay */}
      <div
        className="absolute inset-0 z-1"
        style={{
          backgroundImage: "url(/images/svgs/partners-ellipse.svg)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

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

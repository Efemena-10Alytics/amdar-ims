"use client";

import React from "react";
import Image from "next/image";
import Aos from "aos";
import CustomButton from "../shared/custom-button";

const Portfolio = () => {
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div data-aos="fade-up" className="bg-white relative overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left Section - Promotional Content */}

        <div className="flex-1 bg-[#E8EFF1]">
          <div className="flex flex-col w-full max-w-146 lg:mx-auto px-6 xl:px-0 py-10">
            <h2
              data-aos="zoom-in"
              className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#092A31] mb-6 leading-tight"
            >
              Build a Professional Portfolio Website
            </h2>
            <p
              data-aos="zoom-out"
              className="text-[#092A31]/70 text-base lg:text-lg mb-8 leading-relaxed"
            >
              Showcase your experience, projects and proficiency level with our
              portfolio builder to stand out in the competitive tech landscape.
            </p>
            <CustomButton btnText="Create your portfolio" />
          </div>
        </div>

        {/* Right Section - Laptop Display */}
        <div className="relative flex-1">
          <div className="relative w-full h-100 lg:h-150">
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

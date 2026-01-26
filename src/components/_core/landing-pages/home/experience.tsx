import React from "react";
import Image from "next/image";

const Experience = () => {
  return (
    <div className="py-12 lg:py-20 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/images/pngs/yellow-noise.png)",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      />

      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Headline Section */}
        <div className="text-center max-w-211 mx-auto">
          <h2 className="text-4xl lg:text-[52px] font-bold text-[#092A31] leading-14 sm:leading-16">
            We Have Worked With Over {" "}
            <span className="text-primary font-extrabold">
              10,000+
            </span>{" "}
            Tech Professionals
          </h2>
        </div>

        {/* Tech Professionals Image Collage */}
        <div className="relative w-full">
          <div className="relative w-full aspect-16/10 lg:aspect-video">
            <Image
              src="/images/pngs/tech-professionals.png"
              alt="Tech professionals community"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;

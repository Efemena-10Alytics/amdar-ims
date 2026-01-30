"use client";
import { useEffect } from "react";
import Aos from "aos";
import CustomButton from "../shared/custom-button";

const CareerNeeds = () => {
  const benefits = [
    {
      title: "Real-World Project Experience",
      description:
        "Work on structured projects that based on actual workplace delivery.",
    },
    {
      title: "Job-Ready CV & LinkedIn Optimization",
      description:
        "Turn your experience into recruiter-friendly CVs and LinkedIn profiles.",
    },
    {
      title: "Interview Preparation & Mock Interviews",
      description: "Practice real interview scenarios with expert feedback.",
    },
    {
      title: "Access to Global & Remote Job Opportunities",
      description:
        "Apply smarter with roles aligned to your skills and experience.",
    },
  ];

  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div className="bg-white min-h-dvh py-12 lg:py-20 relative">
      {/* Ellipse Overlay - overflow only here so sticky isn't affected */}
      <div
        className="absolute inset-0 z-1 overflow-hidden"
        style={{
          backgroundImage: "url(/images/svgs/testimonial-ellipse.svg)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="relative max-w-325 mx-auto px-4 sm:px-6 lg:px-8 z-10 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start min-w-0">
          {/* Left Column - Heading and CTA (sticky while right column scrolls) */}
          <div className="flex flex-col justify-center lg:sticky lg:top-20 lg:self-start min-w-0 overflow-x-hidden">
            <h2
              data-aos="zoom-in"
              data-aos-duration="500"
              className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#092A31] leading-tight"
            >
              Everything your Tech Career Needs
            </h2>
            <p
              data-aos="zoom-in"
              data-aos-duration="800"
              className="text-[#092A31]/70 text-base lg:text-lg mb-8 leading-relaxed"
            >
              We know job hunting is tough—complex, competitive, and
              overwhelming. That's why we built Amdari to help you access
              opportunities easily
            </p>
            <CustomButton btnText="Apply now" />
          </div>

          {/* Right Column - Benefits List (overflow here doesn't affect sticky) */}
          <div className="flex flex-col gap-6 mt-24 min-w-0 overflow-x-hidden">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col gap-2"
                data-aos="fade-left"
                data-aos-delay={index * 100}
                data-aos-duration="500"
              >
                <h3 className="text-lg lg:text-xl font-bold text-[#092A31]">
                  {benefit.title}
                </h3>
                <p className="w-2/3 text-[#092A31]/70 text-sm lg:text-base leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerNeeds;

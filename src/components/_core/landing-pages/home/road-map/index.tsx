import React from "react";
import { cn } from "@/lib/utils";
import RoadMapBottom from "./road-map-bottom";

const RoadMap = () => {
  const steps = [
    { number: 1, text: "Create an Account", side: "left" },
    { number: 2, text: "Explore our Services", side: "right" },
    { number: 3, text: "Apply for any of them", side: "left" },
    { number: 4, text: "Access Resources", side: "right" },
    { number: 5, text: "Start Building Experience", side: "left" },
    { number: 6, text: "Build a Portfolio Website", side: "right" },
    { number: 7, text: "Apply for Job remotely", side: "left" },
    { number: 8, text: "Land the Job", side: "right" },
  ];

  return (
    <>
      <div className="bg-[#092A31] py-12 lg:py-20 relative overflow-hidden">
        {/* Background Texture */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: "url(/images/pngs/yellow-noise.png)",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        />

        <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Title Section */}
          <div data-aos="zoom-in" className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2">
              Go from Learner to Earner
            </h2>
            <p className="text-xl lg:text-2xl font-bold text-white">
              Using Amdari Road Map
            </p>
          </div>

          {/* Roadmap Steps */}
          <div className="relative max-w-5xl mx-auto">
            {/* Steps Grid Container - wrapper to ensure line spans full height */}
            <div className="relative">
              {/* Central Yellow Line - 4 broken segments */}
              <div className="hidden lg:flex flex-col gap-1 h-full absolute left-1/2 top-0 bottom-0 w-2 transform -translate-x-1/2 z-0">
                <div className="bg-amdari-yellow h-1/2" />
                <div className="bg-amdari-yellow h-1/2" />
                <div className="bg-amdari-yellow h-1/2" />
                <div className="bg-amdari-yellow h-1/2" />
              </div>

              {/* Steps Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
                {/* Left Column Steps */}
                <div className="flex flex-col gap-6 lg:gap-8">
                  {steps
                    .filter((step) => step.side === "left")
                    .map((step) => (
                      <div
                        data-aos={`fade-${step.side}`}
                        key={step.number}
                        className="lg:pr-6"
                      >
                        {/* Step Box */}
                        <div className="bg-[#0F4652] rounded-l-xl p-4 lg:p-6 flex items-center gap-4">
                          {/* Number Badge */}
                          <div className="shrink-0">
                            <div className="w-8 h-8 rounded-full bg-[#156374] flex items-center justify-center">
                              <span className="text-white text-lg">
                                {step.number}
                              </span>
                            </div>
                          </div>

                          {/* Step Text */}
                          <div className="flex-1">
                            <p className="text-white text-base lg:text-lg">
                              {step.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Right Column Steps */}
                <div className="flex flex-col gap-6 lg:gap-8 lg:mt-12">
                  {steps
                    .filter((step) => step.side === "right")
                    .map((step) => (
                      <div
                        data-aos={`fade-${step.side}`}
                        key={step.number}
                        className="lg:pl-6"
                      >
                        {/* Step Box */}
                        <div className="bg-[#0F4652] rounded-r-xl p-4 lg:p-6 flex items-center gap-4">
                          {/* Number Badge */}
                          <div className="shrink-0">
                            <div className="w-8 h-8 rounded-full bg-[#156374] flex items-center justify-center">
                              <span className="text-white text-lg">
                                {step.number}
                              </span>
                            </div>
                          </div>

                          {/* Step Text */}
                          <div className="flex-1">
                            <p className="text-white text-base lg:text-lg font-medium">
                              {step.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RoadMapBottom />
    </>
  );
};

export default RoadMap;

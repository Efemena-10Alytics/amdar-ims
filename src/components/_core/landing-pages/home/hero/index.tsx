"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ServiceCard from "./service-card";
import { ArrowUpRight, PlayIcon } from "lucide-react";
import Slider from "./slider";
import WordDrop from "./word-drop";
import Aos from "aos";
import Flag from "./flag";
import Link from "next/link";

const InternshipHero = () => {
  React.useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);

  return (
    <div className="text-white relative overflow-hidden">
      {/* Primary Color Background */}
      <div className="absolute inset-0 bg-primary z-0" />
      {/* Ellipse Overlay */}
      <div
        className="absolute inset-0 z-1"
        style={{
          backgroundImage: "url(/images/svgs/hero-ellipse.svg)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      {/* Hero Section */}
      <div className="relative z-10 max-w-325 mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 lg:py-24">
        <div className="text-center max-w-202.5 mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-semibold mb-6 leading-12 md:leading-16">
            <WordDrop />
            <br />
            {/* Carousel */}
            <h1 className="inline-block overflow-hidden h-[1.2em] relative align-middle">
              <Slider />
            </h1>
          </h1>

          {/* Description */}
          <p
            data-aos="zoom-in"
            className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-10"
          >
            Join the Work Experience Platform Trusted by Aspiring Tech
            Professionals Worldwide to Build Real-World Experience and Land Your
            Dream Job
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              className={cn(
                "group bg-[#0F4652] text-white hover:bg-amdari-yellow hover:text-primary rounded-full py-6 h-12 text-base",
                "flex items-center gap-8 px-5",
                "transition-colors duration-300",
              )}
            >
              Get started
              <div className="flex h-5 w-5 rounded-full justify-center items-center bg-amdari-yellow group-hover:bg-primary text-primary group-hover:text-white">
                <ArrowUpRight className="w-3! h-3! text-current" />
              </div>
            </Button>
            <Button
              className={cn(
                "group bg-[#448290] hover:bg-[#0F4652] text-white rounded-full h-12 py-6 text-base",
                "flex items-center gap-8 px-5",
                "transition-colors duration-300",
              )}
            >
              Learn more
              <div className="group-hover:bg-amdari-yellow flex h-5 w-5 rounded-full justify-center items-center bg-white border-2 border-gray-300 text-primary">
                <PlayIcon
                  className="w-3! h-3!"
                  color="#156374"
                  fill="#156374"
                />
              </div>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <Flag />
            <span className="text-white/80">
              + 10K interns Across the world Got hired
            </span>
          </div>
        </div>
      </div>

      {/* Service Cards Section */}
      <div className="relative z-10 max-w-325 mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <ServiceCard
            title="Real-world Projects"
            description="Industry-relevant projects that replicate real-world challenges, helping you build practical skills."
            buttonText="Get me started"
            dataAos="fade-up"
            dataAosDuration="600"
          />
          <ServiceCard
            title="Work Experience Internship"
            description="Work experience internship with businesses that will connect you with global work opportunities and mentorship"
            buttonText="Apply now"
            dataAos="fade-up"
            dataAosDuration="1000"
          />
          <ServiceCard
            title="Interview Prep"
            description="We help you prepare for interviews by revamping your CV and coaching you on acing technical questions."
            buttonText="I need this"
            dataAos="fade-up"
            dataAosDuration="1200"
          />
        </div>
      </div>
    </div>
  );
};

export default InternshipHero;

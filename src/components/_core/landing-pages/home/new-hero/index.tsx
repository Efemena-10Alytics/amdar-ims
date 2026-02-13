"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Lightbulb, PlayIcon } from "lucide-react";
import Flag from "../hero/flag";
import React from "react";
import LearnMoreVideo from "../learn-more-video";
import Image from "next/image";
import Aos from "aos";
import VerticalCarousel from "./vertical-carousel";
import Slider from "../hero/slider";

const HERO_TOOLS = [
  {
    src: "/images/svgs/tools/sales-force.svg",
    alt: "Salesforce",
    position: "top-24 left-14 md:right-20 animate-bounce-1",
  },
  {
    src: "/images/svgs/tools/jira.svg",
    alt: "Trello",
    position: "top-1/2 left-18 animate-bounce-6",
  },
  {
    src: "/images/svgs/tools/figma.svg",
    alt: "Figma",
    position: "bottom-0 right-8 md:right-1/4 animate-bounce-2",
  },
  {
    src: "/images/svgs/tools/google-analytics.svg",
    alt: "Analytics",
    position: "top-2/3 right-0 md:-right-1/10 animate-bounce-3",
  },
  {
    src: "/images/svgs/tools/microsoft.svg",
    alt: "Microsoft",
    position: "bottom-16 left-0 animate-bounce-3",
  },
  {
    src: "/images/svgs/tools/trello.svg",
    alt: "Jira",
    position: "top-12 right-0 animate-bounce-5",
  },
  {
    src: "/images/svgs/tools/ubuntu.svg",
    alt: "Trello",
    position: "top-0 right-1/2 animate-bounce-7",
  },
  {
    src: "/images/svgs/tools/notion.svg",
    alt: "Trello",
    position: "top-1/2 right-1/8 animate-bounce-8",
  },
  {
    src: "/images/svgs/tools/ubuntu.svg",
    alt: "Trello",
    position: "-bottom-1/10 right-1/2 animate-bounce-9",
  },
];
export default function NewHero() {
  const [showPopUpVid, setShowPopUpVid] = React.useState(false);
  React.useEffect(() => {
    Aos.init();
  }, []);
  return (
    <div className="relative w-full min-h-screen overflow-hidden -mt-25">
      {/* Section background – new-hero-bg */}
      <div
        className="absolute inset-0 z-0 "
        style={{
          backgroundImage: "url(/images/new-hero/new-hero-bg.svg)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        aria-hidden
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div data-aos="fade-right" className="flex flex-col justify-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FEF9C3] text-[#092A31] px-4 py-2 text-sm font-medium w-fit mb-6">
              <Lightbulb className="w-4 h-4 shrink-0" />
              <span>Get hired in high-demand Tech career</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-bold text-[#092A31] leading-tight mb-5">
              Gain Real Work Experience Through
              <br />
              <h1 className="inline-block overflow-hidden h-[1.2em] relative align-middle">
              <Slider />
            </h1>
            </h1>

            <p className="text-[#64748B] text-base lg:text-lg max-w-xl mb-8 leading-relaxed">
              Join the Work Experience Platform Trusted by Aspiring Tech
              Professionals Worldwide to Build Real-World Experience and Land
              Your Dream Job
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mb-8">
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
                onClick={() => setShowPopUpVid(true)}
                className={cn(
                  "group bg-[#E8EFF1] hover:bg-[#0F4652] text-primary hover:text-amdari-yellow rounded-full h-12 py-6 text-base",
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
            <div className="flex items-center justify-start gap-2 text-sm sm:text-base">
              <Flag />
              <span className="text-[#A1A8B1]">
                + 10K interns Across the world Got hired
              </span>
            </div>
          </div>

          {/* Right content - Image and floating badges */}
          <div className="relative h-96 md:h-full flex items-center justify-center">
            {/* Outer rotating ring - larger */}
            <div
              className="absolute w-125 h-125 md:w-162 md:h-162 rounded-full border-[0.2px] border-[#B6CFD4]/20 animate-ring"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></div>

            {/* Inner rotating ring - smaller, reverse direction */}
            <div
              className="absolute w-80 h-80 md:w-125 md:h-125 rounded-full border-[0.2px] border-[#B6CFD4]/20 animate-ring-reverse"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></div>

            {/* Main circular image - inside the smaller ring */}
            <div
              data-aos="zoom-in"
              className="relative z-10 w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl"
              style={
                {
                  // left: "50%",
                  // top: "50%",
                  // transform: "translate(-50%, -50%)",
                }
              }
            >
              <img
                src="/images/new-hero/new-hero-img.png"
                alt="Person working on laptop"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating tool icons */}
            {HERO_TOOLS.map((tool, i) => (
              <div
                key={i}
                className={cn(
                  "absolute z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center p-1.5 sm:p-2 border border-gray-100",
                  tool.position,
                )}
              >
                <Image
                  src={tool.src}
                  alt={tool.alt}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 sm:mb-16 px-2">
        <div className="relative z-10 max-w-100 rounded-xl">
          <VerticalCarousel className="mx-auto" />
        </div>
      </div>

      <LearnMoreVideo
        setShowPopUpVid={setShowPopUpVid}
        showPopUpVid={showPopUpVid}
      />
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowUpRight, PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import LearnMoreVideo from "../learn-more-video";
import Flag from "../hero/flag";
import Aos from "aos";

const HERO_TOOLS = [
  {
    src: "/images/svgs/tools/sales-force.svg",
    alt: "Salesforce",
    position: "top-1/6 left-1/4 -translate-x-1/2 -translate-y-1/2",
  },
  {
    src: "/images/svgs/tools/figma.svg",
    alt: "Figma",
    position: "top-1/3 right-1/4",
  },
  {
    src: "/images/svgs/tools/google-analytics.svg",
    alt: "Analytics",
    position: "top-1/6 right-1/10",
  },
  {
    src: "/images/svgs/tools/microsoft.svg",
    alt: "Microsoft",
    position: "bottom-1/3 right-1/4",
  },
  {
    src: "/images/svgs/tools/trello.svg",
    alt: "Jira",
    position: "bottom-1/4 left-1/3",
  },
  {
    src: "/images/svgs/tools/jira.svg",
    alt: "Trello",
    position: "top-1/2 left-1/5",
  },
];

const NewHero = () => {
  const [showPopUpVid, setShowPopUpVid] = React.useState(false);
  React.useEffect(() => {
    Aos.init();
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div
        className="absolute inset-0 z-1"
        style={{
          backgroundImage: "url(/images/new-hero/hero-ellipses.svg)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      {/* Circle-line SVG – full section height, centered so right image sits in its center */}
      <div
        className="absolute inset-y-0 right-0 left-0 z-5 pointer-events-none"
        style={{
          backgroundImage: "url(/images/new-hero/circle-line.svg)",
          backgroundPosition: "90% 62%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto 100%",
        }}
        aria-hidden
      />

      {/* Ellipses.svg – right side of section, full height */}
      <div
        className="absolute inset-y-0 right-0 left-0 z-4 pointer-events-none opacity-40"
        style={{
          backgroundImage: "url(/images/new-hero/ellipses.svg)",
          backgroundPosition: "100% 50%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto 100%",
        }}
        aria-hidden
      />

      {/* Right ellipses (bottom-yellow) – full section height */}
      <div
        className="absolute inset-y-0 right-0 bottom-0 z-4 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "url(/images/new-hero/bottom-yellow.svg)",
          backgroundPosition: "75% 50%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto 100%",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-325 mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center min-h-[80vh]">
          {/* Left column */}
          <div data-aos="fade-right" className="flex flex-col justify-center order-2 lg:order-1">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FEF9C3] text-[#092A31] px-4 py-2 text-sm font-medium w-fit mb-6">
              <Lightbulb className="w-4 h-4 shrink-0" />
              <span>Get hired in high-demand Tech career</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-bold text-[#092A31] leading-tight mb-5">
              Gain Real Work Experience Through
              <br />
              <span className="text-primary">Cybersecurity</span>
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

          {/* Right column: circular image + floating icons – shifted so image centers in circle-line */}
          <div className="relative flex items-center justify-center order-1 lg:order-2 min-h-80 lg:min-h-120">
            <div className="relative flex items-center justify-center lg:translate-x-[18%]">
              {/* Central circular image */}
              <div data-aos="zoom-in" className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden ring-4 ring-white/80 shadow-xl shrink-0">
                <Image
                  src="/images/new-hero/new-hero-img.png"
                  alt="Professional at laptop"
                  fill
                  className="object-cover mx-auto"
                  priority
                  sizes="(max-width: 768px) 224px, 320px"
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
      </div>

      <LearnMoreVideo
        setShowPopUpVid={setShowPopUpVid}
        showPopUpVid={showPopUpVid}
      />
    </section>
  );
};

export default NewHero;

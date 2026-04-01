"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, PlayIcon } from "lucide-react";
import Aos from "aos";
import LearnMoreVideo from "../learn-more-video";
import WordDrop from "../hero/word-drop";
import Slider from "../hero/slider";
import Flag from "../hero/flag";
import ServiceCard from "../hero/service-card";

const HERO_FLOATING_ICONS = [
  { src: "/images/svgs/tools/figma.svg", alt: "Figma", sizeClass: "size-12" },
  { src: "/images/svgs/tools/canva.svg", alt: "Canva", sizeClass: "size-14" },
  { src: "/images/svgs/tools/jira.svg", alt: "Jira", sizeClass: "size-12" },
  { src: "/images/svgs/tools/trello.svg", alt: "Trello", sizeClass: "size-13" },
  { src: "/images/svgs/tools/notion.svg", alt: "Notion", sizeClass: "size-12" },
  { src: "/images/svgs/tools/sketch.svg", alt: "Sketch", sizeClass: "size-14" },
  { src: "/images/svgs/tools/photoshop.svg", alt: "Photoshop", sizeClass: "size-14" },
  { src: "/images/svgs/tools/adobe-illustrator.svg", alt: "Adobe Illustrator", sizeClass: "size-12" },
  { src: "/images/svgs/tools/figma.svg", alt: "Figma 2", sizeClass: "size-13" },
  { src: "/images/svgs/tools/canva.svg", alt: "Canva 2", sizeClass: "size-12" },
  { src: "/images/svgs/tools/jira.svg", alt: "Jira 2", sizeClass: "size-14" },
  { src: "/images/svgs/tools/trello.svg", alt: "Trello 2", sizeClass: "size-12" },
  { src: "/images/svgs/tools/notion.svg", alt: "Notion 2", sizeClass: "size-13" },
  { src: "/images/svgs/tools/sketch.svg", alt: "Sketch 2", sizeClass: "size-12" },
  { src: "/images/svgs/tools/photoshop.svg", alt: "Photoshop 2", sizeClass: "size-13" },
  { src: "/images/svgs/tools/adobe-illustrator.svg", alt: "Adobe Illustrator 2", sizeClass: "size-12" },
  { src: "/images/svgs/tools/figma.svg", alt: "Figma 3", sizeClass: "size-14" },
  { src: "/images/svgs/tools/trello.svg", alt: "Trello 3", sizeClass: "size-12" },
  { src: "/images/svgs/tools/canva.svg", alt: "Canva 3", sizeClass: "size-13" },
  { src: "/images/svgs/tools/jira.svg", alt: "Jira 3", sizeClass: "size-12" },
] as const;

const HERO_ORBIT_LAYERS = [
  { name: "outer", radius: 720, duration: 42, angleOffset: 0, direction: "reverse" },
  { name: "inner", radius: 590, duration: 30, angleOffset: 9, direction: "normal" },
] as const;

const InternshipHeroTwo = () => {
    const [showPopUpVid, setShowPopUpVid] = React.useState(false);
  
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
      <div className="pointer-events-none absolute inset-0 z-2 hidden lg:flex items-center justify-center">
        <div className="hero-two-orbit-stage relative h-360 w-[min(calc(100vw-24px),1580px)] max-w-none">
          {HERO_ORBIT_LAYERS.map((layer) => (
            <div
              key={layer.name}
              className="absolute inset-0"
            >
              {HERO_FLOATING_ICONS.map((icon, index) => {
                const angle =
                  (index / HERO_FLOATING_ICONS.length) * 360 + layer.angleOffset;

                return (
                  <div
                    key={`${layer.name}-${icon.alt}`}
                    className="hero-two-orbit-item absolute left-1/2 top-1/2"
                    style={{
                      ["--hero-orbit-angle" as string]: `${angle}deg`,
                      ["--hero-orbit-radius" as string]: `${layer.radius}px`,
                      animationDuration: `${layer.duration}s`,
                      animationDirection: layer.direction,
                    }}
                  >
                    <div
                      className={cn(
                        "hero-two-icon-spin rounded-full border border-white/10 bg-white/8 backdrop-blur-[2px] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
                        icon.sizeClass,
                      )}
                    >
                      <div className="flex size-[62%] items-center justify-center rounded-full bg-white/12">
                        <Image
                          src={icon.src}
                          alt={icon.alt}
                          width={28}
                          height={28}
                          className="h-auto w-[58%] object-contain"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

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
            onClick={() => setShowPopUpVid(true)}
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
            // dataAosDuration="00"
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

      <LearnMoreVideo setShowPopUpVid={setShowPopUpVid} showPopUpVid={showPopUpVid} />
      <style jsx>{`
        .hero-two-orbit-stage {
          transform: translateY(10px);
        }

        .hero-two-orbit-item {
          margin-left: -28px;
          margin-top: -28px;
          animation: hero-two-item-orbit linear infinite;
        }

        .hero-two-icon-spin {
          animation: hero-two-icon-spin 9s linear infinite;
        }

        @keyframes hero-two-item-orbit {
          from {
            transform: rotate(var(--hero-orbit-angle))
              translateY(calc(-1 * var(--hero-orbit-radius)));
          }
          to {
            transform: rotate(calc(var(--hero-orbit-angle) + 360deg))
              translateY(calc(-1 * var(--hero-orbit-radius)));
          }
        }

        @keyframes hero-two-icon-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default InternshipHeroTwo;

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const HERO_TOOLS = [
  {
    src: "/images/svgs/tools/sales-force.svg",
    alt: "Salesforce",
    position: "top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2",
  },
  {
    src: "/images/svgs/tools/figma.svg",
    alt: "Figma",
    position: "top-1/3 right-1/4",
  },
  {
    src: "/images/svgs/tools/google-analytics.svg",
    alt: "Analytics",
    position: "top-1/2 right-1/6",
  },
  {
    src: "/images/svgs/tools/microsoft.svg",
    alt: "Microsoft",
    position: "bottom-1/3 right-1/4",
  },
  {
    src: "/images/svgs/tools/jira.svg",
    alt: "Jira",
    position: "bottom-1/4 left-1/3",
  },
  {
    src: "/images/svgs/tools/trello.svg",
    alt: "Trello",
    position: "top-1/2 left-1/6",
  },
];

const NewHero = () => {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Base: light grey */}
      <div className="absolute inset-0 z-0 bg-[#F5F7FA]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 z-1 opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Soft gradient overlay (light blue-grey to greenish-yellow right/bottom) */}
      <div
        className="absolute inset-0 z-2 pointer-events-none"
        style={{
          background: `
            linear-gradient(135deg, transparent 0%, transparent 50%, rgba(200,220,230,0.25) 100%),
            linear-gradient(180deg, transparent 60%, rgba(240,245,220,0.2) 100%)
          `,
        }}
      />

      <div className="relative z-10 max-w-325 mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center min-h-[80vh]">
          {/* Left column */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
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
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link href="/auth/sign-up">
                <Button className="rounded-full pl-6 pr-4 py-6 h-auto bg-primary hover:bg-primary/90 text-white font-medium gap-2 group">
                  Get started
                  <span className="inline-flex h-8 w-8 rounded-full bg-amdari-yellow text-primary items-center justify-center ml-1 group-hover:bg-amdari-yellow/90">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </Link>
              <Link href="#learn-more">
                <Button
                  variant="outline"
                  className="rounded-full pl-6 pr-4 py-6 h-auto border-primary text-primary bg-transparent hover:bg-primary/5 font-medium gap-2 group"
                >
                  Learn more
                  <span className="inline-flex h-8 w-8 rounded-full bg-[#092A31] text-white items-center justify-center ml-1">
                    <Play className="w-4 h-4" fill="currentColor" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <p className="text-sm text-[#64748B]">
              <span className="inline-block mr-1">🇬🇧</span>
              <span className="inline-block mr-1">🇺🇸</span>+ 30K interns Across
              the world Got hired
            </p>
          </div>

          {/* Right column: circular image + floating icons */}
          <div className="relative flex items-center justify-center order-1 lg:order-2 min-h-80 lg:min-h-120">
            {/* Faint connecting lines / ellipses background */}
            <div
              className="absolute inset-0 z-0 opacity-30"
              style={{
                backgroundImage: "url(/images/new-hero/ellipses.svg)",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            />

            {/* Central circular image */}
            <div className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden ring-4 ring-white/80 shadow-xl shrink-0">
              <Image
                src="/images/new-hero/new-hero-img.png"
                alt="Professional at laptop"
                fill
                className="object-cover"
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
    </section>
  );
};

export default NewHero;

"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import Aos from "aos";
import Flag from "../home/hero/flag";
import { cn } from "@/lib/utils";

type FounderCard = {
  name: string;
  role: string;
  image: string;
};

const founders: FounderCard[] = [
  {
    name: "Efemena Ikpro",
    role: "Co-founder",
    image: "/images/pngs/about/efe.png",
  },
  {
    name: "Omowunmi Samson",
    role: "Co-founder",
    image: "/images/pngs/about/omowunmi.png",
  },
  {
    name: "Adeiza Suleman",
    role: "Co-founder",
    image: "/images/pngs/about/adeiza.png",
  },
];

const AboutHero = () => {
  useEffect(() => {
    Aos.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 40,
    });
  }, []);

  return (
    <section
      id="about-hero-section"
      className="relative -translate-y-25 overflow-x-hidden bg-[#0D6D84] pb-16 pt-12 lg:pb-24 lg:pt-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.11) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />

      <div className="app-width relative z-10 mt-20">
        <div
          data-aos="fade-up"
          className="mx-auto mb-20 max-w-195 text-center text-white"
        >
          <h1 className="font-clash-display text-balance text-4xl font-semibold leading-tight lg:text-5xl ">
            Go from Job Seeker to Employed
          </h1>
          <div className="flex justify-center">
            <Flag />
            <p className="max-w-90 mt-4 text-base text-white/90 sm:text-lg">
              <span className="mr-2 text-xl">🇬🇧🇺🇸</span>
              How Amdari is Empowering Tech Professionals, One Experience at a Time
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {founders.map((founder, index) => (
            <article
              key={founder.name}
              data-aos={
                index === 0 ? "fade-up" : index === 1 ? "fade-down" : "fade-up"
              }
              data-aos-delay={index * 120}
              className={cn(
                "group relative isolate h-125 overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-black/25 transition-transform duration-500",
                index === 1 ? "md:-translate-y-6" : "",
              )}
            >
              <Image
                src={founder.image}
                alt={founder.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between rounded-xl bg-[#092A31]/75 p-4 backdrop-blur-sm">
                <div>
                  <h3 className="font-clash-display text-xl font-semibold text-white">
                    {founder.name}
                  </h3>
                  <p className="text-sm text-white/80">{founder.role}</p>
                </div>
                <button
                  type="button"
                  className="inline-flex size-9 items-center cursor-pointer justify-center rounded-md bg-white text-[#0F4652] transition hover:bg-[#EAF3F5]"
                  aria-label={`${founder.name} LinkedIn`}
                >
                  <Linkedin className="size-5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutHero;

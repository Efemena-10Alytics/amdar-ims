"use client";

import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Heart,
  KeyRound,
  Leaf,
  Recycle,
  Rocket,
  Search,
  Target,
  Users,
} from "lucide-react";
import Aos from "aos";

interface CoreValueItem {
  icon: LucideIcon;
  label: string;
  iconTileClassName: string;
  iconClassName?: string;
}

const CORE_VALUES: CoreValueItem[] = [
  {
    icon: Search,
    label: "Integrity & Transparency",
    iconTileClassName: "bg-[#F4DB73]",
    iconClassName: "text-[#7B6B34]",
  },
  {
    icon: Leaf,
    label: "Community-centric Growth",
    iconTileClassName: "bg-[#032B36]",
    iconClassName: "text-[#4AA0A7]",
  },
  {
    icon: Users,
    label: "Diversity & Inclusion",
    iconTileClassName: "bg-[#1F6E80]",
    iconClassName: "text-[#A6D5DD]",
  },
  {
    icon: Target,
    label: "Results Oriented Mindset",
    iconTileClassName: "bg-[#4ADE80]",
    iconClassName: "text-[#1A8D4B]",
  },
  {
    icon: Recycle,
    label: "Continuous learning & improvement.",
    iconTileClassName: "bg-[#756632]",
    iconClassName: "text-[#E8D891]",
  },
  {
    icon: Heart,
    label: "Customer centered Approach",
    iconTileClassName: "bg-[#4C08AE]",
    iconClassName: "text-[#D7B8FF]",
  },
  {
    icon: Rocket,
    label: "Passion for Impact",
    iconTileClassName: "bg-[#F24444]",
    iconClassName: "text-[#FFD5D5]",
  },
  {
    icon: KeyRound,
    label: "Empowerment Through Experience.",
    iconTileClassName: "bg-[#3B82F6]",
    iconClassName: "text-[#BDD8FF]",
  },
];

const OurCoreValue = () => {
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
    <section className="py-14 lg:py-20">
      <div className="app-width">
        <h2
          data-aos="fade-up"
          className="mx-auto text-center text-4xl font-semibold text-[#062C36] md:text-5xl"
        >
          Our <br /> Core Value
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-2 overflow-hidden">
          {CORE_VALUES.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                data-aos-delay={index * 70}
                className="flex items-center gap-4 rounded-2xl bg-[#DDE4E8] px-3 py-3.5 md:px-4"
              >
                <div
                  className={`flex h-15 w-15 shrink-0 items-center justify-center rounded-xl ${item.iconTileClassName}`}
                >
                  <Icon className={`h-7 w-7 ${item.iconClassName ?? "text-white"}`} />
                </div>
                <p className="md:text-2xl leading-tight font-medium text-[#1A3B45] max-w-100">
                  {item.label}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurCoreValue;

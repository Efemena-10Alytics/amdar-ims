"use client";

import { useEffect } from "react";
import { BriefcaseBusiness } from "lucide-react";
import Aos from "aos";

type DifferenceItem = {
  title: string;
  description: string;
};

const DIFFERENCE_ITEMS: DifferenceItem[] = [
  {
    title: "Experience-First Approach",
    description:
      "Our internship programs are designed to immerse you in real-world scenarios, not simulations.",
  },
  {
    title: "Global Opportunities",
    description:
      "With us, you get access to international work references and connections that open doors.",
  },
  {
    title: "Expert Mentorship",
    description:
      "Interning at Amdari means you learn from industry leaders who guide you every step of the way.",
  },
  {
    title: "Practical Skill",
    description:
      "Our portfolio building tool allows you to build a portfolio that speaks volumes to hiring managers.",
  },
  {
    title: "Flexibility",
    description:
      "With Amdari internships or real-world projects, you learn and work at your own pace, anywhere in the world.",
  },
];

const WhatMakesDifferences = () => {
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
    <section className="bg-[#F2DB88] py-18 lg:py-24">
      <div className="app-width">
        <h2
          data-aos="fade-up"
          className="text-center font-clash-display text-4xl font-semibold text-[#123640] lg:text-5xl"
        >
          What Makes Us Different?
        </h2>

        <div className="mx-auto mt-12 grid max-w-292 gap-5 md:grid-cols-3">
          {DIFFERENCE_ITEMS.slice(0, 3).map((item, index) => (
            <article
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={index * 70}
              className="rounded-xl bg-[#DDC772] px-5 py-4 text-[#173740]"
            >
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="size-5" />
                <h3 className="text-lg leading-tight font-semibold">{item.title}</h3>
              </div>
              <p className="mt-2 text-base">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-4 grid max-w-188 gap-5 md:grid-cols-2">
          {DIFFERENCE_ITEMS.slice(3).map((item) => (
            <article
              key={item.title}
              className="rounded-xl bg-[#DDC772] px-5 py-4 text-[#173740]"
            >
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="size-4" />
                <h3 className="text-[22px] leading-tight font-semibold">{item.title}</h3>
              </div>
              <p className="mt-2 text-base leading-snug">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatMakesDifferences;

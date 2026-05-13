"use client";

import React from "react";
import Aos from "aos";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomButton from "../shared/custom-button";
import { CopierSvg } from "../home/svg";

const RETURNS = [
  {
    title: "Your Brand on Real Work",
    description:
      "Your company name appears on intern project briefs, case studies, and portfolios. That's brand visibility inside a growing community of 25,000+ tech professionals across the UK, US, and Canada.",
    className: "lg:col-span-4",
  },
  {
    title: "Social Impact You Can Stand Behind",
    description:
      "Every project brief you contribute helps someone from an underrepresented background build a credible CV and land a tech role. That's a story worth telling to your team, your customers, and your investors.",
    className: "lg:col-span-4",
  },
  {
    title: "A Pipeline of Pre-Assessed Talent",
    description:
      "If a project impresses you, you already know how that person thinks and works. Many of our partners have gone on to hire directly from the intern cohorts they sponsored.",
    className: "lg:col-span-4",
  },
  {
    title: "Zero Admin. Zero Risk.",
    description:
      "No NDAs unless you want one. No data sharing unless you choose to. No management overhead. You contribute a brief and we handle everything else.",
    className: "lg:col-span-5",
  },
  {
    title: "Recognition as a Forward-Thinking Partner",
    description:
      "We feature our partners publicly across our platforms and communications. You're associated with a mission that resonates: closing the experience gap for the next generation of tech professionals.",
    className: "lg:col-span-7",
  },
] as const;

function ReturnCard({
  title,
  description,
  className,
  index,
}: {
  title: string;
  description: string;
  className?: string;
  index: number;
}) {
  return (
    <article
      data-aos="fade-up"
      data-aos-delay={index * 60}
      className={cn(
        "rounded-xl bg-[#E8EFF1] p-5 text-left shadow-[0_1px_0_rgba(9,42,49,0.03)]",
        "sm:p-6 lg:min-h-58",
        className,
      )}
    >
      <div
        className="mb-4 flex size-7 items-center justify-center text-primary"
        aria-hidden
      >
        <CopierSvg />
      </div>
      <h3 className="text-lg font-bold leading-snug text-[#64748B] md:text-xl">
        {title}
      </h3>
      <p className="mt-3 text-sm font-medium leading-relaxed text-[#64748B] sm:text-base">
        {description}
      </p>
    </article>
  );
}

export default function SmallAsk() {
  React.useEffect(() => {
    Aos.init({ duration: 600, once: true });
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-white py-14 text-[#092A31] sm:py-16 lg:py-20"
      aria-labelledby="small-ask-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-[9%] top-0 h-28 w-18 bg-[#E8EFF1]/70" />
        <div className="absolute right-[9%] top-4 h-28 w-28 bg-[#E8EFF1]/70" />
        <div className="absolute bottom-3 right-[10%] h-20 w-32 bg-[#E8EFF1]/70" />
        <div className="absolute left-0 top-[67%] h-px w-full bg-primary/35" />
        <span className="absolute left-6 top-[67%] size-1 rounded-full bg-primary/60" />
        <span className="absolute right-6 top-[67%] size-1 rounded-full bg-primary/60" />
      </div>

      <div className="app-width relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h2
            id="small-ask-heading"
            data-aos="fade-up"
            className="font-clash-display max-w-2xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.625rem]"
          >
            Small ask. Genuine return.
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="80"
            className="max-w-md text-sm font-semibold leading-relaxed text-[#71859F] sm:text-base md:pt-2"
          >
            This is a light-touch commitment. Here's what you get in exchange
            for it.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {RETURNS.map((item, index) => (
            <ReturnCard
              key={item.title}
              title={item.title}
              description={item.description}
              className={item.className}
              index={index}
            />
          ))}
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="240"
          className="mt-10 flex justify-center lg:mt-12"
        >
          <CustomButton btnText="Become a Partner" href="/auth/sign-up" />
        </div>
      </div>
    </section>
  );
}

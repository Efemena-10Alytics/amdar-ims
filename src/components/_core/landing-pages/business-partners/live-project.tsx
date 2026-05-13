"use client";

import React from "react";
import Image from "next/image";
import Aos from "aos";

const PROJECT_DETAILS = [
  {
    title: "A business challenge in your industry",
    description:
      "Tell us about a problem type your company faces: customer churn, security gaps, process inefficiencies, data silos. We'll build a realistic scenario around it. Your data stays yours.",
  },
  {
    title: "A real project brief (anonymised if needed)",
    description:
      "If you have a brief you're happy to share, even a lightly edited version of something your team has worked on, that's ideal. Interns will treat it as their live client brief.",
  },
  {
    title: "Just your industry and context",
    description:
      "Not sure what to contribute? That's fine too. Tell us what your company does and we'll work with you to shape a brief that makes sense for your business and our intern tracks.",
  },
  {
    title: "Micro-copy below",
    description:
      "Most partners spend less than 30 minutes contributing their brief. The rest is on us.",
  },
] as const;

export default function LiveProject() {
  React.useEffect(() => {
    Aos.init({ duration: 600, once: true });
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-[#E8EFF1] py-14 text-[#092A31] sm:py-16 lg:py-20"
      aria-labelledby="live-project-heading"
    >
      <div
        className="pointer-events-none absolute right-4 top-0 h-20 w-24 bg-white/35 sm:right-10 sm:h-24 sm:w-28 lg:right-16 lg:h-28 lg:w-32"
        aria-hidden
      />

      <div className="app-width relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-20">
        <div data-aos="fade-right" className="flex justify-center lg:justify-start">
          <Image
            src="/images/pngs/business-partners/live-project.png"
            alt="Live project brief illustration"
            width={768}
            height={725}
            className="h-auto w-full max-w-136 object-contain lg:max-w-156"
            priority={false}
          />
        </div>

        <div data-aos="fade-left">
          <h2
            id="live-project-heading"
            className="font-clash-display max-w-xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.625rem]"
          >
            A problem. A scenario. A challenge space.
          </h2>
          <p className="mt-3 max-w-lg text-sm font-semibold leading-relaxed text-[#64748B] sm:text-base">
            You don&apos;t need to hand over sensitive data or internal
            documents. You just need to point us toward something real.
          </p>

          <div className="mt-9 divide-y divide-[#C9D6DB]">
            {PROJECT_DETAILS.map((item, index) => (
              <article
                key={item.title}
                data-aos="fade-up"
                data-aos-delay={index * 70}
                className="py-5 first:pt-0 last:pb-0"
              >
                <h3 className="text-lg font-bold leading-snug text-[#475569] md:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#64748B] sm:text-base">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

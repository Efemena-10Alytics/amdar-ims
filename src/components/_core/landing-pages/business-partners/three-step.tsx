"use client";

import React from "react";
import Aos from "aos";
import { FileText, Handshake, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    eyebrow: "STEP 01",
    title: "Share Your Context",
    description:
      "Fill in our partner form. Tell us about your company, your industry, and the kind of challenge you'd like interns to work on. It doesn't need to be formal.",
    icon: FileText,
  },
  {
    eyebrow: "STEP 02",
    title: "We Build the Brief",
    description:
      "Our team shapes your contribution into a realistic intern project brief. We'll send it to you for a quick review before anything goes live. You stay in control.",
    icon: Pencil,
  },
  {
    eyebrow: "STEP 03",
    title: "Interns Get to Work",
    description:
      "A coached, supervised intern team works on your brief as if you're their client. You can stay as involved or hands-off as you like. At the end, you'll receive the project outputs if you'd like to see them.",
    icon: Handshake,
  },
] as const;

export default function ThreeStep() {
  React.useEffect(() => {
    Aos.init({ duration: 600, once: true });
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-[#E8EFF1] lg:px-6 py-10 text-white sm:py-14 lg:py-16"
      aria-labelledby="three-step-heading"
    >
      <div className="relative left-1/2 w-[108%] -translate-x-1/2 lg:-rotate-2 rounded-bl-[10rem] rounded-tr-[10rem] bg-[#062F36] px-4 py-20 shadow-[0_18px_40px_rgba(6,47,54,0.18)] sm:py-24 lg:py-28">
        <div className="app-width lg:rotate-2">
          <h2
            id="three-step-heading"
            data-aos="fade-up"
            className="font-clash-display text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.5rem]"
          >
            Three steps to becoming a partner
          </h2>

          <div className="mt-9 grid gap-5 md:grid-cols-3 lg:gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.eyebrow}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                  className={cn(
                    "relative min-h-52 overflow-hidden rounded-lg bg-[#04252B] p-6",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-7",
                  )}
                >
                  <Icon
                    className="absolute -right-1 top-4 size-16 text-primary/80 sm:size-18"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                  <p className="text-base font-bold tracking-wide text-white/10">
                    {step.eyebrow}
                  </p>
                  <h3 className="mt-4 max-w-52 text-2xl font-bold leading-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-white/65">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

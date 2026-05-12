"use client";

import React from "react";
import Aos from "aos";
import { cn } from "@/lib/utils";
import {
  FileText,
  Handshake,
  Share2,
  UserCheck,
  UserSquare,
} from "lucide-react";

const BODY_PARAGRAPHS = [
  "Our interns are talented, trained, and ready to work. What they're missing isn't skill. It's the feel of a real business problem. The messiness of actual stakeholder needs. The weight of working for a company that exists.",
  "When you partner with Amdari, you share a business challenge, a real scenario, or even just a problem space relevant to your industry. Our interns use that as the foundation for their project. They work as if they're solving it for you because in every meaningful sense, they are.",
  "You don't manage them. You don't review deliverables unless you want to. You don't share sensitive data. You simply give them something real to work towards.",
] as const;

const BRIEF_FLOW_STEPS: {
  title: string;
  icon: React.ElementType;
}[] = [
  {
    title: "You submit a brief, scenario, or challenge",
    icon: FileText,
  },
  {
    title: "Amdari matches it to a qualified candidate",
    icon: UserSquare,
  },
  {
    title: "Candidate completes work with mentorship",
    icon: UserCheck,
  },
  {
    title: "Deliverable shared, your brand credited",
    icon: Share2,
  },
  {
    title: "Candidate gets hired, you made it happen",
    icon: Handshake,
  },
];

export default function OutsourcingWork() {
  React.useEffect(() => {
    Aos.init({ duration: 600, once: true });
  }, []);

  return (
    <section
      className="bg-[#F0F2F5] py-14 text-[#092A31] md:py-16 lg:py-20"
      aria-labelledby="outsourcing-work-heading"
    >
      <div className="app-width">
        <h2
          id="outsourcing-work-heading"
          data-aos="fade-up"
          className="max-w-4xl text-left text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-[2.25rem] lg:leading-snug"
        >
          You&apos;re not outsourcing work. You&apos;re providing context based
          on real experience.
        </h2>

        <div
          data-aos="fade-up"
          data-aos-delay="80"
          className="mt-8 rounded-2xl bg-[#062C36] p-6 shadow-xl sm:p-8 md:mt-10 md:rounded-3xl md:p-10 lg:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="flex flex-col gap-5 text-left text-base leading-relaxed text-[#C4D6DA] sm:text-[1.05rem]">
              {BODY_PARAGRAPHS.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              <p
                className={cn(
                  "mt-2 rounded-md border bg-[#03E48929] border-[#22C55E] px-4 py-3.5 text-center text-base font-semibold text-[#4ADE80]",
                  "sm:text-left",
                )}
              >
                <span className="text-white">That&apos;s it.</span> <br />  And it changes everything for them.
              </p>
            </div>

            <div>
              <h3 className="mb-6 text-lg font-bold text-white sm:text-xl">
                How a brief flows
              </h3>
              <ol className="flex flex-col">
                {BRIEF_FLOW_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === BRIEF_FLOW_STEPS.length - 1;
                  return (
                    <li
                      key={step.title}
                      className={cn("flex gap-3 sm:gap-4", !isLast && "pb-4 sm:pb-5")}
                    >
                      <div className="flex w-9 shrink-0 flex-col items-center self-stretch sm:w-10">
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-sm bg-[#156374] text-xs font-bold text-white sm:size-9 sm:text-sm",
                          )}
                          aria-hidden
                        >
                          {index + 1}
                        </span>
                          <div
                            className="mx-auto min-h-10 w-px flex-1 bg-linear-to-b from-white/35 from-0% via-white/12 via-55% to-transparent to-100%"
                            aria-hidden
                          />
                      </div>
                      <div
                        className={cn(
                          "flex min-h-17 flex-1 gap-3 rounded-xl bg-[#0F4652]/90 p-3 sm:min-h-18 sm:gap-4 sm:p-4",
                        )}
                      >
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-md bg-amdari-yellow text-[#092A31] sm:size-11"
                          aria-hidden
                        >
                          <Icon className="size-5 sm:size-5" strokeWidth={2} />
                        </div>
                        <p className="flex flex-1 items-center text-sm font-medium leading-snug text-white/95 sm:text-base">
                          {step.title}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

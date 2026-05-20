"use client";

import React from "react";
import Link from "next/link";
import Aos from "aos";
import { ArrowUpRight } from "lucide-react";
import { scrollToHash } from "@/lib/scroll-to-hash";
import { cn } from "@/lib/utils";

const ctaClassName = (variant: "solid" | "outline") =>
  cn(
    "group inline-flex h-12 min-w-52 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors",
    variant === "solid"
      ? "bg-amdari-yellow text-[#092A31] hover:bg-[#F5CF57]"
      : "border border-white/55 bg-transparent text-white hover:bg-white/10",
  );

function CtaButton({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
}) {
  const icon = (
    <span
      className={cn(
        "flex size-5 items-center justify-center rounded-full transition-colors",
        variant === "solid"
          ? "bg-primary text-amdari-yellow"
          : "bg-amdari-yellow text-primary",
      )}
    >
      <ArrowUpRight className="size-3" strokeWidth={2.4} />
    </span>
  );

  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        className={ctaClassName(variant)}
        onClick={(event) => {
          event.preventDefault();
          scrollToHash(href);
        }}
      >
        <span>{children}</span>
        {icon}
      </a>
    );
  }

  return (
    <Link href={href} className={ctaClassName(variant)}>
      <span>{children}</span>
      {icon}
    </Link>
  );
}

export default function StillHaveQuestion() {
  React.useEffect(() => {
    Aos.init({ duration: 600, once: true });
  }, []);

  return (
    <section className="py-10 sm:py-12" aria-labelledby="questions-heading">
      <div className="app-width">
        <div
          data-aos="fade-up"
          className="relative overflow-hidden rounded-2xl bg-[#156374] px-6 py-10 text-white sm:px-10 lg:px-18"
        >
          <div className="pointer-events-none absolute inset-0 opacity-35" aria-hidden>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-size-[5.5rem_5.5rem]" />
            <div className="absolute -left-9 -top-22 size-42 rounded-full bg-white/25" />
            <div className="absolute -left-24 -top-28 size-56 rounded-full border-[3rem] border-white/16" />
            <div className="absolute -bottom-30 left-[54%] size-42 rounded-full border-[2rem] border-white/16" />
            <div className="absolute bottom-4 left-[61%] size-5 rounded-full bg-white/70" />
            <div className="absolute bottom-24 left-[56%] size-10 rounded-full border-[0.9rem] border-white/12 bg-white/35" />
            <div className="absolute -bottom-28 -right-2 size-56 rounded-full bg-white/12" />
          </div>

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2
                id="questions-heading"
                className="font-clash-display max-w-xl text-balance text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.625rem]"
              >
                Still have questions?
                <br />
                Let&apos;s just talk.
              </h2>
              <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/85 sm:text-lg">
                Book a 20-minute call. No pitch, no pressure, just a
                conversation about whether this makes sense for your team.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:w-fit">
              <CtaButton href="#become-a-partner">Become a Partner</CtaButton>
              <CtaButton href="mailto:hello@amdari.io" variant="outline">
                Email Us Directly
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

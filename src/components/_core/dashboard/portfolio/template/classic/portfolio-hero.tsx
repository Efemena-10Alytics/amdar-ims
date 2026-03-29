"use client";

import Image from "next/image";
import { useEffect } from "react";
import { initClassicAos } from "./init-classic-aos";
import { useCountUp } from "@/hooks/use-count-up";

export type PortfolioHeroData = {
  name: string;
  jobTitle: string;
  bio: string;
  projectsCount: string;
  yearsExperience: string;
  countryName: string;
  countryFlagUrl?: string;
  /** Tool badge next to job title (e.g. "Figma"). */
  toolBadge?: string;
  /** Icon URL from portfolio tools array. When set, used instead of local TOOL_ICONS. */
  toolBadgeIconUrl?: string | null;
};

const TOOL_ICONS: Record<string, string> = {
  Figma: "/images/svgs/tools/figma.svg",
};

type PortfolioHeroProps = {
  value: PortfolioHeroData;
  id?: string;
};

export function PortfolioHero({ value, id }: PortfolioHeroProps) {
  const toolIcon =
    value.toolBadgeIconUrl ||
    (value.toolBadge ? TOOL_ICONS[value.toolBadge] : null);

  const projectsNum = parseInt(value.projectsCount?.replace(/\D/g, "") ?? "0", 10);
  const projectsSuffix = value.projectsCount?.includes("+") ? "+" : "";
  const projectsDisplay = useCountUp(projectsNum, 2400, !!value.projectsCount && projectsNum > 0);

  const yearsNum = parseInt(value.yearsExperience?.replace(/\D/g, "") ?? "0", 10);
  const yearsSuffix = value.yearsExperience?.includes("+") ? "+" : "";
  const yearsDisplay = useCountUp(yearsNum, 2400, !!value.yearsExperience && yearsNum > 0);

  useEffect(() => {
    initClassicAos();
  }, []);

  return (
    <section id={id} className="text-center mt-16">
      <h1 data-aos="zoom-in" className="text-2xl md:text-6xl font-semibold text-[#092A31] tracking-tight">
        Hello, I&apos;m {value.name || "—"}
      </h1>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {value.toolBadge && toolIcon && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-[#E8EFF1] px-4 py-3 text-xs text-[#092A31] shadow-sm"
            aria-hidden
            data-aos="fade-left"
          >
            <div className="bg-white p-2 rounded-full h-6 w-6 flex items-center justify-center">
              {value.toolBadgeIconUrl?.trim() ? (
                <img
                  src={value.toolBadgeIconUrl}
                  alt=""
                  width={16}
                  height={16}
                  className="shrink-0 size-4 object-contain"
                />
              ) : (
                <Image
                  src={toolIcon}
                  alt=""
                  width={16}
                  height={16}
                  className="shrink-0"
                />
              )}
            </div>
            <span>{value.toolBadge}</span>
          </span>
        )}
        <h1 data-aos="fade-right" className="text-2xl md:text-6xl font-semibold text-[#092A31]">
          A {value.jobTitle || "Professional"}
        </h1>
      </div>

      {value.bio && (
        <p className="mt-6 capitalize max-w-2xl mx-auto text-sm md:text-base text-[#64748B] leading-relaxed">
          &ldquo;{value.bio}&rdquo;
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-end gap-8 md:gap-10">
        {(value.projectsCount || value.yearsExperience) && (
          <>
            {value.projectsCount && (
              <div className="text-left">
                <h2 className="text-lg md:text-xl font-semibold text-[#092A31]">
                  {projectsDisplay}{projectsSuffix}
                </h2>
                <div className="text-sm text-[#64748B] mt-0.5">Projects</div>
              </div>
            )}
            {value.yearsExperience && (
              <div className="text-left">
                <h2 className="text-lg md:text-xl font-semibold text-[#092A31]">
                  {yearsDisplay}{yearsSuffix}
                </h2>
                <div className="text-sm text-[#64748B] mt-0.5">Years</div>
              </div>
            )}
          </>
        )}
        {value.countryName && (
          <div className="grid text-left text-sm text-[#64748B]">
            {value.countryFlagUrl ? (
              <img
                src={value.countryFlagUrl}
                alt=""
                className="size-5 shrink-0 rounded-sm object-cover"
                aria-hidden
              />
            ) : (
              <span className="text-base" aria-hidden>
                🌍
              </span>
            )}
            <span>{value.countryName}</span>
          </div>
        )}
      </div>
    </section>
  );
}

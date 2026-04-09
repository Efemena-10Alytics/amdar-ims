"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { initClassicAos } from "./init-classic-aos";
import { useCountUp } from "@/hooks/use-count-up";
import { useCountries } from "@/features/portfolio/use-countries";

export type PortfolioHeroData = {
  name: string;
  jobTitle: string;
  bio: string;
  projectsCount: string;
  yearsExperience: string;
  countryName: string;
  countryFlagUrl?: string;
  avatarUrl?: string;
  showAvatar?: boolean;
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
  const { data: countries = [] } = useCountries();
  const toolIcon =
    value.toolBadgeIconUrl ||
    (value.toolBadge ? TOOL_ICONS[value.toolBadge] : null);
  const resolvedCountryFlagUrl = useMemo(() => {
    if (value.countryFlagUrl?.trim()) return value.countryFlagUrl;
    const normalizedCountry = value.countryName?.trim().toLowerCase();
    if (!normalizedCountry) return undefined;

    const country = countries.find((c) => {
      const name = c.name?.trim().toLowerCase();
      const code = c.code?.trim().toLowerCase();
      return name === normalizedCountry || code === normalizedCountry;
    });
    return country?.flag;
  }, [countries, value.countryFlagUrl, value.countryName]);

  const projectsNum = parseInt(value.projectsCount?.replace(/\D/g, "") ?? "0", 10);
  const projectsSuffix = value.projectsCount?.includes("+") ? "+" : "";
  const projectsDisplay = useCountUp(projectsNum, 2400, !!value.projectsCount && projectsNum > 0);

  const yearsNum = parseInt(value.yearsExperience?.replace(/\D/g, "") ?? "0", 10);
  const yearsSuffix = value.yearsExperience?.includes("+") ? "+" : "";
  const yearsDisplay = useCountUp(yearsNum, 2400, !!value.yearsExperience && yearsNum > 0);

  useEffect(() => {
    initClassicAos();
  }, []);

  console.log(value.avatarUrl)

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

      <div className="flex gap-4 items-center justify-between">
        <div className="flex-1">
          {value.showAvatar !== false && value.avatarUrl ? (
            <div data-aos="zoom-in" className="mb-5 flex justify-start">
              <Image
                height={54}
                width={54}
                src={value.avatarUrl}
                alt={`${value.name || "Profile"} avatar`}
                className="size-12 md:size-16 rounded-full object-cover border-4 border-[#E8EFF1] shadow-sm"
              />
            </div>
          ) : null}
        </div>
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
            <div className="grid gap-2 text-left text-sm text-[#64748B]">
              {resolvedCountryFlagUrl ? (
                <img
                  src={resolvedCountryFlagUrl}
                  alt=""
                  className="size-5 shrink-0 rounded-full object-cover"
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
      </div>
    </section>
  );
}

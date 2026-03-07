"use client";

import Image from "next/image";

export type PortfolioHeroData = {
  name: string;
  jobTitle: string;
  bio: string;
  projectsCount: string;
  yearsExperience: string;
  countryName: string;
  countryFlagUrl?: string;
  /** Tool badge next to job title (e.g. "Figma"). Uses /images/svgs/tools/figma.svg when "Figma". */
  toolBadge?: string;
};

const TOOL_ICONS: Record<string, string> = {
  Figma: "/images/svgs/tools/figma.svg",
};

type PortfolioHeroProps = {
  value: PortfolioHeroData;
};

export function PortfolioHero({ value }: PortfolioHeroProps) {
  const toolIcon = value.toolBadge ? TOOL_ICONS[value.toolBadge] : null;

  return (
    <section className="text-center mt-16">
      <h1 className="text-2xl md:text-4xl font-semibold text-[#092A31] tracking-tight">
        Hello, I&apos;m {value.name || "—"}
      </h1>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {value.toolBadge && toolIcon && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-[#E8EFF1] px-2.5 py-1 text-sm text-[#092A31] shadow-sm"
            aria-hidden
          >
            <div className="bg-white p-2 rounded-full h-6 w-6 flex items-center justify-center">
              <Image
                src={toolIcon}
                alt=""
                width={16}
                height={16}
                className="shrink-0"
              />
            </div>
            <span>{value.toolBadge}</span>
          </span>
        )}
        <span className="text-2xl md:text-4xl font-semibold text-[#092A31]">
          A {value.jobTitle || "Professional"}
        </span>
      </div>

      {value.bio && (
        <p className="mt-6 max-w-2xl mx-auto text-sm md:text-base text-[#64748B] leading-relaxed">
          &ldquo;{value.bio}&rdquo;
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-end gap-8 md:gap-10">
        {(value.projectsCount || value.yearsExperience) && (
          <>
            {value.projectsCount && (
              <div className="text-left">
                <div className="text-lg md:text-xl font-semibold text-[#092A31]">
                  {value.projectsCount}+
                </div>
                <div className="text-sm text-[#64748B] mt-0.5">Projects</div>
              </div>
            )}
            {value.yearsExperience && (
              <div className="text-left">
                <div className="text-lg md:text-xl font-semibold text-[#092A31]">
                  {value.yearsExperience}+
                </div>
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

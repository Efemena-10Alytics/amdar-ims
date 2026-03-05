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
      <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 tracking-tight">
        Hello, I&apos;m {value.name || "—"}
      </h1>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {value.toolBadge && toolIcon && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-zinc-700 shadow-sm"
            aria-hidden
          >
            <Image
              src={toolIcon}
              alt=""
              width={16}
              height={16}
              className="shrink-0"
            />
            <span>{value.toolBadge}</span>
          </span>
        )}
        <span className="text-2xl md:text-4xl font-bold text-zinc-900">
          A {value.jobTitle || "Professional"}
        </span>
      </div>

      {value.bio && (
        <p className="mt-6 max-w-2xl mx-auto text-sm md:text-base text-zinc-600 leading-relaxed">
          &ldquo;{value.bio}&rdquo;
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-end gap-8 md:gap-10">
        {(value.projectsCount || value.yearsExperience) && (
          <>
            {value.projectsCount && (
              <div className="text-left">
                <div className="text-lg md:text-xl font-bold text-zinc-900">
                  {value.projectsCount}+
                </div>
                <div className="text-sm text-zinc-600 mt-0.5">Projects</div>
              </div>
            )}
            {value.yearsExperience && (
              <div className="text-left">
                <div className="text-lg md:text-xl font-bold text-zinc-900">
                  {value.yearsExperience}+
                </div>
                <div className="text-sm text-zinc-600 mt-0.5">Years</div>
              </div>
            )}
          </>
        )}
        {value.countryName && (
          <div className="grid text-left text-sm text-zinc-600">
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

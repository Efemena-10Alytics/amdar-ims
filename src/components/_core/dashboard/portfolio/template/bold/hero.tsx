"use client";

import Image from "next/image";
import { useEffect } from "react";
import { initClassicAos } from "../classic/init-classic-aos";
import { useCountUp } from "@/hooks/use-count-up";
import type { PortfolioHeroData } from "../classic/portfolio-hero";

type BoldHeroProps = {
  value: PortfolioHeroData;
  id?: string;
};

export function BoldHero({ value, id }: BoldHeroProps) {
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
    <section id={id} className="mt-16">
      {/* Top row: text + avatar */}
      <div className="flex items-center justify-between gap-6 max-w-300">
        <div className="flex-1">
          <h1
            data-aos="fade-right"
            className="text-2xl md:text-4xl font-bold text-[#092A31] leading-tight"
          >
            Hello, I&apos;m {value.name || "—"}
          </h1>
          <h2
            data-aos="fade-right"
            data-aos-delay="100"
            className="text-2xl md:text-4xl font-bold text-[#092A31] leading-tight mt-1"
          >
            {value.jobTitle || "Professional"}
          </h2>
          {value.bio && (
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="mt-4 max-w-4xl text-sm md:text-base text-[#64748B] leading-relaxed"
            >
              {value.bio}
            </p>
          )}
        </div>

        {value.showAvatar !== false && value.avatarUrl && (
          <div data-aos="zoom-in" className="shrink-0">
            <Image
              src={value.avatarUrl}
              alt={`${value.name || "Profile"} avatar`}
              width={54}
              height={54}
              className="size-20 md:size-24 rounded-full object-cover border-4 border-[#E8EFF1] shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Stats row */}
      {(value.projectsCount || value.yearsExperience || value.toolBadge) && (
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="mt-10 flex flex-wrap items-center justify-center gap-10 md:gap-16"
        >
          {value.projectsCount && (
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-[#092A31]">
                {projectsDisplay}{projectsSuffix}
              </p>
              <p className="mt-1 text-sm text-[#64748B]">Projects</p>
            </div>
          )}

          {value.yearsExperience && (
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-[#092A31]">
                {yearsDisplay}{yearsSuffix}
              </p>
              <p className="mt-1 text-sm text-[#64748B]">Years</p>
            </div>
          )}

          {value.toolBadge && (
            <div className="text-center">
              <div className="flex justify-center">
                {value.toolBadgeIconUrl ? (
                  <img
                    src={value.toolBadgeIconUrl}
                    alt={value.toolBadge}
                    className="size-8 object-contain rounded-full shadow-2xl"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-xs font-semibold text-[#092A31]">
                    {value.toolBadge.charAt(0)}
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-[#64748B]">Tools</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default BoldHero;

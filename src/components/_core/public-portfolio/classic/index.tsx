"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils";
import { useCountries } from "@/features/portfolio/use-countries";
import type { UserPortfolioData } from "@/features/portfolio/use-get-portfolio";
import { PortfolioHero } from "../../dashboard/portfolio/template/classic/portfolio-hero";
import { MyProjects } from "../../dashboard/portfolio/template/classic/my-project";
import { MyWorkExperience } from "../../dashboard/portfolio/template/classic/my-work-experince";
import { MyTools } from "../../dashboard/portfolio/template/classic/my-tools";
import { MyEducationBackground } from "../../dashboard/portfolio/template/classic/my-education-background";
import { Footer } from "../../dashboard/portfolio/template/classic/footer";
import { MySpecialization } from "../../dashboard/portfolio/template/classic/my-specializion";

const NAV_ITEMS = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#specialization", label: "Specialization" },
  { href: "#contact", label: "Contact me" },
] as const;

function formatDuration(start?: string | null, end?: string | null, currentlyWorkThere?: boolean): string {
  if (!start) return "";
  const startPart = start.slice(0, 7);
  if (currentlyWorkThere) return `${startPart} - Present`;
  if (!end) return startPart;
  return `${startPart} - ${end.slice(0, 7)}`;
}

function mapSpecializationData(raw: unknown[]): string[] {
  return raw.map((s) => (typeof s === "string" ? s : String((s as { title?: string })?.title ?? s)));
}

function mapSkillsData(raw: unknown[]): string[] {
  return raw.map((s) => (typeof s === "string" ? s : String((s as { title?: string; name?: string })?.title ?? (s as { name?: string })?.name ?? s)));
}

type ClassicProps = {
  portfolio?: UserPortfolioData | null;
  isLoading?: boolean;
  error?: Error | null | unknown;
};

const Classic = ({ portfolio, isLoading, error }: ClassicProps) => {
  const { data: countries = [] } = useCountries();

  const heroData = useMemo(() => {
    if (!portfolio) return null;
    const p = portfolio.personalInfo;
    const b = portfolio.bio;
    const country = countries.find((c) => c.code === p?.countryCode);
    const firstTool = portfolio.tools?.[0];
    const toolBadgeIconUrl =
      firstTool && (firstTool.image || firstTool.url)
        ? getImageUrl(firstTool.image ?? firstTool.url ?? undefined)
        : undefined;
    return {
      name: [p?.firstName, p?.lastName].filter(Boolean).join(" ") || "—",
      jobTitle: b?.jobTitle || "Professional",
      bio: b?.bio || "",
      projectsCount: b?.projectCount || "",
      yearsExperience: b?.yearsOfExperience || "",
      countryName: country?.name ?? p?.location ?? "",
      countryFlagUrl: country?.flag,
      toolBadge: firstTool?.name || undefined,
      toolBadgeIconUrl: toolBadgeIconUrl || undefined,
    };
  }, [portfolio, countries]);

  const projects = useMemo(() => {
    return (portfolio?.projects ?? []).map((p) => ({
      id: String(p.coverImage ?? p.title ?? Math.random()),
      title: p.title || "Untitled",
      tags: p.category ? [p.category] : [],
      imageUrl: getImageUrl(p.coverImage ?? (Array.isArray(p.image) && p.image[0] ? String(p.image[0]) : null)) || undefined,
    }));
  }, [portfolio?.projects]);

  const workItems = useMemo(() => {
    return (portfolio?.workExperience ?? []).map((w) => ({
      company: w.companyName || "",
      category: w.industry || "",
      role: w.jobTitle || "",
      duration: formatDuration(w.startDate, w.endDate, w.currentlyWorkThere),
    }));
  }, [portfolio?.workExperience]);

  const specializations = useMemo(() => {
    const raw = (portfolio?.category?.specializationData ?? []) as unknown[];
    return mapSpecializationData(raw);
  }, [portfolio?.category?.specializationData]);

  const softSkills = useMemo(() => {
    const raw = (portfolio?.category?.skills ?? []) as unknown[];
    return mapSkillsData(raw);
  }, [portfolio?.category?.skills]);

  const tools = useMemo(() => {
    return (portfolio?.tools ?? []).map((t) => ({
      name: t.name || "",
      iconUrl: getImageUrl(t.image ?? t.url ?? undefined) || undefined,
      percentage: 80,
    }));
  }, [portfolio?.tools]);

  const educationEntries = useMemo(() => {
    return (portfolio?.educationalBackground ?? []).map((e) => ({
      institution: e.schoolName || "",
      degree: e.qualification || "",
    }));
  }, [portfolio?.educationalBackground]);

  const categoryTitle = portfolio?.category?.title || "Product Designer";

  if (isLoading) {
    return (
      <div className="app-width flex flex-col min-h-[84vh] items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary" aria-hidden />
        <h2 className="text-primary font-semibold">Amdari...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-width flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-red-600">Failed to load portfolio. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="app-width">
      <header className="flex items-center justify-between py-4 mb-20">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#C7F5D8] px-2.5 py-4 border border-[#ACF0C5]">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-[#1F5D36]"
            aria-hidden
          />
          <span className="text-xs font-medium text-[#1F5D36]">
            Available to work
          </span>
        </div>

        <nav className="flex items-center gap-8" aria-label="Main">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = label === "Home";
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-blue-600 underline decoration-blue-600 underline-offset-4"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      <PortfolioHero
        value={heroData ?? {
          name: "—",
          jobTitle: "Professional",
          bio: "",
          projectsCount: "",
          yearsExperience: "",
          countryName: "",
          toolBadge: undefined,
        }}
      />

      <MyProjects projects={projects} onAddProject={() => {}} />
      <MyWorkExperience items={workItems} onItemClick={() => {}} />
      <MySpecialization specializations={specializations} softSkills={softSkills} />
      <MyTools tools={tools} title={categoryTitle} />
      <MyEducationBackground entries={educationEntries} />
      <Footer />
    </div>
  );
};

export default Classic;

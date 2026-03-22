"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { MyTools } from "./my-tools";
import { MyEducationBackground } from "./my-education-background";
import { Footer } from "./footer";
import { MySpecialization } from "./my-specializion";
import { MyWorkExperience } from "./my-work-experince";
import { MyProjects } from "./my-project";
import { PortfolioHero } from "./portfolio-hero";
import { useGetPortfolio } from "@/features/portfolio/use-get-portfolio";
import { useCountries } from "@/features/portfolio/use-countries";

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

const DEFAULT_HERO = {
  name: "—",
  jobTitle: "Professional",
  bio: "",
  projectsCount: "",
  yearsExperience: "",
  countryName: "",
  toolBadge: undefined as string | undefined,
  toolBadgeIconUrl: undefined as string | undefined,
};

const CreateClassic = () => {
  const { data: portfolio, isLoading, error } = useGetPortfolio();
  const { data: countries = [] } = useCountries();

  const heroData = useMemo(() => {
    if (!portfolio) return DEFAULT_HERO;
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

  const footerContact = useMemo(() => {
    if (!portfolio?.personalInfo) return undefined;
    const p = portfolio.personalInfo;
    const country = countries.find((c) => c.code === p?.countryCode);
    const phone = p?.phoneNumber?.trim() ?? "";
    const email = p?.email?.trim() ?? "";
    const countryName = (country?.name ?? p?.location ?? "").trim();
    if (!phone && !email && !countryName) return undefined;
    return {
      phone: phone || "—",
      email: email || "—",
      country: countryName || "—",
    };
  }, [portfolio?.personalInfo, countries]);

  const footerSocialLinks = useMemo(() => {
    const s = portfolio?.social;
    const p = portfolio?.personalInfo;
    const hasSocial = s?.linkedIn || s?.twitter;
    const hasContact = p?.phoneNumber || p?.email;
    if (!hasSocial && !hasContact) return undefined;
    const links: { type: "twitter" | "linkedin" | "phone" | "mail"; href: string; label: string }[] = [];
    if (s?.linkedIn) links.push({ type: "linkedin", href: s.linkedIn, label: "LinkedIn" });
    if (s?.twitter) links.push({ type: "twitter", href: s.twitter!, label: "X (Twitter)" });
    if (p?.phoneNumber) links.push({ type: "phone", href: `tel:${p.phoneNumber.replace(/\s/g, "")}`, label: "Phone" });
    if (p?.email) links.push({ type: "mail", href: `mailto:${p.email}`, label: "Email" });
    return links.length > 0 ? links : undefined;
  }, [portfolio?.social, portfolio?.personalInfo]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-red-600">Failed to load portfolio. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <PortfolioHero value={heroData} />
      <MyProjects
        projects={projects}
        onAddProject={() => {}}
        showAddProject={true}
      />
      <MyWorkExperience items={workItems} onItemClick={() => {}} />
      <MySpecialization specializations={specializations} softSkills={softSkills} />
      <MyTools tools={tools} title={categoryTitle} />
      <MyEducationBackground entries={educationEntries} />
      <Footer
        contact={footerContact}
        socialLinks={footerSocialLinks}
      />
    </>
  );
};

export default CreateClassic;

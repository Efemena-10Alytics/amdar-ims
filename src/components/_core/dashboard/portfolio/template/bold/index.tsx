"use client";

import { useMemo } from "react";
import { getImageUrl } from "@/lib/utils";
import { useCountries } from "@/features/portfolio/use-countries";
import type { UserPortfolioData } from "@/features/portfolio/use-get-portfolio";
import BoldHero from "./hero";
import MyProjects from "./my-projects";
import { MyWorkExperience } from "../classic/my-work-experince";
import SkillsAndSpecialization from "./skills-and-specialization";
import { MyTools } from "../classic/my-tools";
import { MyEducationBackground } from "../classic/my-education-background";
import Footer from "./footer";

function formatDuration(
    start?: string | null,
    end?: string | null,
    currentlyWorkThere?: boolean,
): string {
    if (!start) return "";
    const startPart = start.slice(0, 7);
    if (currentlyWorkThere) return `${startPart} - Present`;
    if (!end) return startPart;
    return `${startPart} - ${end.slice(0, 7)}`;
}

function normalizeJobDescriptions(
    raw: string[] | string | null | undefined,
): string[] {
    if (Array.isArray(raw)) {
        return raw.map((line) => line.trim()).filter(Boolean);
    }
    if (typeof raw === "string") {
        return raw
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);
    }
    return [];
}

function mapSpecializationData(raw: unknown[]): string[] {
    return raw.map((item) =>
        typeof item === "string"
            ? item
            : String((item as { title?: string })?.title ?? item),
    );
}

function mapSkillsData(raw: unknown[]): string[] {
    return raw.map((item) =>
        typeof item === "string"
            ? item
            : String(
                (item as { title?: string; name?: string })?.title ??
                (item as { name?: string })?.name ??
                item,
            ),
    );
}

function normalizeSkillLevel(value: string | number | null | undefined): number {
    const parsed =
        typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
    if (!Number.isFinite(parsed)) return 80;
    return Math.min(100, Math.max(0, Math.round(parsed)));
}

const DEFAULT_HERO = {
    name: "—",
    jobTitle: "Professional",
    bio: "",
    projectsCount: "",
    yearsExperience: "",
    countryName: "",
    countryFlagUrl: undefined as string | undefined,
    avatarUrl: undefined as string | undefined,
    showAvatar: true,
    toolBadge: undefined as string | undefined,
    toolBadgeIconUrl: undefined as string | undefined,
};

type BoldTemplateProps = {
    portfolio: UserPortfolioData | null | undefined;
};

const BoldTemplate = ({ portfolio }: BoldTemplateProps) => {
    const { data: countries = [] } = useCountries();

    const heroData = useMemo(() => {
        if (!portfolio) return DEFAULT_HERO;

        const personalInfo = portfolio.personalInfo;
        const bio = portfolio.bio;
        const country = countries.find(
            (c) => c.name.toLowerCase() === personalInfo?.location?.toLowerCase(),
        );
        const firstTool = portfolio.tools?.[0];
        const toolBadgeIconUrl =
            firstTool && (firstTool.image || firstTool.url)
                ? getImageUrl(firstTool.image ?? firstTool.url ?? undefined)
                : undefined;

        return {
            name:
                [personalInfo?.firstName, personalInfo?.lastName]
                    .filter(Boolean)
                    .join(" ") || "—",
            jobTitle: bio?.jobTitle || "Professional",
            bio: bio?.bio || "",
            projectsCount: bio?.projectCount || "",
            yearsExperience: bio?.yearsOfExperience || "",
            countryName: country?.name ?? personalInfo?.location ?? "",
            countryFlagUrl: country?.flag,
            avatarUrl: personalInfo?.image || undefined,
            showAvatar: portfolio.setting?.showProfilePicture ?? true,
            toolBadge: firstTool?.name || undefined,
            toolBadgeIconUrl: toolBadgeIconUrl || undefined,
        };
    }, [countries, portfolio]);

    const projects = useMemo(() => {
        return (portfolio?.projects ?? []).map((project, index) => ({
            id:
                project.id != null && String(project.id).trim() !== ""
                    ? String(project.id)
                    : String(project.coverImage ?? project.title ?? index),
            title: project.title || "Untitled",
            tags: project.category ? [project.category] : [],
            imageUrl:
                getImageUrl(
                    project.coverImage ??
                    (Array.isArray(project.projectFiles) && project.projectFiles[0]
                        ? String(project.projectFiles[0])
                        : null),
                ) || undefined,
        }));
    }, [portfolio?.projects]);

    const workItems = useMemo(() => {
        return (portfolio?.workExperience ?? []).map((work) => ({
            company: work.companyName || "",
            category: work.industry || "",
            role: work.jobTitle || "",
            duration: formatDuration(
                work.startDate,
                work.endDate,
                work.currentlyWorkThere,
            ),
            descriptions: normalizeJobDescriptions(work.jobDescription),
        }));
    }, [portfolio?.workExperience]);

    const specializations = useMemo(() => {
        const raw = (portfolio?.category?.specializationData ?? []) as unknown[];
        return mapSpecializationData(raw);
    }, [portfolio?.category?.specializationData]);

    const skills = useMemo(() => {
        const raw = (portfolio?.category?.skills ?? []) as unknown[];
        return mapSkillsData(raw);
    }, [portfolio?.category?.skills]);

    const tools = useMemo(() => {
        return (portfolio?.tools ?? []).map((tool) => ({
            name: tool.name || "",
            iconUrl: getImageUrl(tool.image ?? tool.url ?? undefined) || undefined,
            skillLevel: normalizeSkillLevel(tool.skillLevel ?? tool.skill_level),
        }));
    }, [portfolio?.tools]);

    const educationEntries = useMemo(() => {
        return (portfolio?.educationalBackground ?? []).map((education) => ({
            institution: education.schoolName || "",
            degree: education.qualification || "",
        }));
    }, [portfolio?.educationalBackground]);

    const categoryTitle = portfolio?.category?.title || "Product Designer";

    const footerContact = useMemo(() => {
        if (!portfolio?.personalInfo) return undefined;
        const personalInfo = portfolio.personalInfo;
        const country = countries.find((country) => country.code === personalInfo?.countryCode);
        const phone = personalInfo?.phoneNumber?.trim() ?? "";
        const email = personalInfo?.email?.trim() ?? "";
        const countryName = (country?.name ?? personalInfo?.location ?? "").trim();
        if (!phone && !email && !countryName) return undefined;

        return {
            phone: phone || "—",
            email: email || "—",
            country: countryName || "—",
            region: country?.subregion || country?.region || undefined,
            countryCode: personalInfo?.countryCode?.trim() || undefined,
        };
    }, [countries, portfolio?.personalInfo]);

    const footerSocialLinks = useMemo(() => {
        const social = portfolio?.social;
        const personalInfo = portfolio?.personalInfo;
        const hasSocial = social?.linkedIn || social?.twitter;
        const hasContact = personalInfo?.phoneNumber || personalInfo?.email;
        if (!hasSocial && !hasContact) return undefined;

        const links: { type: "twitter" | "linkedin" | "phone" | "mail"; href: string; label: string }[] = [];
        if (social?.linkedIn) {
            links.push({ type: "linkedin", href: social.linkedIn, label: "LinkedIn" });
        }
        if (social?.twitter) {
            links.push({ type: "twitter", href: social.twitter, label: "X (Twitter)" });
        }
        if (personalInfo?.phoneNumber) {
            links.push({
                type: "phone",
                href: `tel:${personalInfo.phoneNumber.replace(/\s/g, "")}`,
                label: "Phone",
            });
        }
        if (personalInfo?.email) {
            links.push({ type: "mail", href: `mailto:${personalInfo.email}`, label: "Email" });
        }

        return links.length > 0 ? links : undefined;
    }, [portfolio?.personalInfo, portfolio?.social]);

    return (
        <div className="overflow-hidden bg-white shadow-md rounded-2xl p-5">
            <BoldHero value={heroData} />
            <MyProjects projects={projects} showAddProject />
            <MyWorkExperience items={workItems} />
            <SkillsAndSpecialization skills={skills} specializations={specializations} />
            <MyTools
                tools={tools}
                title={categoryTitle}
                showToolsRate={portfolio?.setting?.showToolsRate ?? true}
                temp="bold"
            />
            <MyEducationBackground entries={educationEntries} />
            <Footer contact={footerContact} socialLinks={footerSocialLinks} />
        </div>
    );
};

export default BoldTemplate;

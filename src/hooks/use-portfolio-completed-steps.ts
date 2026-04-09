"use client";

import { useMemo } from "react";
import type { UserPortfolioData } from "@/features/portfolio/use-get-portfolio";

type Input = {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
  };
  socialData: {
    linkedIn: string;
    twitter: string;
  };
  bioData: {
    jobTitle: string;
    yearsOfExperience: string;
    lifeProjectsCount: string;
    bio: string;
  };
  specializationData: {
    category: string;
    selectedSpecializations: string[];
  };
  skillsData: {
    selectedSkills: string[];
  };
  toolsData: {
    selectedTools: string[];
  };
  workExperienceData: {
    entries: Array<{
      companyName: string;
      jobTitle: string;
      industry: string;
      jobDescription: string[];
      startDate: string;
      endDate: string;
    }>;
  };
  educationData: {
    entries: Array<{
      schoolName: string;
      qualification: string;
    }>;
  };
  portfolioData: UserPortfolioData | null | undefined;
};

export function usePortfolioCompletedSteps({
  personalInfo,
  socialData,
  bioData,
  specializationData,
  skillsData,
  toolsData,
  workExperienceData,
  educationData,
  portfolioData,
}: Input) {
  return useMemo(() => {
    const hasText = (value: string | null | undefined) => !!value?.trim();
    const p = portfolioData;
    const profile = p?.personalInfo;
    const backendPersonalInfoCompleted =
      hasText(profile?.firstName) ||
      hasText(profile?.lastName) ||
      hasText(profile?.email) ||
      hasText(profile?.countryCode) ||
      hasText(profile?.location);
    const backendSocialCompleted =
      hasText(p?.social?.linkedIn) || hasText(p?.social?.twitter);
    const backendBioCompleted =
      hasText(p?.bio?.jobTitle) ||
      hasText(p?.bio?.yearsOfExperience) ||
      hasText(p?.bio?.projectCount) ||
      hasText(p?.bio?.bio);
    const backendSpecializationCompleted =
      hasText(p?.category?.title) ||
      (p?.category?.specializationData?.length ?? 0) > 0;
    const backendSkillsCompleted = (p?.category?.skills?.length ?? 0) > 0;
    const backendToolsCompleted = (p?.tools?.length ?? 0) > 0;
    const backendWorkExperienceCompleted = (p?.workExperience?.length ?? 0) > 0;
    const backendEducationCompleted = (p?.educationalBackground?.length ?? 0) > 0;

    const isPersonalInfoCompleted =
      hasText(personalInfo.firstName) ||
      hasText(personalInfo.lastName) ||
      hasText(personalInfo.email) ||
      hasText(personalInfo.phone) ||
      hasText(personalInfo.countryCode) ||
      backendPersonalInfoCompleted;
    const isSocialCompleted =
      hasText(socialData.linkedIn) ||
      hasText(socialData.twitter) ||
      backendSocialCompleted;
    const isBioCompleted =
      hasText(bioData.jobTitle) ||
      hasText(bioData.yearsOfExperience) ||
      hasText(bioData.lifeProjectsCount) ||
      hasText(bioData.bio) ||
      backendBioCompleted;
    const isSpecializationCompleted =
      hasText(specializationData.category) ||
      specializationData.selectedSpecializations.length > 0 ||
      backendSpecializationCompleted;
    const isSkillsCompleted =
      skillsData.selectedSkills.length > 0 || backendSkillsCompleted;
    const isToolsCompleted =
      toolsData.selectedTools.length > 0 || backendToolsCompleted;
    const isWorkExperienceCompleted =
      workExperienceData.entries.some(
        (entry) =>
          hasText(entry.companyName) ||
          hasText(entry.jobTitle) ||
          hasText(entry.industry) ||
          entry.jobDescription.some((line) => hasText(line)) ||
          hasText(entry.startDate) ||
          hasText(entry.endDate),
      ) || backendWorkExperienceCompleted;
    const isEducationCompleted =
      educationData.entries.some(
        (entry) => hasText(entry.schoolName) || hasText(entry.qualification),
      ) || backendEducationCompleted;

    return [
      isPersonalInfoCompleted ? 1 : null,
      isSocialCompleted ? 2 : null,
      isBioCompleted ? 3 : null,
      isSpecializationCompleted ? 4 : null,
      isSkillsCompleted ? 5 : null,
      isToolsCompleted ? 6 : null,
      isWorkExperienceCompleted ? 7 : null,
      isEducationCompleted ? 8 : null,
    ].filter((stepId): stepId is number => stepId !== null);
  }, [
    personalInfo,
    socialData,
    bioData,
    specializationData,
    skillsData.selectedSkills,
    toolsData.selectedTools,
    workExperienceData.entries,
    educationData.entries,
    portfolioData,
  ]);
}

"use client";

import { useMemo } from "react";
import type { PersonalInfoData } from "@/components/_core/dashboard/portfolio/personal-info";
import type { YourSocialData } from "@/components/_core/dashboard/portfolio/your-social";
import type { YourToolsData } from "@/components/_core/dashboard/portfolio/your-tools";
import type { WorkExperienceData } from "@/components/_core/dashboard/portfolio/work-experience";
import type { EducationBackgroundData } from "@/components/_core/dashboard/portfolio/education-background";

type Input = {
  step: number;
  personalInfo: PersonalInfoData;
  socialData: YourSocialData;
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
  toolsData: YourToolsData;
  workExperienceData: WorkExperienceData;
  educationData: EducationBackgroundData;
};

export function useCanContinuePortfolioStep({
  step,
  personalInfo,
  socialData,
  bioData,
  specializationData,
  skillsData,
  toolsData,
  workExperienceData,
  educationData,
}: Input) {
  return useMemo(() => {
    const hasText = (value: string | null | undefined) => !!value?.trim();

    if (step === 1) {
      return (
        hasText(personalInfo.firstName) &&
        hasText(personalInfo.lastName) &&
        hasText(personalInfo.email) &&
        hasText(personalInfo.phone) &&
        hasText(personalInfo.countryCode)
      );
    }

    if (step === 2) {
      return hasText(socialData.linkedIn);
    }

    if (step === 3) {
      return (
        hasText(bioData.jobTitle) &&
        hasText(bioData.yearsOfExperience) &&
        hasText(bioData.lifeProjectsCount) &&
        hasText(bioData.bio)
      );
    }

    if (step === 4) {
      return (
        hasText(specializationData.category) &&
        specializationData.selectedSpecializations.length > 0
      );
    }

    if (step === 5) {
      return skillsData.selectedSkills.length > 0;
    }

    if (step === 6) {
      return toolsData.selectedTools.length > 0;
    }

    if (step === 7) {
      const entries = workExperienceData.entries;
      const isEntryComplete = (entry: (typeof entries)[number]) =>
        hasText(entry.companyName) &&
        hasText(entry.jobTitle) &&
        hasText(entry.industry) &&
        entry.jobDescription.some((line) => hasText(line)) &&
        hasText(entry.startDate) &&
        (entry.currentlyWorkHere || hasText(entry.endDate));

      const nonEmptyEntries = entries.filter(
        (entry) =>
          hasText(entry.companyName) ||
          hasText(entry.jobTitle) ||
          hasText(entry.industry) ||
          entry.jobDescription.some((line) => hasText(line)) ||
          hasText(entry.startDate) ||
          hasText(entry.endDate) ||
          entry.currentlyWorkHere,
      );

      if (nonEmptyEntries.length === 0) return false;
      return nonEmptyEntries.every(isEntryComplete);
    }

    if (step === 8) {
      const entries = educationData.entries;
      const nonEmptyEntries = entries.filter(
        (entry) => hasText(entry.schoolName) || hasText(entry.qualification),
      );
      if (nonEmptyEntries.length === 0) return false;
      return nonEmptyEntries.every(
        (entry) => hasText(entry.schoolName) && hasText(entry.qualification),
      );
    }

    return true;
  }, [
    step,
    personalInfo,
    socialData,
    bioData,
    specializationData,
    skillsData.selectedSkills,
    toolsData.selectedTools,
    workExperienceData.entries,
    educationData.entries,
  ]);
}

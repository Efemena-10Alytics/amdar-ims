"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { UserPortfolioData } from "./use-get-portfolio";

type Options = {
  portfolio: UserPortfolioData | null | undefined;
  isLoading: boolean;
  hasError: boolean;
  redirectTo?: string;
};

export function hasCompletedPortfolioSections(
  portfolio: UserPortfolioData | null | undefined,
): boolean {
  if (!portfolio) return true;
  const hasText = (value: string | null | undefined) => !!value?.trim();

  // Completeness gate for redirect logic: require all non-project sections.
  // Projects are intentionally excluded so users can still access the portfolio page
  // before adding any project items.
  const hasPersonalInfo =
    hasText(portfolio.personalInfo?.firstName) ||
    hasText(portfolio.personalInfo?.lastName) ||
    hasText(portfolio.personalInfo?.email) ||
    hasText(portfolio.personalInfo?.phoneNumber) ||
    hasText(portfolio.personalInfo?.location) ||
    hasText(portfolio.personalInfo?.countryCode) ||
    hasText(portfolio.personalInfo?.image);
  const hasSocial =
    hasText(portfolio.social?.linkedIn) || hasText(portfolio.social?.twitter);
  const hasBio =
    hasText(portfolio.bio?.jobTitle) ||
    hasText(portfolio.bio?.yearsOfExperience) ||
    hasText(portfolio.bio?.projectCount) ||
    hasText(portfolio.bio?.bio);
  const hasCategory =
    hasText(portfolio.category?.title) ||
    (portfolio.category?.specializationData?.length ?? 0) > 0 ||
    (portfolio.category?.skills?.length ?? 0) > 0;
  const hasTools = (portfolio.tools?.length ?? 0) > 0;
  const hasWorkExperience = (portfolio.workExperience?.length ?? 0) > 0;
  const hasEducation = (portfolio.educationalBackground?.length ?? 0) > 0;

  return (
    hasPersonalInfo &&
    hasSocial &&
    hasBio &&
    hasCategory &&
    hasTools &&
    hasWorkExperience &&
    hasEducation
  );
}

export function usePortfolioCompletionRedirect({
  portfolio,
  isLoading,
  hasError,
  redirectTo = "/dashboard/portfolio/create-portfolio",
}: Options) {
  const router = useRouter();

  const shouldRedirectToCreate = useMemo(
    () => !hasCompletedPortfolioSections(portfolio),
    [portfolio],
  );

  useEffect(() => {
    if (isLoading || hasError) return;
    if (!shouldRedirectToCreate) return;
    router.replace(redirectTo);
  }, [isLoading, hasError, shouldRedirectToCreate, router, redirectTo]);

  return { shouldRedirectToCreate };
}

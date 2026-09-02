"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ProfileDetailsCard,
  ProfileDetailsErrorCard,
  type TenAnalyticsOnboardingProfile,
} from "@/components/_core/10nalytics-onboarding/profile-details-card";
import {
  useGetTenAnalyticsOnboardingProfile,
  type TenAnalyticsOnboardingProfileData,
} from "@/features/10nalytics/use-get-profile";
import Flag from "../landing-pages/home/hero/flag";
import { COMPANY_LOGOS } from "@/constants/company-logos";

const FLOATING_AVATARS = [
  {
    src: "/images/svgs/become-partners/hero-avatar-1.svg",
    className: "left-[-8%] top-[8%] hidden lg:block",
    cursorClass: "text-pink-400",
  },
  {
    src: "/images/svgs/become-partners/hero-avatar-3.svg",
    className: "left-[-12%] top-[42%] hidden md:block",
    cursorClass: "text-emerald-400",
  },
  {
    src: "/images/svgs/become-partners/hero-avatar-2.svg",
    className: "right-[-10%] bottom-[18%] hidden lg:block",
    cursorClass: "text-amber-400",
  },
] as const;

function ProceedArrowIcon() {
  return (
    <span className="flex size-6 items-center justify-center rounded-full bg-[#FFE082]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M16.5 8V14.5C16.5 14.6326 16.4476 14.7598 16.3538 14.8536C16.26 14.9473 16.1329 15 16 15C15.8677 15 15.7405 14.9473 15.6467 14.8536C15.553 14.7598 15.5 14.6326 15.5 14.5V9.20687L8.35403 16.3538C8.26021 16.4476 8.13296 16.5003 8.00028 16.5003C7.8676 16.5003 7.74035 16.4476 7.64653 16.3538C7.55271 16.2599 7.5 16.1327 7.5 16C7.5 15.8673 7.55271 15.7401 7.64653 15.6462L14.7934 8.5H9.50028C9.36767 8.5 9.24049 8.44732 9.14672 8.35355C9.05296 8.25979 9.00028 8.13261 9.00028 8C9.00028 7.86739 9.05296 7.74021 9.14672 7.64645C9.24049 7.55268 9.36767 7.5 9.50028 7.5H16C16.1329 7.5 16.26 7.55268 16.3538 7.64645C16.4476 7.74021 16.5 7.86739 16.5 8Z"
          fill="#156374"
        />
      </svg>
    </span>
  );
}

function formatCohortLabel(
  cohort: TenAnalyticsOnboardingProfileData["cohort"],
): string {
  if (cohort.month && cohort.year) {
    return `${cohort.month} ${cohort.year}`;
  }
  return cohort.name || "—";
}

function mapProfileToCard(
  email: string,
  data: TenAnalyticsOnboardingProfileData,
): TenAnalyticsOnboardingProfile {
  return {
    tenAnalyticsCohort: formatCohortLabel(data.cohort),
    tenAnalyticsProgram: data.program.title || "—",
    podName: data.student.pod_name || "—",
    firstName: data.user.first_name || "—",
    lastName: data.user.last_name || "—",
    email: data.user.email || email,
    phoneNumber: data.user.phone_number || "—",
    amdariCohort: formatCohortLabel(data.cohort),
    amdariProgram: data.program.title || "—",
    location: "—",
  };
}

type TenAnalyticsOnboardingProps = {
  email: string;
};

export default function TenAnalyticsOnboarding({
  email,
}: TenAnalyticsOnboardingProps) {
  const { data, isLoading, isError } =
    useGetTenAnalyticsOnboardingProfile(email);

  const resolvedProfile = data ? mapProfileToCard(email, data) : null;
  const proceedHref = `/auth/sign-in?redirect=${encodeURIComponent("/onboarding")}&email=${encodeURIComponent(email)}`;

  return (
    <main className="relative min-h-screen overflow-hidden text-[#092A31]">
      <div className="app-width relative z-10 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <div className="mx-auto flex max-w-7xl justify-center">
          <Image
            src="/10alytics-x-amdari-logo.svg"
            alt="10Alytics and Amdari"
            width={410}
            height={45}
            className="h-auto w-full max-w-70 sm:max-w-85 lg:max-w-102.5"
            priority
          />
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl items-center gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-12 xl:gap-16">
          <div className="max-w-xl">
            <h1 className="font-clash-display text-4xl font-semibold leading-[1.08] text-[#092A31] sm:text-5xl lg:text-[3.25rem]">
              You&apos;ve Built the{" "}
              <span className="text-[#E87722]">Skills</span>
              <br />
              Now Build the{" "}
              <span className="text-[#E87722]">Experience.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#475467] sm:text-lg">
              Take what you&apos;ve learned at 10alytics into real-world projects
              with Amdari and gain the practical experience you need to move
              confidently into your career.
            </p>

            <Link
              href={proceedHref}
              className="mt-8 inline-flex h-14 items-center gap-3 rounded-full bg-[#156374] px-6 text-base font-semibold text-white transition hover:bg-[#124F5D] sm:px-8 sm:text-lg"
            >
              Proceed to internship
              <ProceedArrowIcon />
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[#64748B] sm:text-base">
              <Flag width={30} />
              <span>+ 30K interns Across the world Got hired</span>
            </div>

            <div className="relative mt-10 min-w-0 overflow-hidden">
              <div
                className="flex w-max gap-3 sm:gap-4"
                style={{
                  animation: "companies-scroll 45s linear infinite",
                }}
              >
                {[...COMPANY_LOGOS, ...COMPANY_LOGOS].map((company, index) => {
                  const isAmdari = company.src.includes("amdari");

                  return (
                    <div
                      key={`${company.src}-${index}`}
                      className={cn(
                        "flex size-24 shrink-0 items-center justify-center rounded-xs p-4 sm:size-28 sm:p-5",
                        isAmdari ? "bg-transparent" : "bg-[#E2E8F0]",
                      )}
                    >
                      <Image
                        src={company.src}
                        alt={company.alt}
                        width={140}
                        height={72}
                        className="max-h-14 w-auto max-w-full object-contain sm:max-h-16"
                      />
                    </div>
                  );
                })}
              </div>
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-[#F4EFE9] to-transparent sm:w-12"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-[#E8EFF1] to-transparent sm:w-12"
                aria-hidden
              />
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                    @keyframes companies-scroll {
                      0% {
                        transform: translateX(0);
                      }
                      100% {
                        transform: translateX(-50%);
                      }
                    }
                  `,
                }}
              />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-115 lg:mx-0 lg:justify-self-end">
            {FLOATING_AVATARS.map((avatar) => (
              <div
                key={avatar.src}
                className={cn(
                  "pointer-events-none absolute z-10 size-14 sm:size-16",
                  avatar.className,
                )}
                aria-hidden
              >
                <Image
                  src={avatar.src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}

            {isLoading ? (
              <div className="flex min-h-80 items-center justify-center rounded-3xl bg-white shadow-[0_20px_50px_rgba(15,70,82,0.1)]">
                <Loader2
                  className="size-8 animate-spin text-[#156374]"
                  aria-label="Loading profile"
                />
              </div>
            ) : isError ? (
              <ProfileDetailsErrorCard />
            ) : resolvedProfile ? (
              <ProfileDetailsCard profile={resolvedProfile} />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

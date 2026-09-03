import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/components/_core/landing-pages/shared/whatsapp-widget";

export type TenAnalyticsOnboardingProfile = {
  tenAnalyticsCohort: string;
  tenAnalyticsProgram: string;
  podName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  amdariCohort: string;
  amdariProgram: string;
  location: string;
  locationFlagSrc?: string;
};

type ProfileDetailsCardProps = {
  profile: TenAnalyticsOnboardingProfile;
  className?: string;
};

type ProfileDetailsErrorCardProps = {
  className?: string;
  supportHref?: string;
};

function BrokenImageIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-[#A6632D]"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
      <path
        d="M3.5 16.5L8 12.5L11 15L14.5 11L20.5 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileDetailsErrorCard({
  className,
  supportHref = WHATSAPP_URL,
}: ProfileDetailsErrorCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white p-5 shadow-[0_20px_50px_rgba(15,70,82,0.1)] sm:p-6",
        className,
      )}
    >
      <h2 className="text-lg font-semibold leading-7 text-[#092A31] sm:text-xl">
        Your Profile Details
      </h2>

      <div className="mt-4 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 bg-[#FFF4EA] px-5 py-8">
          <BrokenImageIcon />
          <p className="text-center text-base font-semibold text-[#A6632D]">
            Oops! Details not found!
          </p>
        </div>

        <div className="flex flex-col items-center bg-[#E8F2F6] px-5 pb-8 pt-10">
          <div
            className="relative select-none font-clash-display text-[7.5rem] font-semibold leading-none tracking-tight text-[#B5C7CD] sm:text-[8.5rem]"
            aria-hidden
          >
            <span>4</span>
            <span className="relative inline-block">
              0
              <span className="absolute inset-0 flex items-center justify-center text-[0.7rem] font-medium tracking-normal text-[#92A8B0]">
                Error
              </span>
            </span>
            <span>4</span>
          </div>

          <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-[#64748B]">
            Sorry we couldn&apos;t find your details, contact support!
          </p>

          <Link
            href={supportHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#156374] px-6 text-sm font-semibold text-white transition hover:bg-[#124F5D]"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueContent,
}: {
  label: string;
  value?: string;
  valueContent?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-1.5">
      <span className="shrink-0 text-sm leading-5 text-[#64748B]">{label}</span>
      {valueContent ?? (
        <span className="text-right text-sm font-medium leading-5 text-[#092A31]">
          {value || "—"}
        </span>
      )}
    </div>
  );
}

function PartnerFlags() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/images/svgs/country/UK.svg"
        width={28}
        height={28}
        alt="United Kingdom"
        className="rounded-full ring-2 ring-white"
      />
      <Image
        src="/images/svgs/country/CAD.svg"
        width={28}
        height={28}
        alt="Canada"
        className="-ml-2.5 rounded-full ring-2 ring-white"
      />
      <Image
        src="/images/svgs/country/USA.svg"
        width={28}
        height={28}
        alt="United States"
        className="-ml-2.5 rounded-full ring-2 ring-white"
      />
    </div>
  );
}

export function ProfileDetailsCard({
  profile,
  className,
}: ProfileDetailsCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white p-5 shadow-[0_20px_50px_rgba(15,70,82,0.1)] sm:p-6",
        className,
      )}
    >
      <h2 className="text-lg font-semibold leading-7 text-[#092A31] sm:text-xl">
        Your Profile Details
      </h2>

      <div className="relative mt-2">
        <div className="rounded-2xl bg-[#FFF4EA] p-5">
          <h3 className="text-base font-semibold leading-6 text-[#A6632D]">
            10Alytics Details
          </h3>

          <div className="mt-3">
            <DetailRow label="10A Cohort" value={profile.tenAnalyticsCohort} />
            <DetailRow
              label="10A Program"
              value={profile.tenAnalyticsProgram}
            />
            <DetailRow label="POD Name" value={profile.podName} />
          </div>
        </div>

        <div className="relative z-10 -my-3.5 flex justify-center">
          <PartnerFlags />
        </div>

        <div className="rounded-2xl bg-[#E8F2F6] px-5 pb-5 pt-7">
          <h3 className="text-base font-semibold leading-6 text-[#092A31]">
            Amdari Details
          </h3>

          <div className="mt-3">
            <DetailRow label="First name" value={profile.firstName} />
            <DetailRow label="Last name" value={profile.lastName} />
            <DetailRow label="Email" value={profile.email} />
            <DetailRow label="Phone number" value={profile.phoneNumber} />
            <DetailRow label="Cohort" value={profile.amdariCohort} />
            <DetailRow label="Program" value={profile.amdariProgram} />
            <DetailRow
              label="Location"
              valueContent={
                <span className="inline-flex items-center justify-end gap-1.5 text-sm font-medium leading-5 text-[#092A31]">
                  {profile.locationFlagSrc ? (
                    <Image
                      src={profile.locationFlagSrc}
                      alt=""
                      width={18}
                      height={18}
                      className="rounded-full"
                    />
                  ) : null}
                  {profile.location || "—"}
                </span>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

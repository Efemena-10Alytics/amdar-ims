import Image from "next/image";
import { cn } from "@/lib/utils";

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

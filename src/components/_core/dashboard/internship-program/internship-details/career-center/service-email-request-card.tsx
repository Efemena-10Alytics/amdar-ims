"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { CalendarCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoToastBanner } from "@/components/ui/info-toast-banner";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import {
  getGlobalTalentEmailErrorMessage,
  useSendGlobalTalentEmail,
} from "@/features/global-talent-email/use-send-global-talent-email";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { cn } from "@/lib/utils";
import { formatGmtPlus1Range } from "@/lib/timezone";
import {
  resolveUserEmail,
  resolveUserFullName,
  unwrapUser,
} from "@/lib/user-profile";
import { useAuthStore } from "@/store/auth-store";

const SERVICE_FLAGS = [
  { src: "/images/svgs/country/UK.svg", alt: "United Kingdom" },
  { src: "/images/svgs/country/USA.svg", alt: "United States" },
];

export type ServiceEmailRequestTheme = {
  iconWrap: string;
  panel: string;
  calendar: string;
  badge: string;
  button: string;
};

type ServiceEmailRequestCardProps = {
  title: string;
  description: string;
  requestTitle: string;
  icon: ReactNode;
  theme: ServiceEmailRequestTheme;
};

export const TEAL_SERVICE_THEME: ServiceEmailRequestTheme = {
  iconWrap: "bg-[#E8F4F8] text-[#1A6B8A]",
  panel: "bg-[#E8EFF1]",
  calendar: "bg-[#0E6174] text-white",
  badge: "bg-[#D4EBF1] text-[#0B2B33]",
  button:
    "border-[#134E5E] bg-[#E8F4F8] text-[#134E5E] hover:bg-[#D4EBF1] hover:text-[#0E6174]",
};

export const BLUE_SERVICE_THEME: ServiceEmailRequestTheme = {
  iconWrap: "bg-[#E8F0FE] text-[#2563EB]",
  panel: "bg-[#EEF4FF]",
  calendar: "bg-[#2563EB] text-white",
  badge: "bg-[#DBE7FF] text-[#0B2B33]",
  button:
    "border-[#2563EB] bg-[#EEF4FF] text-[#1D4ED8] hover:bg-[#DBE7FF] hover:text-[#1E40AF]",
};

const ServiceEmailRequestCard = ({
  title,
  description,
  requestTitle,
  icon,
  theme,
}: ServiceEmailRequestCardProps) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const availabilityHours = formatGmtPlus1Range("14:00", "23:00");

  const { data: enrollment } = useGetUserEnrollment();
  const authUser = useAuthStore((state) => state.user);
  const { data: userInfo } = useGetUserInfo();
  const { mutateAsync, isPending } = useSendGlobalTalentEmail();

  const userRecord = unwrapUser(userInfo ?? authUser);
  const fullName = resolveUserFullName(userRecord);
  const email = resolveUserEmail(userRecord);
  const cohortName = enrollment?.cohort?.name?.trim() ?? "";
  const programTitle =
    enrollment?.program?.title?.trim() ||
    enrollment?.program?.intern_title?.trim() ||
    enrollment?.program?.internship_title?.trim() ||
    "";

  const handleSendRequest = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!fullName || !email) {
      setErrorMessage("Unable to load your profile details. Please try again.");
      return;
    }

    try {
      const response = await mutateAsync({
        title: requestTitle,
        name: fullName,
        email,
        program: programTitle || "N/A",
        cohort: cohortName || "N/A",
      });
      setSuccessMessage(
        response.message?.trim() || "Your request has been sent successfully.",
      );
    } catch (error) {
      setErrorMessage(getGlobalTalentEmailErrorMessage(error));
    }
  };

  return (
    <div className="flex h-full flex-col">
      <section className="flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#0B2B33]">{title}</h3>
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              theme.iconWrap,
            )}
            aria-hidden
          >
            {icon}
          </span>
        </div>

        <div className={cn("mt-4 rounded-xl p-4", theme.panel)}>
          <p className="text-sm leading-relaxed text-[#475467]">{description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-md",
                theme.calendar,
              )}
              aria-hidden
            >
              <CalendarCheck className="size-5" strokeWidth={2.5} />
            </span>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium",
                theme.badge,
              )}
            >
              Mon - Fri {availabilityHours}
            </span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-5 pt-4">
          <div className="flex items-center">
            {SERVICE_FLAGS.map((flag, index) => (
              <span
                key={flag.alt}
                className={cn(
                  "relative flex size-8 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm",
                  index > 0 && "-ml-2",
                )}
              >
                <Image
                  src={flag.src}
                  alt={flag.alt}
                  width={32}
                  height={32}
                  className="size-full object-cover"
                />
              </span>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              void handleSendRequest();
            }}
            className={cn(
              "h-11 w-full rounded-full text-sm font-semibold",
              theme.button,
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send request"
            )}
          </Button>
        </div>
      </section>

      {successMessage ? (
        <InfoToastBanner
          message={successMessage}
          onDismiss={() => setSuccessMessage("")}
        />
      ) : null}

      {errorMessage ? (
        <InfoToastBanner
          variant="danger"
          message={errorMessage}
          onDismiss={() => setErrorMessage("")}
        />
      ) : null}
    </div>
  );
};

export default ServiceEmailRequestCard;

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Check, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import {
  getStudentDisplayName,
} from "@/features/onboarding/use-get-onboarding";
import { ONBOARDING_CHECKLIST_ITEMS } from "@/features/onboarding/types";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { isOnboardingEnrollmentStepComplete } from "@/features/internship/use-update-completed-onboarding-step";
import { useUpdateWhatsappVerification } from "@/features/internship/use-update-whatsapp-verification";
import { isEnrollmentWhatsappVerified } from "@/features/internship/resolve-enrollment-journey";
import { getInternsWhatsappGroupUrl } from "@/constants/interns-whatsapp-group";
import Flag from "../landing-pages/home/hero/flag";
import { Button } from "@/components/ui/button";
import { WhatsappSVG } from "./svg";
import SideNavExpandCollapse from "../side-nav-expand-collapse";

const Aside = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const { data: enrollment } = useGetUserEnrollment();
  const { updateVerification, isUpdating } = useUpdateWhatsappVerification();
  const activeStep = searchParams.get("step") ?? ONBOARDING_CHECKLIST_ITEMS[0].key;
  const studentName = getStudentDisplayName(user);
  const welcomeLabel = studentName ? `WELCOME ${studentName.toUpperCase()}!` : "WELCOME!";
  const onboardingStepsCompleted = enrollment?.isOnboardingStepsCompleted;
  const whatsappGroupUrl = getInternsWhatsappGroupUrl(
    enrollment?.program,
    enrollment?.cohort,
  );
  const isWhatsappVerified = isEnrollmentWhatsappVerified(enrollment);

  useEffect(() => {
    if (!enrollment?.program) return;

    console.log(
      "[onboarding aside] internship_title:",
      enrollment.program.internship_title ?? enrollment.program.intern_title,
    );
  }, [enrollment?.program]);

  const handleJoinCommunity = () => {
    if (!whatsappGroupUrl) return;

    window.open(whatsappGroupUrl, "_blank", "noopener,noreferrer");

    if (enrollment?.isVerifiedWhatsapp) return;

    void updateVerification(true).catch(() => {
      // Best-effort: WhatsApp should still open even if verification fails.
    });
  };

  return (
    <aside
      className={cn(
        "relative hidden overflow-visible rounded-l-xl bg-[#0F6A79] py-5 text-white transition-[width,padding] duration-300 lg:flex lg:flex-col xl:py-6",
        isCollapsed
          ? "lg:w-24 px-4 xl:px-4"
          : "lg:w-[45%] px-4 xl:w-[42%] xl:px-5",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link href="/" className="inline-flex w-fit">
          {isCollapsed ? (
            <Image
              src="/favicon-white.svg"
              height={28}
              width={36}
              alt="amdari"
              className="h-7 w-7 object-contain object-left"
            />
          ) : (
            <Image
              src="/logo-white.svg"
              height={28}
              width={126}
              alt="amdari"
              className="object-contain object-left"
            />
          )}
        </Link>
        <SideNavExpandCollapse
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((value) => !value)}
        />
      </div>

      <div className="mt-9 flex min-h-0 grow flex-col overflow-y-auto">
        <div className={cn(isCollapsed && "sr-only")}>
          <h2 className="text-lg font-semibold text-white">{welcomeLabel}</h2>
          <p className="mt-1 text-sm text-[#C4DEE3]">
            Let&apos;s make your onboarding journey smooth
          </p>
        </div>

        <div
          className={cn(
            "mt-8 rounded-[14px] bg-[#EDFCF2]",
            isCollapsed ? "px-3 py-5" : "p-5",
          )}
        >
          <h3
            className={cn(
              "text-lg leading-tight font-semibold text-[#173740]",
              isCollapsed && "sr-only",
            )}
          >
            Complete the following to get started
          </h3>

          <ul className={cn("space-y-6", isCollapsed ? "mt-0" : "mt-4")}>
            {ONBOARDING_CHECKLIST_ITEMS.map((item, index) => {
              const isActive = activeStep === item.key;
              const isCompleted = isOnboardingEnrollmentStepComplete(
                onboardingStepsCompleted,
                item.key,
              );
              const isLast = index === ONBOARDING_CHECKLIST_ITEMS.length - 1;

              return (
                <li key={item.key} className="relative">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                    className={cn(
                      "absolute top-4.5 z-0 h-13 w-px bg-[#ACF0C5]",
                      isCollapsed ? "left-1/2 -translate-x-1/2" : "left-1.75",
                    )}
                    />
                  )}

                  <div
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "relative flex items-start gap-3",
                      isCollapsed && "justify-center",
                    )}
                  >
                    <span
                      className={`relative z-10 mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${isCompleted
                        ? "h-2 w-2 border-transparent bg-[#C7F5D8] text-[#1F5D36]"
                        : isActive
                          ? "border-transparent text-[#5F8D8D]"
                          : "rounded-full border-[#ACF0C5] bg-[#EDFCF2] text-transparent"
                        }`}
                    >
                      {isCompleted ? (
                        <Check className="size-3.5" strokeWidth={3} />
                      ) : isActive ? (
                        <Loader
                          size={20}
                          className="animation-duration-[1.8s] size-10 animate-spin"
                        />
                      ) : null}
                    </span>

                    <span
                      className={cn(
                        "text-base leading-tight",
                        isCompleted
                          ? "text-[#3B7E58]"
                          : isActive
                            ? "text-[#3B465F]"
                            : "text-[#A1A8B1]",
                        isCollapsed && "sr-only",
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className={cn(
            "mt-5 flex items-center gap-1.5 text-sm font-medium text-[#B7D2D8]",
            isCollapsed && "justify-center",
          )}
        >
          <Flag width={18} />
          <span className={cn(isCollapsed && "sr-only")}>
            +10K interns Across the world Got hired
          </span>
        </div>
      </div>
      {whatsappGroupUrl ? (
        <div className={cn("mb-10 space-y-2", isCollapsed && "flex justify-center")}>
          <Button
            type="button"
            onClick={handleJoinCommunity}
            disabled={isUpdating}
            className={cn(
              "h-11 cursor-pointer rounded-full bg-[#ACF0C5] text-[#092A31] hover:bg-[#ACF0C5]/80",
              isCollapsed ? "w-11 px-0" : "w-full",
            )}
          >
            <WhatsappSVG />
            <span className={cn(isCollapsed && "sr-only")}>Join Our community</span>
          </Button>
          {!isWhatsappVerified && !isCollapsed ? (
            <p className="text-center text-xs text-[#C4DEE3]">
              Join the community to continue to pre-diagnostic.
            </p>
          ) : null}
        </div>
      ) : (
        <Button
          type="button"
          disabled
          className={cn(
            "mb-10 h-11 rounded-full bg-[#ACF0C5] text-[#092A31] opacity-70",
            isCollapsed ? "w-11 px-0" : "w-full",
          )}
        >
          <WhatsappSVG />
          <span className={cn(isCollapsed && "sr-only")}>Join Our community</span>
        </Button>
      )}
    </aside>
  );
};

export default Aside;

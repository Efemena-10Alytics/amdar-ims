"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getInternsWhatsappGroupUrl } from "@/constants/interns-whatsapp-group";
import { isEnrollmentWhatsappVerified } from "@/features/internship/resolve-enrollment-journey";
import { useUpdateWhatsappVerification } from "@/features/internship/use-update-whatsapp-verification";
import type { UserEnrollment } from "@/types/user/enrollment";
import { WhatsappSVG } from "./svg";

type OnboardingSettingUpProps = {
  enrollment?: UserEnrollment | null;
};

export function OnboardingSettingUp({ enrollment }: OnboardingSettingUpProps) {
  const { updateVerification, isUpdating } = useUpdateWhatsappVerification();
  const whatsappGroupUrl = getInternsWhatsappGroupUrl(
    enrollment?.program,
    enrollment?.cohort,
  );

  const handleJoinChannel = () => {
    if (!whatsappGroupUrl) return;

    window.open(whatsappGroupUrl, "_blank", "noopener,noreferrer");

    if (isEnrollmentWhatsappVerified(enrollment)) return;

    void updateVerification(true).catch(() => {
      // Best-effort: WhatsApp should still open even if verification fails.
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-10 sm:px-8">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="overflow-hidden shadow-sm">
          <Image
            src="/ready.svg"
            alt="We are setting up your onboarding"
            width={280}
            height={280}
            className="size-48 object-cover sm:size-56"
            priority
          />
        </div>

        <h1 className="mt-8 text-2xl font-semibold leading-tight text-[#173740] sm:text-[2rem]">
          Super excited to have you here, we are currently setting up
        </h1>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#64748B] sm:text-base">
          Mean while join your communication channel to meet others that are
          waiting
        </p>

        {whatsappGroupUrl ? (
          <Button
            type="button"
            onClick={handleJoinChannel}
            disabled={isUpdating}
            className="mt-8 h-12 w-full max-w-sm gap-2 rounded-full bg-[#ACF0C5] text-base font-medium text-[#092A31] hover:bg-[#ACF0C5]/80"
          >
            <WhatsappSVG />
            Join your channel
          </Button>
        ) : (
          <Button
            type="button"
            disabled
            className="mt-8 h-12 w-full max-w-sm gap-2 rounded-full bg-[#ACF0C5] text-base font-medium text-[#092A31] opacity-70"
          >
            <WhatsappSVG />
            Join your channel
          </Button>
        )}
      </div>
    </div>
  );
}

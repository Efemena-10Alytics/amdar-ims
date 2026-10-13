"use client";

import Image from "next/image";
import {
  WelcomeCountdownRow,
  type WelcomeCountdown,
} from "@/components/_core/dashboard/dashboard/welcome/welcome-shared";

type WelcomeStartedProps = {
  displayName: string;
  countdown: WelcomeCountdown;
};

const WelcomeStarted = ({ displayName, countdown }: WelcomeStartedProps) => {
  return (
    <section className="@container h-full w-full min-h-52 overflow-hidden rounded-2xl bg-[#0B2B33]">
      <div className="grid h-full items-center gap-6 p-5 sm:p-6 @[42rem]:grid-cols-[1fr_auto] @[42rem]:gap-4 @[42rem]:p-8">
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Welcome {displayName}! <span aria-hidden>👋</span>
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
              Welcome to Amdari where we guide you with real world project into
              landing a job
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-xl bg-[#F5C84C] px-3 py-3 sm:px-4">
            <WelcomeCountdownRow countdown={countdown} variant="active" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs @[42rem]:mx-0 @[42rem]:max-w-sm">
          <Image
            src="/images/svgs/dashboard/cuate.svg"
            alt="Interns working at their desks"
            width={400}
            height={280}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default WelcomeStarted;

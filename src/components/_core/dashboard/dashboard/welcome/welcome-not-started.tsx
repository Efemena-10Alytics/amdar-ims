"use client";

import Image from "next/image";
import {
  WelcomeCountdownRow,
  type WelcomeCountdown,
} from "@/components/_core/dashboard/dashboard/welcome/welcome-shared";

type WelcomeNotStartedProps = {
  displayName: string;
  countdown: WelcomeCountdown;
};

const WelcomeNotStarted = ({
  displayName,
  countdown,
}: WelcomeNotStartedProps) => {
  return (
    <section className="@container relative h-full w-full min-h-52 overflow-hidden rounded-2xl bg-[#0B2B33]">
      {/* Curved yellow panel only when the card itself is wide enough */}
      <div
        className="pointer-events-none absolute inset-y-[-20%] left-0 hidden w-[48%] rounded-r-[140%] bg-[#FFE082] @[42rem]:block"
        aria-hidden
      />

      <div className="relative grid h-full min-h-52 items-center gap-5 p-5 sm:p-6 @[42rem]:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] @[42rem]:gap-8 @[42rem]:p-8">
        <div className="relative z-10 flex flex-col items-center justify-center rounded-2xl bg-[#FFE082] px-4 py-5 text-center @[42rem]:rounded-none @[42rem]:bg-transparent @[42rem]:px-0 @[42rem]:py-0">
          <p className="text-sm font-semibold text-[#0B2B33] sm:text-base">
            Countdown to your program start
          </p>
          <div className="mt-4">
            <WelcomeCountdownRow countdown={countdown} variant="prestart" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center @[42rem]:pl-2">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Welcome <br className="@[42rem]:hidden" /> {displayName}!{" "}
            <span aria-hidden>👋</span>
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80 sm:text-base">
            Your consulting experience is starting soon
          </p>
          <div className="mt-2" aria-hidden>
            <Image
              src="/images/svgs/undeline-dashboard.svg"
              alt=""
              width={120}
              height={12}
              className="h-3 w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeNotStarted;

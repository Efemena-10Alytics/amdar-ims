"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SETUP_HREF = "/setup";

const PROFILE_SETUP_STEPS = [
  { key: "name-your-buddy", label: "Name your buddy" },
] as const;

type ProfileSetupStep = (typeof PROFILE_SETUP_STEPS)[number]["key"];

function resolveCurrentStep(stepParam: string | null): ProfileSetupStep {
  const defaultStep = PROFILE_SETUP_STEPS[0].key;
  if (!stepParam) return defaultStep;

  const matched = PROFILE_SETUP_STEPS.find((item) => item.key === stepParam)?.key;
  return matched ?? defaultStep;
}

function getStepIndex(stepKey: ProfileSetupStep) {
  return PROFILE_SETUP_STEPS.findIndex((item) => item.key === stepKey);
}

function getItemStatus(itemIndex: number, currentIndex: number) {
  return itemIndex < currentIndex ? "done" : "todo";
}

const SetupAside = () => {
  const searchParams = useSearchParams();
  const currentStepKey = resolveCurrentStep(searchParams.get("step"));
  const currentStepIndex = getStepIndex(currentStepKey);

  return (
    <aside className="hidden overflow-y-auto rounded-l-xl bg-[#156F7D] px-5 py-6 text-white lg:flex lg:w-[45%] lg:flex-col xl:w-[42%] xl:px-6 xl:py-7">
      <Link href="/" className="inline-flex w-fit">
        <Image src="/logo-white.svg" height={25} width={126} alt="amdari" />
      </Link>

      <div className="mt-10 flex grow flex-col">
        <div className="px-1">
          <h2 className="text-base font-bold tracking-tight text-white">PROFILE SETUP</h2>
          <p className="mt-1 text-sm font-medium text-[#C4DEE3]">
            Let&apos;s make your onboarding journey smooth
          </p>
        </div>

        <section className="mt-8 overflow-hidden rounded-xl bg-[#0F6371]">
          <div className="flex min-h-12 items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
            <h3 className="text-base font-semibold text-white">Profile setup</h3>
            <ChevronRight
              className="size-4 rotate-90 text-white"
              strokeWidth={3}
              aria-hidden
            />
          </div>

          <ul className="space-y-3 px-4 py-4">
            {PROFILE_SETUP_STEPS.map((item, index) => {
              const status = getItemStatus(index, currentStepIndex);
              const isDone = status === "done";
              const isCurrent = item.key === currentStepKey;

              return (
                <li
                  key={item.key}
                  className="grid grid-cols-[1fr_auto] items-center gap-3"
                >
                  <Link
                    href={`${SETUP_HREF}?step=${item.key}`}
                    aria-current={isCurrent ? "step" : undefined}
                    className="flex min-w-0 items-center gap-2.5"
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[3px] border",
                        isDone
                          ? "border-transparent bg-[#BDF3D0] text-[#1F7A4A]"
                          : "border-[#8BB9C1] text-transparent",
                      )}
                    >
                      {isDone ? <Check className="size-3" strokeWidth={3} /> : null}
                    </span>
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        isCurrent ? "text-white" : "text-[#A9D0D7]",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-semibold leading-none",
                      isDone
                        ? "bg-[#CFF6DA] text-[#238A50]"
                        : "border border-[#7EAAB2] text-[#9EC5CC]",
                    )}
                  >
                    {isDone ? "Done" : "Todo"}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </aside>
  );
};

export default SetupAside;

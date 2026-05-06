"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Check, Loader } from "lucide-react";
import Flag from "../landing-pages/home/hero/flag";

const CHECKLIST_ITEMS = [
  { key: "orientation-video", label: "Your orientation video" },
  {
    key: "internship-structure-video",
    label: "Your internship structure video",
  },
  { key: "cohort-lead", label: "Meet Your Cohort Lead" },
  { key: "internship-rules", label: "Internship rules & etiquettes" },
  { key: "installation-videos", label: "Installation videos" },
  { key: "readiness-test", label: "Readiness test" },
];

const Aside = () => {
  const searchParams = useSearchParams();
  const activeStep = searchParams.get("step") ?? CHECKLIST_ITEMS[0].key;

  return (
    <aside className="hidden overflow-y-auto rounded-l-xl bg-[#0F6A79] px-4 py-5 text-white lg:flex lg:w-[45%] lg:flex-col xl:w-[42%] xl:px-5 xl:py-6">
      <Link href="/" className="inline-flex w-fit">
        <Image src="/logo-white.svg" height={28} width={126} alt="amdari" />
      </Link>

      <div className="mt-9 flex grow flex-col">
        <div>
          <h2 className="text-lg font-semibold text-white">WELCOME AMBER!</h2>
          <p className="mt-1 text-sm text-[#C4DEE3]">
            Let&apos;s make your onboarding journey smooth
          </p>
        </div>

        <div className="mt-8 rounded-[14px] bg-[#EDFCF2] p-5">
          <h3 className="text-lg leading-tight font-semibold text-[#173740]">
            Complete the following to get started
          </h3>

          <ul className="mt-4 space-y-6">
            {CHECKLIST_ITEMS.map((item, index) => {
              const isActive = activeStep === item.key;
              const activeIndex = CHECKLIST_ITEMS.findIndex((step) => step.key === activeStep);
              const isCompleted = activeIndex > index;
              const isLast = index === CHECKLIST_ITEMS.length - 1;

              return (
                <li key={item.key} className="relative flex items-start gap-3">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute top-4.5 left-1.75 z-0 h-13 w-px bg-[#ACF0C5]"
                    />
                  )}

                  <span
                    className={`relative z-10 mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${isCompleted
                        ? "border-transparent text-[#1F5D36] bg-[#C7F5D8] h-2 w-2"
                        : isActive
                          ? "border-transparent text-[#5F8D8D]"
                          : "border-[#ACF0C5] text-transparent rounded-full bg-[#EDFCF2]"
                      }`}
                  >
                    {isCompleted ? (
                      <Check className="size-3.5" strokeWidth={3} />
                    ) : isActive ? (
                      <Loader size={20} className="size-10 animate-spin animation-duration-[1.8s]" />
                    ) : null}
                  </span>

                  <span
                    className={`text-base leading-tight ${isCompleted
                        ? "text-[#3B7E58]"
                        : isActive
                          ? "text-[#3B465F]"
                          : "text-[#A1A8B1]"
                      }`}
                  >
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-[#B7D2D8]">
          <Flag width={18} />
          <span>+10K interns Across the world Got hired</span>
        </div>
      </div>
    </aside>
  );
};

export default Aside;

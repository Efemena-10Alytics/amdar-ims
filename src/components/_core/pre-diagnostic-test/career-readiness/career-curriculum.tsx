"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const CURRICULUM_SECTIONS = [
  {
    href: "#",
    title: "Read through your ground rules, compliance and etiquettes",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    href: "#",
    title: "Read through your ground rules, compliance and etiquettes",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    href: "#",
    title: "Read through your ground rules, compliance and etiquettes",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

const CareerCurriculum = () => {
  const router = useRouter();
  const [confirmCurriculum, setConfirmCurriculum] = useState(false);

  const canContinue = useMemo(() => confirmCurriculum, [confirmCurriculum]);

  return (
    <section className="w-full max-w-190 overflow-y-auto px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <h1 className="text-2xl font-semibold text-[#173740]">Career Curriculum</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-white p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">
          Read through your ground rules, compliance and etiquettes
        </h2>

        <div className="mt-4 max-h-[50vh] overflow-y-auto rounded-xl bg-[#E9EEF2] p-3">
          {CURRICULUM_SECTIONS.map((section, index) => (
            <div key={index} className={index > 0 ? "mt-3" : ""}>
              <Link
                href={section.href}
                className="text-sm font-semibold text-[#2D6A78] hover:underline"
              >
                {section.title}
              </Link>
              <p className="mt-1 text-sm leading-relaxed text-[#506572]">{section.body}</p>
            </div>
          ))}
        </div>

        <label className="mt-4 inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirmCurriculum}
            onChange={(event) => setConfirmCurriculum(event.target.checked)}
            className="size-4 rounded border-[#CBD8DE] accent-[#3B9E5E]"
          />
          <span className="text-sm text-[#8C9DAC]">
            I confirm I have read through my curriculum
          </span>
        </label>
      </article>

      <button
        type="button"
        disabled={!canContinue}
        onClick={() => router.push("/pre-diagnostic-test?step=career-path-diagnostics")}
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        Continue
      </button>
    </section>
  );
};

export default CareerCurriculum;

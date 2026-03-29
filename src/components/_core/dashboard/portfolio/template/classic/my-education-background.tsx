"use client";
import { useEffect } from "react";
import { initClassicAos } from "./init-classic-aos";

export type EducationEntry = {
  institution: string;
  degree: string;
};

type MyEducationBackgroundProps = {
  entries?: EducationEntry[];
};

export function MyEducationBackground({ entries = [] }: MyEducationBackgroundProps) {
  useEffect(() => {
    initClassicAos();
  }, []);
  return (
    <section data-aos="fade-up" className="mt-20" aria-label="Education background">
      <span className="text-xl font-semibold text-[#A1A8B1] mb-4">
        Education Background
      </span>
      <ul className="">
        {entries.map((entry, index) => (
          <li key={entry.institution + index} className="py-4 hover:bg-[#B6CFD4] cursor-alias rounded transition-colors hover:px-4">
            <h3 className="font-bold text-[#092A31] text-2xl">
              {entry.institution}
            </h3>
            <p className="mt-0.5 text-sm text-[#64748B]">
              {entry.degree}
              <span className="ml-0.5" aria-hidden>.</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

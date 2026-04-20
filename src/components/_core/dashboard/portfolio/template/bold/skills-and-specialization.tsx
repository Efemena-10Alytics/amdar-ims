"use client";

import { useEffect } from "react";
import { initClassicAos } from "../classic/init-classic-aos";

type SkillsAndSpecializationProps = {
  skills?: string[];
  specializations?: string[];
  id?: string;
};

export function SkillsAndSpecialization({
  skills = [],
  specializations = [],
  id,
}: SkillsAndSpecializationProps) {
  useEffect(() => {
    initClassicAos();
  }, []);

  if (skills.length === 0 && specializations.length === 0) return null;

  return (
    <section id={id} className="mt-20" aria-label="My skills and specialization">
      <h3
        data-aos="fade-up"
        className="text-xl font-semibold tracking-tight text-[#A1A8B1]"
      >
        My Skills &amp; Specialization
      </h3>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 overflow-hidden">
        <div data-aos="fade-right" className="flex flex-wrap gap-3 content-start">
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-full bg-[#F1F5F9] px-4 py-2 text-sm font-medium text-[#94A3B8]"
            >
              {skill}
            </span>
          ))}
        </div>

        <ul data-aos="fade-left" className="">
          {specializations.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-center gap-3 py-4 text-xl font-clash-display! font-semibold text-[#092A31]"
            >
              <span className="size-1.5 rounded-full bg-[#092A31]" aria-hidden />
              <h6 className="font-semibold font-clash-display!">{item}</h6>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default SkillsAndSpecialization;

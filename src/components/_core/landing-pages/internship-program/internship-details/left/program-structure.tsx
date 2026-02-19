"use client";

import Image from "next/image";

const PROGRAM_STRUCTURE_ICONS_BASE = "/images/svgs/program-structure";

const STEPS: Array<{
  number: number;
  title: string;
  description: string;
  iconSrc: string;
}> = [
  {
    number: 1,
    title: "Registration",
    description: "Choose the career experience that aligns with your goals.",
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/register.svg`,
  },
  {
    number: 2,
    title: "Skills Assessment",
    description:
      "Complete a tailored assessment to evaluate your current skills and identify areas for development.",
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/skills-assessment.svg`,
  },
  {
    number: 3,
    title: "Onboarding",
    description:
      "Access comprehensive onboarding materials to prepare you for the projects ahead.",
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/onboarding.svg`,
  },
  {
    number: 4,
    title: "Project Assignment",
    description:
      "Begin working on real-world simulated projects with guidance from mentors.",
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/project-assesment.svg`,
  },
  {
    number: 5,
    title: "Mentorship and Feedback",
    description:
      "Receive ongoing support and constructive feedback to enhance your learning experience.",
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/mentorship-feedback.svg`,
  },
  {
    number: 6,
    title: "Reference Letter & Portfolio",
    description:
      "Earn an official Amdari Reference Letter valid for two (2) years that validates your hands-on experience and strengthens your résumé, along with a polished portfolio showcasing your projects and skills.Upon completion, earn a certificate and develop a portfolio to showcase your skills to potential employers.",
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/certification-portfolio.svg`,
  },
];

const ProgramStructure = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-[#092A31] mb-6 font-clash-display">
        Program Structure
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {STEPS.map(({ number, title, description, iconSrc }) => (
          <div
            key={number}
            className="relative rounded-2xl bg-[#E8EFF1] p-5 py-10 overflow-hidden min-h-40 flex flex-col"
          >
            {/* Background icon from public folder */}
            <div
              className="absolute right-2 top-4 -translate-y-1/2 w-20 h-20 opacity-10 pointer-events-none"
              aria-hidden
            >
              <Image
                src={iconSrc}
                alt="hello"
                width={80}
                height={80}
                className="object-contain w-full h-full"
              />
            </div>

            <div className="relative z-10">
              <div className="flex mx-auto size-9 items-center justify-center rounded-full bg-[#156374] text-white text-sm font-semibold shrink-0 mb-4">
                {number}
              </div>
              <h3 className="text-base text-center font-semibold text-[#092A31] mb-2 font-clash-display">
                {title}
              </h3>
              <p className="text-xs text-[#64748B] text-center leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramStructure;

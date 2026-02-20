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
    description:
      "Choose your career track and secure your place in a structured internship program built to move you from job seeker to job-ready professional.",
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/register.svg`,
  },
  {
    number: 2,
    title: "Structured Onboarding",
    description:
      "Access guided onboarding resources that align you with real workplace standards, expectations, and performance benchmarks.",
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/skills-assessment.svg`,
  },
  {
    number: 3,
    title: "Project Assignment",
    description:
      "Begin working on real business-focused projects with defined deliverables, deadlines, and accountability systems.",
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/onboarding.svg`,
  },
  {
    number: 4,
    title: "Mentorship and Feedback",
    description:
      "Receive continuous guidance, detailed project reviews, and direct feedback from experienced coaches to refine your execution.",
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/project-assesment.svg`,
  },
  {
    number: 5,
    title: "CV Revamp & Interview Preparation",
    description:
      `Reposition your CV, optimize your LinkedIn, and undergo structured mock interviews to defend your projects and experience.`,
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/mentorship-feedback.svg`,
  },
  {
    number: 6,
    title: "Portfolio & 2-Year Work Reference",
    description:
      "Graduate with recruiter-ready projects, documented impact, and an official reference letter validating your hands-on experience.",
    iconSrc: `${PROGRAM_STRUCTURE_ICONS_BASE}/certification-portfolio.svg`,
  },
];

const ProgramStructure = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-[#092A31] mb-6 font-clash-display">
        Program Structure
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
        {STEPS.map(({ number, title, description, iconSrc }) => (
          <div
            key={number}
            className="relative rounded-2xl bg-[#E8EFF1] p-5 py-10 overflow-hidden min-h-40 flex flex-col justify-center items-center"
          >
            {/* Background icon from public folder */}
            <div
              className="absolute right-2 top-4 -translate-y-1/2 w-20 h-20 pointer-events-none"
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

"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonalInfo from "./personal-info";
import { YourSocial } from "./your-social";
import { YourBio } from "./your-bio";
import { YourSpecialization } from "./your-specialization";
import { YourSkills } from "./your-skills";
import { YourTools } from "./your-tools";
import { WorkExperience } from "./work-experience";
import { EducationBackground } from "./education-background";
import Aside, { STEPS } from "./aside";

export function CreatePortfolioForm() {
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phone: "",
  });
  const [socialData, setSocialData] = useState({ linkedIn: "", twitter: "" });
  const [bioData, setBioData] = useState({
    jobTitle: "",
    yearsOfExperience: "",
    lifeProjectsCount: "",
    bio: "",
  });
  const [specializationData, setSpecializationData] = useState({
    category: "",
    selectedSpecializations: [] as string[],
  });
  const [skillsData, setSkillsData] = useState({
    selectedSkills: [] as string[],
  });
  const [toolsData, setToolsData] = useState({
    selectedTools: [] as string[],
  });
  const [workExperienceData, setWorkExperienceData] = useState({
    entries: [
      {
        companyName: "",
        jobTitle: "",
        industry: "",
        jobDescription: "",
        startDate: "",
        endDate: "",
        currentlyWorkHere: false,
      },
    ],
  });
  const [educationData, setEducationData] = useState({
    entries: [{ schoolName: "", qualification: "" }],
  });

  const isFirstStep = step === 1;
  const isLastStep = step === STEPS.length;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Top: Title + Consultant tag */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-zinc-900">
          Let&apos;s Create Your Portfolio
        </h1>
        <span className="rounded-full bg-[#C7B0E4] px-2.5 py-1 text-xs font-medium text-[#340078]">
          Consultant
        </span>
      </div>

      <div className="flex flex-1 min-h-0 gap-6 md:gap-10">
        {/* Left: Step navigation (payment-style: completed = check, cannot click future steps) */}
        <Aside step={step} onStepChange={setStep} />

        {/* Right: Step content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1">
            {step === 1 && (
              <PersonalInfo value={personalInfo} onChange={setPersonalInfo} />
            )}
            {step === 2 && (
              <YourSocial value={socialData} onChange={setSocialData} />
            )}
            {step === 3 && (
              <YourBio value={bioData} onChange={setBioData} />
            )}
            {step === 4 && (
              <YourSpecialization
                value={specializationData}
                onChange={setSpecializationData}
              />
            )}
            {step === 5 && (
              <YourSkills
                value={skillsData}
                onChange={setSkillsData}
              />
            )}
            {step === 6 && (
              <YourTools
                value={toolsData}
                onChange={setToolsData}
              />
            )}
            {step === 7 && (
              <WorkExperience
                value={workExperienceData}
                onChange={setWorkExperienceData}
              />
            )}
            {step === 8 && (
              <EducationBackground
                value={educationData}
                onChange={setEducationData}
              />
            )}
          </div>

          {/* Bottom: Back / Next */}
          <div className="flex items-center max-w-md w-full gap-3 mt-16 ">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={isFirstStep}
              className="flex-1 h-10 rounded-lg bg-zinc-100  text-zinc-700 hover:bg-zinc-200"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
              // disabled={isLastStep}
              className="flex-1 h-10 rounded-lg bg-primary text-white hover:bg-primary/90"
            >
              {isLastStep ? "Create Portfolio" : <>Next <ChevronRight className="size-4 ml-1" /></>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

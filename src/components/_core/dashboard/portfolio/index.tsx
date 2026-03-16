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
import {
    getInitialWorkExperienceData,
    WorkExperience,
    workExperienceToPayload,
} from "./work-experience";
import { EducationBackground } from "./education-background";
import Aside, { STEPS } from "./aside";
import { useUpdateProject } from "@/features/portfolio/use-update-portfolio";

export function CreatePortfolioForm() {
  const { updateProject, isUpdating, errorMessage } = useUpdateProject();
  const [step, setStep] = useState(1);
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
  const [workExperienceData, setWorkExperienceData] = useState(
    getInitialWorkExperienceData,
  );
  const [educationData, setEducationData] = useState({
    entries: [{ schoolName: "", qualification: "" }],
  });

  const isFirstStep = step === 1;
  const isLastStep = step === STEPS.length;

  const saveWorkExperience = async (data: Parameters<typeof workExperienceToPayload>[0]) => {
    const payload = workExperienceToPayload(data);
    const formData = new FormData();
    formData.append("work_experience", JSON.stringify(payload.work_experience));
    try {
      await updateProject(formData);
    } catch {
      // errorMessage set by useUpdateProject
    }
  };

  const handleNext = async () => {
    if (step === 7) {
      try {
        await saveWorkExperience(workExperienceData);
      } catch {
        return;
      }
    }
    setStep((s) => Math.min(STEPS.length, s + 1));
  };

  const handleCreatePortfolio = async () => {
    try {
      await saveWorkExperience(workExperienceData);
    } catch {
      return;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-zinc-900">
          Let&apos;s Create Your Portfolio
        </h1>
        <span className="rounded-full bg-[#C7B0E4] px-2.5 py-1 text-xs font-medium text-[#340078]">
          Consultant
        </span>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-6 md:gap-10">
        <Aside step={step} onStepChange={setStep} />

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1">
            {step === 1 && (
              <PersonalInfo />
            )}
            {step === 2 && (
              <YourSocial value={socialData} onChange={setSocialData} />
            )}
            {step === 3 && <YourBio value={bioData} onChange={setBioData} />}
            {step === 4 && (
              <YourSpecialization
                value={specializationData}
                onChange={setSpecializationData}
              />
            )}
            {step === 5 && (
              <YourSkills value={skillsData} onChange={setSkillsData} />
            )}
            {step === 6 && (
              <YourTools value={toolsData} onChange={setToolsData} />
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

          <div className="flex items-center max-w-md w-full gap-3 mt-16 ">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={isFirstStep}
              className="flex-1 h-10 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={
                isLastStep
                  ? handleCreatePortfolio
                  : handleNext
              }
              disabled={isUpdating}
              className="flex-1 h-10 rounded-lg bg-primary text-white hover:bg-primary/90"
            >
              {isLastStep ? (
                isUpdating ? "Creating…" : "Create Portfolio"
              ) : (
                isUpdating ? "Saving…" : "Save & continue"
              )}
            </Button>
          </div>
          {errorMessage && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

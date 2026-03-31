"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonalInfo, {
  defaultPersonalInfo,
  PersonalInfoData,
} from "./personal-info";
import { YourSocial, socialToPayload } from "./your-social";
import { YourBio, bioToPayload } from "./your-bio";
import {
  YourSpecialization,
  categoryToPayload,
} from "./your-specialization";
import { YourSkills, skillsToPayload } from "./your-skills";
import { YourTools, type ToolIconMap, type YourToolsData } from "./your-tools";
import {
  getInitialWorkExperienceData,
  WorkExperience,
  workExperienceToPayload,
} from "./work-experience";
import {
  EducationBackground,
  educationBackgroundToPayload,
} from "./education-background";
import Aside, { STEPS } from "./aside";
import { useUpdatePortfolio } from "@/features/portfolio/use-update-portfolio";
import { useAddTools } from "@/features/portfolio/use-add-tools";
import { useInitializePortfolio } from "@/features/portfolio/use-initialize-portfolio";
import { useUpdateUser } from "@/features/user/use-update-user-details";
import { useCountries } from "@/features/portfolio/use-countries";
import { useGetPortfolio } from "@/features/portfolio/use-get-portfolio";
import { useGetTools } from "@/features/portfolio/use-get-tools";

export function CreatePortfolioForm() {
  const { updateProject, isUpdating, errorMessage } = useUpdatePortfolio();
  const {
    addTools,
    isSubmitting: isToolsSubmitting,
    errorMessage: addToolsErrorMessage,
  } = useAddTools();
  const { initializePortfolio, isInitializing, errorMessage: initErrorMessage } =
    useInitializePortfolio();
  const { updateUser, errorMessage: userDetailsErrMessage } = useUpdateUser();
  const { data: countries = [] } = useCountries();
  const { data: portfolioData } = useGetPortfolio();
  const { data: apiTools = [] } = useGetTools();

  const toolIconMap: ToolIconMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of apiTools) {
      const name = t.name?.trim();
      const icon = t.icon ?? t.url ?? t.image;
      if (name && icon) map[name] = icon;
    }
    return map;
  }, [apiTools]);
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfoData>(defaultPersonalInfo);
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
  const [toolsData, setToolsData] = useState<YourToolsData>({
    selectedTools: [],
  });
  const [workExperienceData, setWorkExperienceData] = useState(
    getInitialWorkExperienceData,
  );
  const [educationData, setEducationData] = useState({
    entries: [{ schoolName: "", qualification: "" }],
  });

  const selectedCountry = countries.find(
    (c) => c.code === personalInfo.countryCode,
  );

  const isFirstStep = step === 1;
  const isLastStep = step === STEPS.length;

  const savePersonalInfo = async (): Promise<boolean> => {
    const location = selectedCountry?.name ?? personalInfo.countryCode ?? "";
    try {
      if (!portfolioData) {
        await initializePortfolio();
      }
      const result = await updateUser({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        location,
        countryCode: personalInfo.countryCode,
        phone: personalInfo.phone,
      });
      return result !== undefined;
    } catch {
      // errorMessage set by hook
      return false;
    }
  };
  const saveBio = async (
    data: Parameters<typeof bioToPayload>[0],
  ): Promise<boolean> => {
    const payload = bioToPayload(data);
    try {
      const result = await updateProject({
        bio: payload.bio,
      });
      return result !== undefined;
    } catch {
      // errorMessage set by useUpdatePortfolio
      return false;
    }
  };

  const saveCategory = async (
    data: Parameters<typeof categoryToPayload>[0],
  ): Promise<boolean> => {
    const payload = categoryToPayload(data);
    try {
      const result = await updateProject({
        category: {
          ...payload.category,
          skills: skillsData.selectedSkills,
        },
      });
      return result !== undefined;
    } catch {
      return false;
    }
  };

  const saveTools = async (
    data: Pick<YourToolsData, "selectedTools" | "customToolFiles" | "toolSkillLevels">,
  ): Promise<boolean> => {
    const seen = new Set<string>();
    const tools = data.selectedTools
      .filter((name) => {
        const key = name.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((name) => ({
        name,
        image:
          data.customToolFiles?.[name] ?? toolIconMap[name] ?? null,
        skillLevel:
          data.toolSkillLevels?.[name] != null
            ? String(data.toolSkillLevels[name])
            : undefined,
      }));
    return addTools({ tools });
  };

  const saveSkills = async (
    data: Parameters<typeof skillsToPayload>[0],
  ): Promise<boolean> => {
    const payload = skillsToPayload(data);
    try {
      const result = await updateProject({
        category: {
          title: specializationData.category || null,
          specializationData: specializationData.selectedSpecializations,
          skills: payload.category.skills,
        },
      });
      return result !== undefined;
    } catch {
      return false;
    }
  };

  const saveSocial = async (
    data: Parameters<typeof socialToPayload>[0],
  ): Promise<boolean> => {
    const payload = socialToPayload(data);
    try {
      const result = await updateProject({
        social: payload.social,
      });
      return result !== undefined;
    } catch {
      // errorMessage set by useUpdatePortfolio
      return false;
    }
  };

  const saveWorkExperience = async (
    data: Parameters<typeof workExperienceToPayload>[0],
  ): Promise<boolean> => {
    const payload = workExperienceToPayload(data);
    try {
      const result = await updateProject({
        workExperience: payload.workExperience,
      });
      return result !== undefined;
    } catch {
      // errorMessage set by useUpdatePortfolio
      return false;
    }
  };

  const saveEducationBackground = async (
    data: Parameters<typeof educationBackgroundToPayload>[0],
  ): Promise<boolean> => {
    const payload = educationBackgroundToPayload(data);
    try {
      const result = await updateProject({
        educationalBackground: payload.educationalBackground,
      });
      return result !== undefined;
    } catch {
      // errorMessage set by useUpdatePortfolio
      return false;
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      const ok = await savePersonalInfo();
      if (!ok) return;
    }
    if (step === 2) {
      const ok = await saveSocial(socialData);
      if (!ok) return;
    }
    if (step === 3) {
      const ok = await saveBio(bioData);
      if (!ok) return;
    }
    if (step === 4) {
      const ok = await saveCategory(specializationData);
      if (!ok) return;
    }
    if (step === 5) {
      const ok = await saveSkills(skillsData);
      if (!ok) return;
    }
    if (step === 6) {
      const ok = await saveTools(toolsData);
      if (!ok) return;
    }
    if (step === 7) {
      const ok = await saveWorkExperience(workExperienceData);
      if (!ok) return;
    }
    if (step === 8) {
      const ok = await saveEducationBackground(educationData);
      if (!ok) return;
    }
    setStep((s) => Math.min(STEPS.length, s + 1));
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
              <PersonalInfo
                personalInfo={personalInfo}
                setPersonalInfo={setPersonalInfo}
                errorMessage={userDetailsErrMessage}
                selectedCountry={selectedCountry}
              />
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
              onClick={handleNext}
              disabled={isUpdating || isInitializing || isToolsSubmitting}
              className="flex-1 h-10 rounded-lg bg-primary text-white hover:bg-primary/90"
            >
              {isLastStep
                ? isUpdating
                  ? "Creating…"
                  : "Create Portfolio"
                : isUpdating || isInitializing || isToolsSubmitting
                  ? "Saving…"
                  : "Save & continue"}
            </Button>
          </div>
          {(errorMessage || initErrorMessage || addToolsErrorMessage) && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {errorMessage || initErrorMessage || addToolsErrorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

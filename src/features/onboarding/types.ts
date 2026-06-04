export type OnboardingMediaFile = {
  name: string;
  key: string;
  url: string;
};

export type OnboardingOrientationVideo = {
  link: string;
  description: string;
  instructions: string;
};

export type OnboardingStructureVideo = {
  title: string;
  link: string;
  description: string;
};

export type OnboardingCohortLead = {
  name: string;
  phone: string;
  countryCode: string;
  image: OnboardingMediaFile;
};

export type OnboardingRulesAndEtiquette = {
  instructions: string;
  docLink: OnboardingMediaFile;
};

export type OnboardingInstallationTool = {
  toolName: string;
  toolLink: string;
  videoLink: string;
};

export type OnboardingReadinessQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type OnboardingCohort = {
  id: number;
  name: string;
  month: string | null;
  year: string | null;
  start_date: string;
  end_date: string | null;
  active_week: number | null;
  status: string;
  duration: number;
  version: string | null;
  created_at: string;
  updated_at: string;
};

export type OnboardingProgram = {
  id: number;
  thumbnail: string | null;
  banner_image: string | null;
  title: string;
  company_name: string | null;
  about_company: string | null;
  internship_description: string | null;
  type: string | null;
  industry_name: string | null;
  level: string | null;
  mentor_count: number | null;
  daily_motivation: string | null;
  video_url: string | null;
  intern_title: string | null;
  overviews: unknown;
  tools: unknown;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type OnboardingCreator = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: unknown;
};

export type Onboarding = {
  id: number;
  created_by: number;
  cohort_id: number;
  program_id: number;
  orientation_video: OnboardingOrientationVideo;
  /** API field name (typo preserved) */
  internshp_structure_video: OnboardingStructureVideo[];
  cohort_lead: OnboardingCohortLead[];
  rule_and_etiquette: OnboardingRulesAndEtiquette;
  installation_video: OnboardingInstallationTool[];
  readiness_test: OnboardingReadinessQuestion[];
  created_at: string;
  updated_at: string;
  creator: OnboardingCreator;
  cohort: OnboardingCohort;
  program: OnboardingProgram;
};

export type GetOnboardingParams = {
  cohortId: string | number;
  programId: string | number;
};

export type OnboardingApiResponse = {
  success: boolean;
  message: string;
  data: Onboarding | null;
};

export const ONBOARDING_STEP_KEYS = [
  "orientation-video",
  "internship-structure-video",
  "cohort-lead",
  "internship-rules",
  "installation-videos",
  "readiness-test",
] as const;

export type OnboardingStepKey = (typeof ONBOARDING_STEP_KEYS)[number];

export const ONBOARDING_CHECKLIST_ITEMS: { key: OnboardingStepKey; label: string }[] =
  [
    { key: "orientation-video", label: "Your orientation video" },
    { key: "internship-structure-video", label: "Your internship structure video" },
    { key: "cohort-lead", label: "Meet Your Cohort Lead" },
    { key: "internship-rules", label: "Internship rules & etiquettes" },
    { key: "installation-videos", label: "Installation videos" },
    { key: "readiness-test", label: "Readiness test" },
  ];

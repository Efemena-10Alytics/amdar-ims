export type PreDiagnosticVideoItem = {
  link: string;
  description: string;
  instructions: string;
};

export type PreDiagnosticQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type PreDiagnosticCareerReadiness = {
  welcomeVideo: PreDiagnosticVideoItem[];
  careerKnowledgeDiscovery: PreDiagnosticVideoItem[];
  careerPathDiagnostic: PreDiagnosticQuestion[];
};

export type PreDiagnosticTechnologyReadiness = {
  technologyUsecase: PreDiagnosticVideoItem;
  /** API field name (capital P preserved) */
  PracticalWalkthrough: PreDiagnosticVideoItem[];
  technologyDiagnostic: PreDiagnosticQuestion[];
};

export type PreDiagnosticImsReadiness = {
  howTheImsWorks: PreDiagnosticVideoItem;
  imsDiagnostic: PreDiagnosticQuestion[];
};

export type PreDiagnosticCreator = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: unknown;
};

export type PreDiagnosticCohort = {
  id: number;
  name: string;
  month: string | null;
  year: string | null;
  start_date: string;
  end_date: string | null;
  active_week: number | null;
  status: string;
  duration: number;
};

export type PreDiagnosticProgram = {
  id: number;
  title: string;
  slug: string;
  company_name: string | null;
};

export type PreDiagnostic = {
  id: number;
  created_by: number;
  cohort_id: number;
  program_id: number;
  career_readiness: PreDiagnosticCareerReadiness;
  technology_readiness: PreDiagnosticTechnologyReadiness;
  ims_readiness: PreDiagnosticImsReadiness;
  created_at: string;
  updated_at: string;
  creator: PreDiagnosticCreator;
  cohort: PreDiagnosticCohort;
  program: PreDiagnosticProgram;
};

export type GetPreDiagnosticParams = {
  cohortId: string | number;
  programId: string | number;
};

export type PreDiagnosticApiResponse = {
  success: boolean;
  message: string;
  data: PreDiagnostic | null;
};

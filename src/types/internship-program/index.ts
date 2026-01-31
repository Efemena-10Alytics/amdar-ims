
export interface InternshipProgram {
  id: number;
  title: string;
  slug: string;
  description: string;
  payment_url: string;
  image: string;
  overview: string;
  gain: string;
  duration: string;
  role: string;
  type: string;
  skills: string[];
  testimony: string[];
  level: string | null;
  created_at: string;
  updated_at: string;
  career_opportunities: CareerOpportunity[];
  faqs: FAQ[];
  tools: Tool[];
  projects: Project[];
  mentors: Mentor[];
}

export interface CareerOpportunity {
  id: number;
  internship_program_id: number;
  icon: string;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: number;
  internship_program_id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: number;
  name: string;
  icon: string;
  pivot: {
    internship_program_id: number;
    tool_id: number;
  };
}

export interface Project {
  id: number;
  name: string;
  short_description: string;
  description: string;
  duration: string;
  project_image: string;
  project_video: string;
  level: string;
  project_contributor: string;
  project_contributor_instagram: string;
  project_contributor_twitter: string;
  project_contributor_linkedin: string;
  project_contributor_picture: string;
  rationale: string;
  tech_stack: string;
  problem: string;
  aim: string;
  data_description: string;
  project_scope: string;
  status: number;
  project_category_id: number;
  sub_category_id: number;
  industry_id: number;
  pivot: {
    internship_program_id: number;
    project_id: number;
  };
}

export interface Mentor {
  id: number;
  image: string;
  name: string;
  role: string;
  description: string;
  tags: string[] | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
  pivot: {
    internship_program_id: number;
    mentor_id: number;
  };
}

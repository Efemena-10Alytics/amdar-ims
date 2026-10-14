/** Portfolio tool nested under get-user-info `portfolios`. */
export type UserInfoPortfolioTool = {
  id: number;
  tool: string;
  portfolio_id: number;
  created_at: string;
  updated_at: string;
};

/** Project category nested under portfolio project. */
export type UserInfoProjectCategory = {
  id: number;
  name: string;
  img: string | null;
  description: string | null;
};

/** Project nested under get-user-info `portfolios`. */
export type UserInfoPortfolioProject = {
  id: number;
  name: string;
  short_description: string | null;
  description: string | null;
  duration: string | null;
  project_image: string | null;
  project_video: string | null;
  level: string | null;
  project_contributor: string | null;
  project_contributor_instagram: string | null;
  project_contributor_twitter: string | null;
  project_contributor_linkedin: string | null;
  project_contributor_picture: string | null;
  rationale: string | null;
  tech_stack: string | null;
  problem: string | null;
  aim: string | null;
  data_description: string | null;
  project_scope: string | null;
  status: number;
  project_category_id: number | null;
  sub_category_id: number | null;
  industry_id: number | null;
  project_category: UserInfoProjectCategory | null;
};

/** Portfolio entry nested under get-user-info. */
export type UserInfoPortfolio = {
  id: number;
  project_id: number;
  user_id: number;
  title: string | null;
  description: string | null;
  excerpt: string | null;
  featuredImage: string | null;
  link_name: string | null;
  link_url: string | null;
  created_at: string;
  updated_at: string;
  tools: UserInfoPortfolioTool[];
  project: UserInfoPortfolioProject | null;
};

/**
 * Shape of `GET get-user-info/:id` → `data`.
 * Matches the API payload (flat user object, not nested under `user`).
 */
export type UserInfo = {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  hasProfile: boolean;
  phoneNumber: string | null;
  jobTitle: string | null;
  role: string | null;
  staff: string[];
  companyName: string | null;
  iwantto: string | null;
  location: string | null;
  projectInterest: string | null;
  skillLevel: string | null;
  tagline: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  email_verified_at: string | null;
  email_verification_token: string | null;
  created_at: string;
  updated_at: string;
  gender: string | null;
  github: string | null;
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  ref: string | null;
  affiliate_code: string | null;
  ref_code: string | null;
  find_out: string | null;
  session_influenced: string | null;
  decision_influenced: string | null;
  /** ISO timestamp of last activity; used for Active / Inactive UI. */
  last_seen: string | null;
  main_challenge: string | null;
  portfolios: UserInfoPortfolio[];
};

export type UserInfoApiResponse = {
  data: UserInfo;
};

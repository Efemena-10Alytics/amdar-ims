export type LearnPaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type LearnInstructor = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LearnRating = {
  id: number;
  user_id: number;
  learn_id: number;
  rating: number;
  review: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type LearnLessonResource = {
  title: string;
  type: string;
  file_path: string | null;
  url: string | null;
  uploaded_at: string | null;
};

export type LearnLesson = {
  id: number;
  curriculum_id: number;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  order: number;
  is_free_preview: boolean;
  resources: LearnLessonResource[];
  transcript: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type LearnCurriculum = {
  id: number;
  learn_id: number;
  title: string;
  description: string | null;
  order: number;
  video_url: string | null;
  supplementary_materials: unknown[];
  duration_minutes: number | null;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
  lessons: LearnLesson[];
};

export type Learn = {
  id: number;
  title: string;
  description: string | null;
  category_id: number | null;
  subject_area: string | null;
  thumbnail: string | null;
  preview_video: string | null;
  price: string | null;
  status: string | null;
  instructor_id: number | null;
  skills: string[];
  job_opportunities: string[];
  for_whom: string | null;
  created_at: string;
  updated_at: string;
  instructor: LearnInstructor | null;
  ratings: LearnRating[];
  curriculums: LearnCurriculum[];
};

export type LearnsPaginatedResponse = {
  current_page: number;
  data: Learn[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: LearnPaginationLink[];
  next_page_url: string | null;
  path: string | null;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type GetLearnsQuery = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type LearnsApiResponse =
  | LearnsPaginatedResponse
  | { data?: LearnsPaginatedResponse };

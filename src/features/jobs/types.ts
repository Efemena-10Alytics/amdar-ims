export type NormalizedJob = {
  id: string;
  title: string;
  employer: string;
  location: string;
  salary: string;
  jobType: string;
  remoteMode: string;
  sponsorship: string;
  datePosted: string;
  source: string;
  applyUrl: string;
};

export type JobsFilters = {
  q?: string;
  source?: string;
  location?: string;
  role?: string;
  level?: string;
  jobType?: string;
  industry?: string;
  remoteMode?: string;
  sponsorship?: string;
  datePosted?: string;
};

export type JobsResponse = {
  jobs: NormalizedJob[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

import type { NormalizedJob, JobsResponse } from "./types";

// Confirmed shape of a job record from https://demo.cvmatchly.ai/api/public/jobs
// (sample response reviewed 2026-08-28), e.g.:
// {
//   id, source, sourceJobId, sourceUrl, employer, title, summary, descriptionHtml,
//   experienceText, role, industry, level, jobType, workingPattern, remoteMode,
//   salaryMin, salaryMax, salaryCurrency, salaryPeriod, salaryAnnualMin, salaryAnnualMax,
//   salaryRaw, publishedAt, closingAt, firstSeenAt, lastSeenAt, status, duplicateOfId,
//   sponsorshipStatus, sponsorshipConfidence, visaRoutes: string[],
//   locations: { name, town, region, postcode }[]
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawRecord = Record<string, any>;

function firstString(record: RawRecord, keys: string[]): string {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function formatSalary(record: RawRecord): string {
  if (typeof record?.salaryRaw === "string" && record.salaryRaw.trim()) {
    return record.salaryRaw.trim();
  }

  const min = record?.salaryMin;
  const max = record?.salaryMax;
  const currency = record?.salaryCurrency ?? "";
  const period = record?.salaryPeriod ? `/${record.salaryPeriod}` : "";

  if (min && max) return `${currency}${min} - ${currency}${max}${period}`;
  if (min) return `From ${currency}${min}${period}`;
  if (max) return `Up to ${currency}${max}${period}`;
  return "";
}

function formatSponsorship(record: RawRecord): string {
  const raw = record?.sponsorshipStatus;
  if (typeof raw !== "string" || !raw.trim()) return "Not specified";
  return raw
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatLocation(record: RawRecord): string {
  const locations = record?.locations;
  if (Array.isArray(locations) && locations.length > 0) {
    // Prefer the entry that includes a postcode (most specific), falling back
    // to the first entry with a usable name/town. Locations from this API
    // are often duplicated: one with just the town, one with "town, postcode".
    const withPostcode = locations.find((loc) => loc?.postcode);
    const best = withPostcode ?? locations[0];

    const name: string = best?.name ?? best?.town ?? "";
    const town: string = best?.town ?? "";
    const postcode: string = best?.postcode ?? "";

    if (name) {
      // If name already contains the postcode (e.g. "Bracknell, RG12 2UT"), use it as-is.
      if (postcode && name.includes(postcode)) return name;
      if (postcode) return `${name}, ${postcode}`;
      return name;
    }
    if (town && postcode) return `${town}, ${postcode}`;
    return town || postcode;
  }
  return firstString(record, ["location"]);
}

function formatDate(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatDatePosted(record: RawRecord): string {
  return formatDate(record?.publishedAt ?? record?.firstSeenAt);
}

function formatClosingDate(record: RawRecord): string {
  return formatDate(record?.closingAt ?? record?.closingDate ?? record?.expiresAt);
}

export function normalizeJob(raw: RawRecord): NormalizedJob {
  return {
    id: firstString(raw, ["id", "sourceJobId"]) || crypto.randomUUID(),
    title: firstString(raw, ["title", "role"]),
    employer: firstString(raw, ["employer"]),
    location: formatLocation(raw),
    salary: formatSalary(raw),
    jobType: firstString(raw, ["jobType"]),
    remoteMode: firstString(raw, ["remoteMode"]),
    sponsorship: formatSponsorship(raw),
    datePosted: formatDatePosted(raw),
    closingDate: formatClosingDate(raw),
    source: firstString(raw, ["source"]),
    applyUrl: firstString(raw, ["sourceUrl"]),
  };
}

export function normalizeJobsResponse(raw: RawRecord): JobsResponse {
  const rawJobs: RawRecord[] =
    raw?.jobs ?? raw?.data ?? raw?.results ?? raw?.items ?? [];

  const page = Number(raw?.page ?? raw?.pagination?.page ?? 1);
  const pageSize = Number(raw?.pageSize ?? raw?.pagination?.pageSize ?? rawJobs.length ?? 10);
  const total = Number(
    raw?.total ?? raw?.totalCount ?? raw?.pagination?.total ?? rawJobs.length,
  );
  const totalPages = Number(
    raw?.totalPages ??
      raw?.pagination?.totalPages ??
      (pageSize > 0 ? Math.ceil(total / pageSize) : 1),
  );

  return {
    jobs: Array.isArray(rawJobs) ? rawJobs.map(normalizeJob) : [],
    page,
    pageSize,
    total,
    totalPages,
  };
}

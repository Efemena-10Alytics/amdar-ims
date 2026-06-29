type ProgramKey =
  | "business_analysis"
  | "data_analytics"
  | "data_engineering"
  | "data_science"
  | "devops"
  | "grc"
  | "project_management"
  | "soc";

type CohortMonthKey =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

const COHORT_MONTH_KEYS: CohortMonthKey[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const COHORT_MONTH_PATTERN_KEYS = [...COHORT_MONTH_KEYS].sort(
  (a, b) => b.length - a.length,
);

const INTERNS_WHATSAPP_GROUPS: Partial<
  Record<CohortMonthKey, Partial<Record<ProgramKey, string>>>
> = {
  june: {
    business_analysis:
      "https://chat.whatsapp.com/9sH8n7l2mLh1Xo5qj3u9bP?mode=gi_t",
    data_analytics:
      "https://chat.whatsapp.com/IfhrVcPBbM10227jli2S0b?mode=gi_t",
    data_engineering:
      "https://chat.whatsapp.com/G3c34zhT40L6vWvXVgWreL?mode=gi_t",
    data_science: "https://chat.whatsapp.com/IYqKx5Y3xAKETczpzSnZv1?mode=gi_t",
    devops: "https://chat.whatsapp.com/IXSIdOk0sU4E74N66JqLED?mode=gi_t",
    grc: "https://chat.whatsapp.com/FIrYDHKRWk99G8U8ZbWk9m?mode=gi_t",
    project_management: "https://chat.whatsapp.com/DzxpHbDM9dYEhb0dEH6ZS8",
    soc: "https://chat.whatsapp.com/ClRLSJDCx2g0dhCcFvRwDW?mode=gi_t",
  },
  july: {
    business_analysis:
      "https://chat.whatsapp.com/JjUBxL8KoaRB8JKqGwb9n4?s=cl&p=i&ilr=4",
    data_analytics:
      "https://chat.whatsapp.com/J6gc284xy2Q5f2WvZb45Nm?s=cl&p=i&ilr=4",
    data_engineering:
      "https://chat.whatsapp.com/CTYrcbTz1HgGijM7GbRnSi?s=cl&p=i&ilr=4",
    data_science:
      "https://chat.whatsapp.com/EVA97OLCOnc24tV94d08EL?s=cl&p=i&ilr=4",
    devops: "https://chat.whatsapp.com/EpBBf9tSPB5A8N12wR1I8r?s=cl&p=i&ilr=4",
    grc: "https://chat.whatsapp.com/JA4Ql86TRUm3gaxwOI8tTy?s=cl&p=i&ilr=4",
    project_management:
      "https://chat.whatsapp.com/DeyvLAvzwgG6M3Q2mvs5fA?s=cl&p=i&ilr=4",
    soc: "https://chat.whatsapp.com/Cz6uahPGYs18fXDnhpXFqj?s=cl&p=i&ilr=4",
  },
};

type ProgramRef = {
  slug?: string | null;
  title?: string | null;
  intern_title?: string | null;
  internship_title?: string | null;
};

type CohortRef = {
  name?: string | null;
  month?: string | null;
  year?: string | null;
  start_date?: string | null;
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getProgramHaystack(program?: ProgramRef | null): string {
  if (!program) return "";

  const internshipTitle =
    program.intern_title?.trim() ?? program.internship_title?.trim() ?? "";
  const title = program.title?.trim() ?? "";
  const slug = program.slug?.replace(/-/g, " ").trim() ?? "";

  return normalizeText(`${internshipTitle} ${title} ${slug}`);
}

function resolveProgramKey(program?: ProgramRef | null): ProgramKey | null {
  const haystack = getProgramHaystack(program);
  if (!haystack) return null;

  if (
    haystack.includes("business analysis") ||
    haystack.includes("business analyst")
  ) {
    return "business_analysis";
  }

  if (
    haystack.includes("data engineering") ||
    haystack.includes("data engineer")
  ) {
    return "data_engineering";
  }

  if (
    haystack.includes("data science") ||
    haystack.includes("data scientist")
  ) {
    return "data_science";
  }

  if (
    haystack.includes("data analytics") ||
    haystack.includes("data analyst") ||
    haystack.includes("data analysis")
  ) {
    return "data_analytics";
  }

  if (
    haystack.includes("project management") ||
    haystack.includes("project manager")
  ) {
    return "project_management";
  }

  if (haystack.includes("devops") || haystack.includes("dev ops")) {
    return "devops";
  }

  if (haystack.includes("grc")) {
    return "grc";
  }

  if (
    haystack.includes("soc") ||
    haystack.includes("security operations") ||
    haystack.includes("app and cloud security") ||
    haystack.includes("cloud security")
  ) {
    return "soc";
  }

  return null;
}

function matchCohortMonthInText(value: string): CohortMonthKey | null {
  const normalized = normalizeText(value);
  if (!normalized) return null;

  for (const month of COHORT_MONTH_PATTERN_KEYS) {
    const pattern = new RegExp(`(^|\\s)${month}(\\s|$)`);
    if (pattern.test(normalized)) return month;
  }

  return null;
}

function resolveCohortMonthKey(
  cohort?: CohortRef | null,
): CohortMonthKey | null {
  if (!cohort) return null;

  const fromMonth = cohort.month ? matchCohortMonthInText(cohort.month) : null;
  if (fromMonth) return fromMonth;

  const fromName = cohort.name ? matchCohortMonthInText(cohort.name) : null;
  if (fromName) return fromName;

  if (cohort.start_date?.trim()) {
    const date = new Date(`${cohort.start_date.trim()}T12:00:00`);
    if (!Number.isNaN(date.getTime())) {
      return COHORT_MONTH_KEYS[date.getMonth()] ?? null;
    }
  }

  return null;
}

/** Resolves the interns WhatsApp community link for a cohort + program enrollment. */
export function getInternsWhatsappGroupUrl(
  program?: ProgramRef | null,
  cohort?: CohortRef | null,
): string | null {
  const cohortMonth = resolveCohortMonthKey(cohort);
  const programKey = resolveProgramKey(program);

  if (!cohortMonth || !programKey) return null;

  return INTERNS_WHATSAPP_GROUPS[cohortMonth]?.[programKey] ?? null;
}

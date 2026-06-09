export const DATA_ANALYTICS_INTERNS_WHATSAPP_GROUP =
  "https://chat.whatsapp.com/IfhrVcPBbM10227jli2S0b?mode=gi_t";
export const DATA_SCIENCE_INTERNS_WHATSAPP_GROUP =
  "https://chat.whatsapp.com/IYqKx5Y3xAKETczpzSnZv1?mode=gi_t";
export const DATA_ENGINEERING_INTERNS_WHATSAPP_GROUP =
  "https://chat.whatsapp.com/G3c34zhT40L6vWvXVgWreL?mode=gi_t";
export const PROJECT_MANAGEMENT_INTERNS_WHATSAPP_GROUP =
  "https://chat.whatsapp.com/DzxpHbDM9dYEhb0dEH6ZS8";
export const BUSINESS_ANALYSIS_INTERNS_WHATSAPP_GROUP =
  "https://chat.whatsapp.com/9sH8n7l2mLh1Xo5qj3u9bP?mode=gi_t";
export const SOC_INTERNS_WHATSAPP_GROUP =
  "https://chat.whatsapp.com/ClRLSJDCx2g0dhCcFvRwDW?mode=gi_t";
export const GRC_INTERNS_WHATSAPP_GROUP =
  "https://chat.whatsapp.com/FIrYDHKRWk99G8U8ZbWk9m?mode=gi_t";
export const DEVOPS_INTERNS_WHATSAPP_GROUP =
  "https://chat.whatsapp.com/IXSIdOk0sU4E74N66JqLED?mode=gi_t";

type ProgramRef = {
  slug?: string | null;
  title?: string | null;
  intern_title?: string | null;
  internship_title?: string | null;
};

function normalizeProgramText(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getProgramHaystack(program?: ProgramRef | null): string {
  if (!program) return "";

  const internshipTitle =
    program.intern_title?.trim() ??
    program.internship_title?.trim() ??
    "";
  const title = program.title?.trim() ?? "";
  const slug = program.slug?.replace(/-/g, " ").trim() ?? "";

  return normalizeProgramText(`${internshipTitle} ${title} ${slug}`);
}

/** Resolves the interns WhatsApp community link for an enrolled program. */
export function getInternsWhatsappGroupUrl(
  program?: ProgramRef | null,
): string | null {
  const haystack = getProgramHaystack(program);
  if (!haystack) return null;

  if (
    haystack.includes("business analysis") ||
    haystack.includes("business analyst")
  ) {
    return BUSINESS_ANALYSIS_INTERNS_WHATSAPP_GROUP;
  }

  if (
    haystack.includes("data engineering") ||
    haystack.includes("data engineer")
  ) {
    return DATA_ENGINEERING_INTERNS_WHATSAPP_GROUP;
  }

  if (
    haystack.includes("data science") ||
    haystack.includes("data scientist")
  ) {
    return DATA_SCIENCE_INTERNS_WHATSAPP_GROUP;
  }

  if (
    haystack.includes("data analytics") ||
    haystack.includes("data analyst") ||
    haystack.includes("data analysis")
  ) {
    return DATA_ANALYTICS_INTERNS_WHATSAPP_GROUP;
  }

  if (
    haystack.includes("project management") ||
    haystack.includes("project manager")
  ) {
    return PROJECT_MANAGEMENT_INTERNS_WHATSAPP_GROUP;
  }

  if (haystack.includes("devops") || haystack.includes("dev ops")) {
    return DEVOPS_INTERNS_WHATSAPP_GROUP;
  }

  if (haystack.includes("grc")) {
    return GRC_INTERNS_WHATSAPP_GROUP;
  }

  if (
    haystack.includes("soc") ||
    haystack.includes("security operations") ||
    haystack.includes("app and cloud security") ||
    haystack.includes("cloud security")
  ) {
    return SOC_INTERNS_WHATSAPP_GROUP;
  }

  return null;
}
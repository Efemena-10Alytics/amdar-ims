export const SESSION_INFLUENCED_STORAGE_KEY = "session_influenced";

export const SESSION_OPTIONS = [
  {
    value: "Thursday & Friday Career Session",
    label: "Thursday & Friday Career Session",
    key: "tech-career",
  },
  {
    value: "Saturday Info Session",
    label: "Saturday Info Session",
    key: "info",
  },
  {
    value: "Info Session with Kelvin Ossai",
    label: "Info Session with Kelvin Ossai",
    key: "kelvin-ossai",
  },
  {
    value: "Info Session Dike Uzo",
    label: "Info Session Dike Uzo",
    key: "dike-uzo",
  },
  { value: "Clarity Session", label: "Clarity Session", key: "clarity" },
  {
    value: "1 Week Free Internship",
    label: "1 Week Free Internship",
    key: "one-week",
  },
  {
    value: "IWD Conferencechat",
    label: "IWD ConferenceChat",
    key: "iwd-conference",
  },
  { value: "Immigration session", label: "Immigration session", key: "immigartion-session" },
  { value: "UK job lab session", label: "UK job lab sessione", key: "uk-job" },
  { value: "Hackathon", label: "Hackathon", key: "hackathon" },
  { value: "None of the above", label: "None of the above", key: "none" },
] as const;

export type SessionOption = (typeof SESSION_OPTIONS)[number];

export function getSessionOptionByKey(key: string): SessionOption | null {
  return SESSION_OPTIONS.find((option) => option.key === key) ?? null;
}

export function getSessionOptionByValue(value: string): SessionOption | null {
  return SESSION_OPTIONS.find((option) => option.value === value) ?? null;
}

export function getSessionValueFromStoredValue(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return (
    getSessionOptionByKey(normalized)?.value ??
    getSessionOptionByValue(normalized)?.value ??
    null
  );
}

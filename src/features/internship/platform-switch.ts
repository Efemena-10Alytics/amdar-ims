/**
 * Cross-app links between the legacy Vite dashboard and this one.
 *
 * The internship project structure differs between the two, so a specialist
 * servicing cohorts on both sides needs to move between them carrying the
 * cohort they are looking at.
 */

/** Internship dashboard on the legacy app. */
export const LEGACY_INTERNSHIP_PATH = "/dashboard/internship";

/** Internship dashboard here. */
export const INTERNSHIP_PROGRAM_PATH = "/dashboard/internship-program";

const legacyBase =
  process.env.NEXT_PUBLIC_REDIRECT_URL || "https://app.amdari.io";

/**
 * Cohorts starting on or after this date belong to this platform; earlier ones
 * keep their structure on the legacy app.
 *
 * Mirrored in the legacy app as NEW_INTERNSHIP_APP_START_DATE_CUTOFF
 * (amdari-frontend/src/pages/dashboard/internship/utils/enrollmentJourneyRedirect.js).
 * Change both together or the two apps will each insist the other owns a cohort.
 */
export const NEW_PLATFORM_START_DATE_CUTOFF = "2026-08-01";

/**
 * Date-only UTC milliseconds, so a cohort starting on the cutoff date is not
 * pushed either way by the viewer's timezone.
 */
function toDateOnlyUtcMs(value: string | null | undefined): number | null {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;

  const isoPrefix = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoPrefix) {
    const [, year, month, day] = isoPrefix;
    return Date.UTC(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;

  return Date.UTC(
    parsed.getUTCFullYear(),
    parsed.getUTCMonth(),
    parsed.getUTCDate(),
  );
}

/** Whether a cohort with this start date belongs to this platform. */
export function isNewPlatformStartDate(
  startDate: string | null | undefined,
): boolean {
  const cohortStartMs = toDateOnlyUtcMs(startDate);
  const cutoffMs = toDateOnlyUtcMs(NEW_PLATFORM_START_DATE_CUTOFF);
  if (cohortStartMs == null || cutoffMs == null) return false;

  return cohortStartMs >= cutoffMs;
}

/**
 * Whether a cohort belongs on the legacy app.
 *
 * Deliberately not `!isNewPlatformStartDate(...)`: an unknown or unparseable
 * date must recommend nothing at all, rather than pushing the specialist to the
 * legacy app on a guess.
 */
export function isLegacyPlatformStartDate(
  startDate: string | null | undefined,
): boolean {
  const cohortStartMs = toDateOnlyUtcMs(startDate);
  const cutoffMs = toDateOnlyUtcMs(NEW_PLATFORM_START_DATE_CUTOFF);
  if (cohortStartMs == null || cutoffMs == null) return false;

  return cohortStartMs < cutoffMs;
}

export type PlatformSwitchSelection = {
  programId?: number | null;
  cohortId?: number | null;
};

/**
 * Legacy internship URL carrying the current selection. The legacy app reads
 * `?program=` / `?cohort=` in its InternshipContext, so the specialist lands on
 * the same cohort instead of whatever it had in localStorage.
 *
 * No auth token here — pass the result through `buildExternalAuthRedirectUrl`
 * to add one.
 */
export function buildLegacyInternshipUrl(
  selection: PlatformSwitchSelection = {},
): string {
  const url = new URL(
    `${legacyBase.replace(/\/+$/, "")}${LEGACY_INTERNSHIP_PATH}`,
  );

  if (selection.programId != null) {
    url.searchParams.set("program", String(selection.programId));
  }
  if (selection.cohortId != null) {
    url.searchParams.set("cohort", String(selection.cohortId));
  }

  return url.toString();
}

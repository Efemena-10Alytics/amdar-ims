import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { WeeklySurveyStatusData, WeeklySurveyStatusResponse } from "./types";

export const WEEKLY_SURVEY_STATUS_QUERY_KEY = (
  cohortId: number | string,
  internshipCourseId: number | string,
) => ["weekly-survey", "status", cohortId, internshipCourseId] as const;

export async function getWeeklySurveyStatus(params: {
  cohort_id: number;
  internship_course_id: number;
}): Promise<WeeklySurveyStatusData> {
  const { data } = await axiosInstance.get<WeeklySurveyStatusResponse>(
    "internships/weekly-survey/status",
    { params },
  );

  // Response is the bare { submitted, submitted_at } object — no wrapper to unwrap.
  return data;
}

export function useGetWeeklySurveyStatus(params: {
  cohortId: number | null;
  internshipCourseId: number | null;
  enabled: boolean;
}) {
  const { cohortId, internshipCourseId, enabled } = params;
  const hasIds = cohortId != null && internshipCourseId != null;

  return useQuery({
    queryKey: WEEKLY_SURVEY_STATUS_QUERY_KEY(cohortId ?? "", internshipCourseId ?? ""),
    queryFn: () =>
      getWeeklySurveyStatus({
        cohort_id: cohortId as number,
        internship_course_id: internshipCourseId as number,
      }),
    enabled: !!apiBaseURL && enabled && hasIds,
  });
}

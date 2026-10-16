import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type {
  WeeklySurveyCheckLastWeekData,
  WeeklySurveyCheckLastWeekResponse,
} from "./types";

export const WEEKLY_SURVEY_CHECK_LAST_WEEK_QUERY_KEY = (
  cohortId: number | string,
  internshipCourseId: number | string,
) => ["weekly-survey", "check-last-week", cohortId, internshipCourseId] as const;

export async function getWeeklySurveyCheckLastWeek(params: {
  cohort_id: number;
  internship_course_id: number;
}): Promise<WeeklySurveyCheckLastWeekData> {
  const { data } = await axiosInstance.get<WeeklySurveyCheckLastWeekResponse>(
    "internships/weekly-survey/check-last-week",
    { params },
  );

  // Response is the bare { submitted, submitted_at } object
  return data;
}

export function useGetWeeklySurveyCheckLastWeek(params: {
  cohortId: number | null;
  internshipCourseId: number | null;
  enabled: boolean;
}) {
  const { cohortId, internshipCourseId, enabled } = params;
  const hasIds = cohortId != null && internshipCourseId != null;

  return useQuery({
    queryKey: WEEKLY_SURVEY_CHECK_LAST_WEEK_QUERY_KEY(
      cohortId ?? "",
      internshipCourseId ?? "",
    ),
    queryFn: () =>
      getWeeklySurveyCheckLastWeek({
        cohort_id: cohortId as number,
        internship_course_id: internshipCourseId as number,
      }),
    enabled: !!apiBaseURL && enabled && hasIds,
  });
}

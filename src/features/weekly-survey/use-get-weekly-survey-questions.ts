import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { WeeklySurveyQuestionsData, WeeklySurveyQuestionsResponse } from "./types";

export const WEEKLY_SURVEY_QUESTIONS_QUERY_KEY = ["weekly-survey", "questions"] as const;

export async function getWeeklySurveyQuestions(): Promise<WeeklySurveyQuestionsData> {
  const { data } = await axiosInstance.get<WeeklySurveyQuestionsResponse>(
    "internships/weekly-survey/questions",
  );

  return data.data;
}

export function useGetWeeklySurveyQuestions(enabled: boolean) {
  return useQuery({
    queryKey: WEEKLY_SURVEY_QUESTIONS_QUERY_KEY,
    queryFn: getWeeklySurveyQuestions,
    enabled: !!apiBaseURL && enabled,
  });
}

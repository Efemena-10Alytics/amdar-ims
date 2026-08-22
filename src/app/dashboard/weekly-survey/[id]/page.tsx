import SurveyDetailBody from "@/components/_core/dashboard/weekly-survey/survey-detail-body";
import SurveyModal from "@/components/_core/dashboard/weekly-survey/survey-modal";

interface WeeklySurveyDetailPageProps {
  params: { id: string };
  searchParams: { view?: string };
}

const WeeklySurveyDetailPage = ({ params, searchParams }: WeeklySurveyDetailPageProps) => {
  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      <SurveyDetailBody internId={params.id} />
      {searchParams.view && <SurveyModal surveyId={searchParams.view} />}
    </div>
  );
};

export default WeeklySurveyDetailPage;
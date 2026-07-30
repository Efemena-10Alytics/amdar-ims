"use client";

import StageProjectSchedule, {
  type StageProjectScheduleTone,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";
import { useStageProjectScheduleData } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/use-stage-project-schedule-data";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";

function StageStateMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="border-t border-[#C8E6D0] px-3 py-6 sm:px-4">
      <p className="text-sm text-[#64748B]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex h-9 cursor-pointer items-center rounded-full bg-[#156374] px-4 text-sm font-medium text-white hover:bg-[#124F5D]"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

type CareerStageScheduleProps = {
  careerStage: InternProjectCareerStage;
  description: string;
  tone: StageProjectScheduleTone;
};

export default function CareerStageSchedule({
  careerStage,
  description,
  tone,
}: CareerStageScheduleProps) {
  const {
    projectTitle,
    weekRange,
    weeks,
    projectHref,
    isLoading,
    isError,
    isEmpty,
    refetch,
  } = useStageProjectScheduleData(careerStage);

  if (isLoading) {
    return <StageStateMessage message="Loading project schedule..." />;
  }

  if (isError) {
    return (
      <StageStateMessage
        message="Something went wrong while loading this stage."
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (isEmpty || !projectTitle || !weeks.length) {
    return (
      <StageStateMessage message="No published project is available for this stage yet." />
    );
  }

  return (
    <StageProjectSchedule
      description={description}
      projectTitle={projectTitle}
      weekRange={weekRange}
      weeks={weeks}
      tone={tone}
      projectHref={projectHref}
    />
  );
}

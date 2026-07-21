"use client";

import Image from "next/image";
import { CalendarDays, User } from "lucide-react";

type TaskItem = {
  id: string;
  label: string;
  progress?: number;
};

const STAGE_TASKS: TaskItem[] = [
  { id: "foundational-videos", label: "Foundational videos", progress: 35 },
  { id: "how-to-videos", label: "How-To-Videos" },
  { id: "guided-walkthroughs", label: "Guided Practical Walkthroughs" },
  { id: "project-submissions", label: "Project submissions" },
  { id: "transitional-stage", label: "Transitional stage" },
];

type YourTaskProps = {
  stageTitle?: string;
  tasks?: TaskItem[];
  imageSrc?: string;
  onContinue?: (taskId: string) => void;
};

const YourTask = ({
  stageTitle = "Uniformity Stage",
  tasks = STAGE_TASKS,
  imageSrc = "/images/svgs/illustration/Smug 2.svg",
  onContinue,
}: YourTaskProps) => {
  const activeTask = tasks[0] ?? null;
  if (!activeTask) return null;

  const title =
    "Tenant Retention Optimization: Building an Interactive Power BI Dashboard for...";

  return (
    <section className="rounded-2xl border border-[#F3D5A3] bg-[#F9E7C7] px-5 py-4 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#4285F4]">
              G
            </span>
            <h3 className="text-[22px] lg:text-[32px] max-w-200 leading-9 font-semibold text-[#233A43]">
              {title}
            </h3>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F4DEB5] px-3 py-1 text-xs font-medium text-[#5B5E67]">
              Healthcare
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F4DEB5] px-3 py-1 text-xs font-medium text-[#5B5E67]">
              <CalendarDays className="size-3.5" />
              3 weeks duration
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F4DEB5] px-3 py-1 text-xs font-medium text-[#5B5E67]">
              <User className="size-3.5" />
              Jennifer Okeke contributor
            </span>
          </div>

          <button
            type="button"
            onClick={() => onContinue?.(activeTask.id)}
            className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#0F6371] px-5 text-sm font-semibold text-white transition hover:bg-[#0C5662]"
          >
            Continue project
          </button>
        </div>

        <div className="hidden shrink-0 sm:block pr-20">
          <Image
            src={imageSrc}
            alt={`${stageTitle} buddy`}
            width={92}
            height={108}
            className="h-auto w-23 object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default YourTask;

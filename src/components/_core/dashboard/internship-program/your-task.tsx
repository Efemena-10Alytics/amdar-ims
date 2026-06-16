"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader, } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrangleIcon } from "../svg";

const TASK_IMAGE = "/images/pngs/laptop.png";

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
    imageSrc = TASK_IMAGE,
    onContinue,
}: YourTaskProps) => {
    const [activeTaskId, setActiveTaskId] = useState(tasks[0]?.id ?? "");
    const activeTask =
        tasks.find((task) => task.id === activeTaskId) ?? tasks[0] ?? null;
    const progress = activeTask?.progress ?? 0;

    if (!activeTask) return null;

    return (
        <section className="rounded-2xl bg-primary p-3 sm:p-4">
            <h2 className="text-base font-semibold text-white sm:text-lg">Your Task</h2>

            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,16rem)_1fr]">
                <aside className="rounded-xl bg-white p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-[#3B6B76] sm:text-base">
                        {stageTitle}
                    </h3>

                    <ul className="mt-3 space-y-0.5">
                        {tasks.map((task) => {
                            const isActive = task.id === activeTaskId;
                            const isInProgress =
                                isActive && task.progress != null && task.progress < 100;

                            return (
                                <li key={task.id}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTaskId(task.id)}
                                        className={cn(
                                            "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition sm:text-sm",
                                            isActive
                                                ? "bg-[#CFF6DA] text-[#156374]"
                                                : "text-[#98A2B3] hover:bg-[#F6F8FA] hover:text-[#64748B]",
                                        )}
                                    >
                                        <span className="min-w-0 leading-snug">{task.label}</span>
                                        {isInProgress ? (
                                            <Loader
                                                className="size-4 shrink-0 animate-spin text-[#156374]"
                                                strokeWidth={2.5}
                                                aria-hidden
                                            />
                                        ) : (
                                            <TrangleIcon />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                <article className="rounded-xl bg-white p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-[#3B6B76] sm:text-base">
                        {activeTask.label}
                    </h3>

                    <div className="relative mt-3 h-28 overflow-hidden rounded-xl bg-[#EEF4F6] sm:h-32">
                        <Image
                            src={imageSrc}
                            alt={activeTask.label}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                    </div>

                    <div className="mt-3">
                        <div className="h-1 overflow-hidden rounded-full bg-[#E2E8F0]">
                            <div
                                className="h-full rounded-full bg-[#238A50] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-1 text-right text-xs text-[#98A2B3] sm:text-sm">
                            Completed: {progress}%
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => onContinue?.(activeTask.id)}
                        className="mt-3 w-full cursor-pointer rounded-full border border-[#156374] bg-[#EEF7FA] px-5 py-2.5 text-sm font-semibold text-[#156374] transition hover:bg-[#E4F2F6] sm:text-base"
                    >
                        Continue task
                    </button>
                </article>
            </div>
        </section>
    );
};

export default YourTask;

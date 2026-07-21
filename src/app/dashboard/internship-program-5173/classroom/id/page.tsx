"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDot,
  Lightbulb,
  LoaderCircle,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKS = ["Week 1", "Week 2", "Week 3"] as const;

const PROJECT_DAYS = [
  {
    name: "Monday",
    items: [
      { label: "Download materials & data set", status: "done" },
      { label: "How To Use Agile Project Mana...", status: "active" },
      { label: "Download materials & data set", status: "todo" },
    ],
  },
  { name: "Tuesday", items: [] },
  { name: "Wednesday", items: [] },
  { name: "Thursday", items: [] },
  { name: "Friday", items: [] },
  { name: "Saturday", items: [] },
] as const;

type Week = (typeof WEEKS)[number];
type TaskStatus = "done" | "active" | "todo";

function TaskIcon({ status }: { status: TaskStatus }) {
  if (status === "done") {
    return <Check className="size-3.5 text-[#24875B]" strokeWidth={2.5} />;
  }

  if (status === "active") {
    return (
      <LoaderCircle className="size-3.5 animate-spin text-[#4D9DAA]" />
    );
  }

  return <Circle className="size-3.5 text-[#AFC0C5]" />;
}

function ClassroomHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <Link
        href="/dashboard/internship-program-5173"
        className="inline-flex items-center gap-2 text-base font-semibold text-[#173740]"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-[#EDF1F2] text-[#94A3B8]">
          <ArrowLeft className="size-4" />
        </span>
        Classroom
      </Link>

      <div className="flex items-center gap-1">
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#C9F2D7] px-3 text-xs font-medium text-[#286344]">
          <CircleDot className="size-4" />
          Formative stage
        </span>
        <span className="inline-flex h-8 items-center rounded-full bg-[#C9F2D7] px-3 text-xs font-medium text-[#286344]">
          • Week 5 of 16
        </span>
      </div>
    </header>
  );
}

function LessonPanel() {
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);

  return (
    <div className="space-y-2">
      <section className="overflow-hidden rounded-xl bg-[#F6F9FA]">
        <button
          type="button"
          onClick={() => setIsOverviewOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 border-b border-[#DCE6E9] px-4 py-3 text-left"
        >
          <h1 className="text-lg font-medium text-[#123F49]">
            How To Use Agile Project Management Tool
          </h1>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#A8CED5] text-[#156374]">
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                !isOverviewOpen && "-rotate-90",
              )}
            />
          </span>
        </button>

        {isOverviewOpen ? (
          <div className="px-4 py-3">
            <p className="max-w-3xl text-sm leading-relaxed text-[#6F8196]">
              Gain proficiency in industry-standard tools while executing
              real-world projects that mirror professional environments by
              applying structured workflows and practical techniques to solve
              real business challenges.
            </p>

            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-48 flex-1">
                <p className="mb-1 text-sm font-medium text-[#173740]">
                  Completed: 35%
                </p>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#9DE5B8]">
                  <div className="h-full w-[7%] rounded-full bg-[#24875B]" />
                </div>
              </div>

              <button
                type="button"
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#FFE49A] px-4 text-sm font-medium text-[#7C5A16] hover:bg-[#FFDC7A]"
              >
                <Lightbulb className="size-4 fill-current" />
                Submit your solution
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-[#DCE6E9] bg-[#F8FAFB] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[#173740]">
          Watch video
        </h2>

        <div className="group relative aspect-video min-h-72 overflow-hidden rounded-xl bg-[#142A2F]">
          <Image
            src="/images/pngs/about/about-img-video.png"
            alt="Agile project management lesson"
            fill
            priority
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-black/10" />
          <button
            type="button"
            className="absolute bottom-5 left-5 inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-white"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#22869A] ring-4 ring-[#22869A]/35 transition-transform group-hover:scale-105">
              <Play className="ml-0.5 size-4 fill-white" />
            </span>
            Play to watch
          </button>
        </div>

        <p className="mt-3 inline-flex items-center gap-2 text-xs text-[#718397]">
          <span className="size-2 rounded-full border-2 border-[#168099] bg-[#BDECF3]" />
          1hr 36mins of video left
        </p>
      </section>
    </div>
  );
}

function ProjectTodoPanel() {
  const [activeWeek, setActiveWeek] = useState<Week>("Week 1");
  const [openDay, setOpenDay] = useState("Monday");

  return (
    <aside className="rounded-xl border border-[#DCE6E9] bg-[#F8FAFB] p-3">
      <div className="flex items-end gap-6 border-b border-[#DFE8EB]">
        {WEEKS.map((week) => (
          <button
            key={week}
            type="button"
            onClick={() => setActiveWeek(week)}
            className={cn(
              "relative cursor-pointer pb-2 text-sm font-medium",
              activeWeek === week ? "text-[#156374]" : "text-[#B6CFD4]",
            )}
          >
            {week}
            {activeWeek === week ? (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#156374]" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="flex h-44 items-center justify-center">
        <Image
          src="/images/svgs/illustration/Super Excited 3.svg"
          alt="Classroom buddy"
          width={112}
          height={122}
          className="h-32 w-auto object-contain"
        />
      </div>

      <div className="rounded-xl bg-white p-3 shadow-[0_6px_24px_rgba(15,70,82,0.04)]">
        <h2 className="mb-3 text-sm font-medium text-[#34445E]">
          Project Todo
        </h2>

        <div className="space-y-2">
          {PROJECT_DAYS.map((day) => {
            const isOpen = day.name === openDay;
            return (
              <div
                key={day.name}
                className="overflow-hidden rounded-md bg-[#E4EEF1]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenDay((current) =>
                      current === day.name ? "" : day.name,
                    )
                  }
                  className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-xs font-medium text-[#315762]"
                >
                  {day.name}
                  {isOpen ? (
                    <ChevronDown className="size-3.5 text-[#156374]" />
                  ) : (
                    <ChevronRight className="size-3.5 text-[#156374]" />
                  )}
                </button>

                {isOpen && day.items.length ? (
                  <div className="space-y-2 bg-[#F0F5F6] px-3 py-2.5">
                    {day.items.map((item, index) => (
                      <div
                        key={`${item.label}-${index}`}
                        className="flex items-start gap-2 text-[11px] leading-4 text-[#667B8C]"
                      >
                        <TaskIcon status={item.status} />
                        <span
                          className={cn(
                            item.status === "active" &&
                              "text-[#397886] underline underline-offset-2",
                          )}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default function ClassroomPage() {
  return (
    <main className="space-y-5 px-4 py-6 lg:px-6">
      <ClassroomHeader />
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <LessonPanel />
        <ProjectTodoPanel />
      </div>
    </main>
  );
}

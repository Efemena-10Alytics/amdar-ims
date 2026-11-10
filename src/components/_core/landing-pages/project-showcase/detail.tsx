"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Clock3, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompanyLogo } from "./company-logo";
import {
  SHOWCASE_TABS,
  type ShowcaseProject,
  type ShowcaseSection,
  type ShowcaseTab,
} from "./data";

function BriefSection({ section }: { section: ShowcaseSection }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-[#0F172A]">{section.heading}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#64748B] sm:text-[15px]">
        {section.body}{" "}
        {section.more ? (
          <Link href="/internship" className="font-medium text-[#156374] hover:underline">
            Read more &gt;&gt;&gt;
          </Link>
        ) : null}
      </p>
    </section>
  );
}

export default function ProjectShowcaseDetail({
  project,
}: {
  project: ShowcaseProject;
}) {
  const [tab, setTab] = useState<ShowcaseTab>("brief");
  const sections = project.tabs[tab];

  return (
    <article className="bg-white py-8 sm:py-10">
      <div className="app-width">
        <div className="relative min-h-[260px] overflow-hidden rounded-[28px] sm:min-h-[300px]">
          <img
            src={project.image}
            alt=""
            className="absolute inset-0 size-full object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0B1C22] via-[#0B1C22]/80 to-[#0B1C22]/20" />
          <div className="relative flex min-h-[260px] flex-col p-5 sm:min-h-[300px] sm:p-8">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[#0F172A] shadow-sm">
                Project view
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  project.status === "Active"
                    ? "bg-[#DCFCE7] text-[#15803D]"
                    : "bg-white/90 text-[#0F172A]",
                )}
              >
                {project.status}
              </span>
            </div>

            <div className="mt-auto max-w-xl pt-12">
              <CompanyLogo mark={project.mark} />
              <h1 className="mt-3 max-w-4xl font-clash-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {project.title}
              </h1>
              <Link
                href="/internship"
                className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#156374] px-4 text-sm font-semibold text-white transition hover:bg-[#0f4d5a]"
              >
                Start project
              </Link>
            </div>
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#64748B]">
          <li className="inline-flex items-center gap-2">
            <Building2 className="size-4 text-[#156374]" />
            {project.category}
          </li>
          <li className="inline-flex items-center gap-2">
            <Clock3 className="size-4 text-[#156374]" />
            {project.duration} duration
          </li>
          <li className="inline-flex items-center gap-2">
            <UserRound className="size-4 text-[#156374]" />
            <span className="font-medium text-[#0F172A]">{project.contributor}</span>
            <span>contributor</span>
          </li>
        </ul>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-[#0F172A]">Skills to be developed</h2>
          {project.skills.length === 0 ? (
            <p className="mt-3 text-sm text-[#64748B]">No skills listed yet.</p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md bg-[#F1F5F9] px-2.5 py-1 text-xs font-medium text-[#475569]"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 overflow-x-auto border-b border-[#E2E8F0]">
          <div className="flex min-w-max gap-6" role="tablist" aria-label="Project sections">
            {SHOWCASE_TABS.map((item) => {
              const selected = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "-mb-px border-b-2 px-0.5 pb-3 text-sm font-medium transition",
                    selected
                      ? "border-[#0F172A] text-[#0F172A]"
                      : "border-transparent text-[#94A3B8] hover:text-[#475569]",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 max-w-4xl space-y-6" role="tabpanel">
          {sections.map((section) => (
            <BriefSection key={section.heading} section={section} />
          ))}
        </div>
      </div>
    </article>
  );
}

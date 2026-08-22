"use client";

import React from "react";
import Link from "next/link";
import StatsCard from "./stats-card";
import ProfileHeader from "./profile-header";
import SurveyReportTable from "./survey-report-table";
import { ArrowLeftIcon, ClockStatIcon, DocumentStatIcon } from "./icons";
import { INTERNS } from "./types";

interface SurveyDetailBodyProps {
  internId: string;
}

const SurveyDetailBody = ({ internId }: SurveyDetailBodyProps) => {
  const intern = INTERNS.find((i) => i.id === internId) ?? INTERNS[0];

  const stats = [
    { key: "completion", icon: <ClockStatIcon />, title: "Avg. completion rate", value: intern.stats.completionRate },
    { key: "specialist", icon: <DocumentStatIcon />, title: "Avg. specialist rate", value: intern.stats.specialistRate },
    { key: "experience", icon: <DocumentStatIcon />, title: "Avg. experience rate", value: intern.stats.experienceRate },
    { key: "project", icon: <DocumentStatIcon />, title: "Avg. project rate", value: intern.stats.projectRate },
  ];

  return (
    <div>
      <Link
        href="/dashboard/weekly-survey"
        className="flex items-center gap-2 font-sora text-sm text-[#5C6777] hover:text-[#092A31]"
      >
        <ArrowLeftIcon />
        Back
      </Link>

      <div className="mt-4">
        <ProfileHeader intern={intern} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.key}
            icon={stat.icon}
            title={stat.title}
            percentage={stat.value}
            targetText={`On ${stat.value} target`}
          />
        ))}
      </div>

      <div className="mt-10">
        <SurveyReportTable />
      </div>
    </div>
  );
};

export default SurveyDetailBody;
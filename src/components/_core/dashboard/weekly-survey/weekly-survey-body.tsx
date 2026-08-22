"use client";

import React, { useState } from "react";
import StatsCard from "./stats-card";
import SurveyTable from "./survey-table";
import { ClockStatIcon, DocumentStatIcon } from "./icons";
import { PeriodOption } from "./period-dropdown";
import { WEEKS_IN_COHORT } from "./types";

const ALL_TIME_OPTIONS: PeriodOption[] = [
  { label: "All time", value: "all-time" },
  {
    label: "Weeks",
    value: "weeks",
    submenu: WEEKS_IN_COHORT.map((w) => ({ label: w, value: w.toLowerCase().replace(" ", "-") })),
  },
  { label: "Custom", value: "custom" },
];

const STATS = [
  { key: "completion", icon: <ClockStatIcon />, title: "Avg. completion rate", percentage: "80%", target: "80% target" },
  { key: "specialist", icon: <DocumentStatIcon />, title: "Avg. specialist rate", percentage: "80%", target: "80% target" },
  { key: "experience", icon: <DocumentStatIcon />, title: "Avg. experience rate", percentage: "80%", target: "80% target" },
  { key: "project", icon: <DocumentStatIcon />, title: "Avg. project rate", percentage: "80%", target: "80% target" },
];

const WeeklySurveyBody = () => {
  const [periods, setPeriods] = useState<Record<string, string>>({
    completion: "all-time",
    specialist: "all-time",
    experience: "all-time",
    project: "all-time",
  });

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatsCard
            key={stat.key}
            icon={stat.icon}
            title={stat.title}
            percentage={stat.percentage}
            targetText={stat.target}
            periodOptions={ALL_TIME_OPTIONS}
            selectedPeriod={periods[stat.key]}
            onPeriodChange={(v) => setPeriods((p) => ({ ...p, [stat.key]: v }))}
          />
        ))}
      </div>

      <div className="mt-10">
        <SurveyTable />
      </div>
    </div>
  );
};

export default WeeklySurveyBody;
"use client";
import { cn } from "@/lib/utils";
import React from "react";
import Internship from "./internship";
import RealWorldProject from "./real-world-project";
import TalentLoop from "./talent-loop";

const WhatWeOffer = () => {
  const [activeTab, setActiveTab] = React.useState<
    "Internship" | "Real-world Projects" | "Talent loop"
  >("Internship");
  const tabs = [
    { id: "Internship", label: "Internship" },
    { id: "Real-world Projects", label: "Real-world Projects" },
    { id: "Talent loop", label: "Talent loop" },
  ];
  return (
    <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8 mt-10 py-10">
      <div className="flex items-end justify-between">
        <p className="text-sm text-gray-500 mb-4">Use switch tab</p>
        <div className="flex justify-end mb-6">
          <div className="flex gap-2 rounded-full bg-[#E8EFF1] py-1.5 px-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "py-2 rounded-full text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-[#B6CFD4] text-primary px-3"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {activeTab === "Internship" && <Internship />}
      {activeTab === "Real-world Projects" && <RealWorldProject />}
      {activeTab === "Talent loop" && <TalentLoop />}
    </div>
  );
};

export default WhatWeOffer;

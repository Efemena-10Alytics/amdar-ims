"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Overview from "./overview";
import InternsProject from "./interns-project";
import { CalendarSvg, LocationSvg, TrensFillDvg, UserFillSVG } from "../../svg";
import Gain from "./gain";
import CareerOpporturnity from "./career-opporturnity";
import ProgramStructure from "./program-structure";
import Faq from "./faq";
import PaymentStructure from "./payment-structure";
import Mentors from "./mentors";
import Link from "next/link";
import type { InternshipProgram } from "@/types/internship-program";

interface LeftProps {
  program?: InternshipProgram;
}

const Left = ({ program }: LeftProps) => {
  const [activeTab, setActiveTab] = useState("Overview");

  console.log("program:", program);

  const tabs = [
    "Overview",
    "What you'll gain",
    "Career Opportunity",
    "Program Structure",
    "Faqs",
    // "Mentors",
    "Interns projects",
  ];

  const defaultTools = [
    { name: "Figma", icon: "/images/svgs/tools/figma.svg" },
    { name: "Sketch", icon: "/images/svgs/tools/sketch.svg" },
    { name: "Trello", icon: "/images/svgs/tools/trello.svg" },
    { name: "Jira", icon: "/images/svgs/tools/jira-2.svg" },
    { name: "Photoshop", icon: "/images/svgs/tools/photoshop.svg" },
    { name: "Canva", icon: "/images/svgs/tools/canva.svg" },
    {
      name: "Adobe Illustration",
      icon: "/images/svgs/tools/adobe-illustrator.svg",
    },
    { name: "Light Room", icon: "/images/svgs/tools/light-room.svg" },
  ];
  const tools =
    (program?.tools?.length &&
      program.tools.map((t) => ({
        name: t.name,
        icon: "/images/svgs/tools/adobe-illustrator.svg",
      }))) ||
    defaultTools;

  return (
    <div className="py-12 lg:py-20">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#092A31] mb-4">
          {program?.title}
        </h1>
        <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed">
          {program?.description}
        </p>

        {/* Key Details */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5">
              <CalendarSvg />
              <span className="text-sm text-[#64748B]">
                {program?.duration}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5">
              <UserFillSVG />
              <span className="text-sm text-[#64748B]">DevOps consultant</span>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5">
              <LocationSvg />
              <span className="text-sm text-[#64748B] capitalize">
                {program?.type}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5">
              <TrensFillDvg />
              <span className="text-sm text-[#64748B]">
                {program?.level ? program.level : "Beginner - Intermediate"}
              </span>
            </div>
          </div>
        </div>

        {/* Software Tools */}
        <div className="flex flex-wrap gap-3">
          {tools.map((tool, index) => (
            <div
              key={tool.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200"
            >
              <Image
                src={tool.icon}
                alt={tool.name}
                width={16}
                height={16}
                className="object-contain"
              />
              <span className="text-sm text-[#092A31] font-medium">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing and Apply Bar */}
      <div className="bg-[#C8DDE3] rounded-lg p-4 lg:p-6 mb-8 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-[#64748B] line-through text-lg">USD 500</div>
          <div className="text-2xl lg:text-3xl font-bold text-[#092A31]">
            USD 390
          </div>
        </div>
        <Link href={"/payment/1"}>
          <Button
            className={cn(
              "bg-primary text-white hover:bg-[#0f4d5a] rounded-full px-6 py-6 text-base font-medium",
              "inline-flex items-center gap-2",
            )}
          >
            Apply now
            <div className="flex h-5 w-5 rounded-full justify-center items-center bg-amdari-yellow">
              <ArrowRight className="w-3 h-3" color="#156374" />
            </div>
          </Button>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-4 mb-8 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "text-base font-medium transition-colors pb-2 whitespace-nowrap",
              activeTab === tab
                ? "text-[#156374] border-b-2 border-[#156374]"
                : "text-[#B6CFD4] hover:text-[#092A31]",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Section */}
      {activeTab === "Overview" && <Overview overview={program?.overview} />}
      {activeTab === "Interns projects" && <InternsProject />}
      {activeTab === "What you'll gain" && <Gain gain={program?.gain} />}
      {activeTab === "Career Opportunity" && <CareerOpporturnity careerOpporturnity={program?.career_opportunities} />}
      {activeTab === "Program Structure" && <ProgramStructure />}
      {activeTab === "Faqs" && <Faq />}
      {activeTab === "Payment Structure" && <PaymentStructure />}
      {activeTab === "Mentors" && <Mentors />}

      {/* Bottom CTA Banner */}
      <div className="mt-16 bg-[#156374] rounded-xl p-8 lg:p-12">
        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
          Land Your First Job In Tech
        </h2>
        <p className="text-gray-300 text-base lg:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Don't let the lack of real world experience hold you back. Join Amdari
          today and take a decisive step toward a successful career in tech.
        </p>
        <Button
          className={cn(
            "bg-amdari-yellow text-[#092A31] hover:bg-amdari-yellow/90 rounded-full px-8 py-6 text-base font-medium",
            "inline-flex items-center gap-2",
          )}
        >
          Apply for next cohort
          <div className="flex h-5 w-5 rounded-full justify-center items-center bg-[#092A31]">
            <ArrowRight className="w-3 h-3" color="#FFE082" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Left;

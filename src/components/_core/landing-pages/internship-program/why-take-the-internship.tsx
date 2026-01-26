import React from "react";
import { Video } from "lucide-react";
import {
  BriefcaseSVG,
  DeskSVG,
  DocSVG,
  FileSVG,
  InterviewSVG,
  LinkedInSVG,
  PlugSVG,
  UserFourSVG,
} from "./svg";

const WhyTakeTheInternship = () => {
  const outcomes = [
    {
      id: 1,
      icon: BriefcaseSVG,
      label: "Job Ready",
    },
    {
      id: 2,
      icon: FileSVG,
      label: "Portfolio",
    },
    {
      id: 3,
      icon: InterviewSVG,
      label: "Experience",
    },
    {
      id: 4,
      icon: LinkedInSVG,
      label: "LinkedIn",
    },
    {
      id: 5,
      icon: UserFourSVG,
      label: "LinkedIn",
    },
    {
      id: 6,
      icon: DocSVG,
      label: "LinkedIn",
    },
    {
      id: 7,
      icon: DeskSVG,
      label: "LinkedIn",
    },
    {
      id: 8,
      icon: PlugSVG,
      label: "LinkedIn",
    },
  ];

  return (
    <div className="bg-[#FFE082] py-12 lg:py-20">
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          {/* Top Left Tag */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8CC76] border border-[#E8C97A]">
              <div className="flex items-center justify-center bg-[#FFE082] h-6 w-6 rounded-full">
                <Video className="w-4 h-4 text-[#8B6914]" />
              </div>
              <span className="text-sm font-medium text-[#8B6914]">
                What You Receive
              </span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Main Title */}
            <div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#092A31] leading-tight">
                Professional Outcomes You Can Use Immediately
              </h2>
            </div>

            {/* Subtitle/Quote */}
            <div>
              <p className="text-lg lg:text-xl text-[#092A31] leading-relaxed">
                This is the difference between 'I've learned it' and 'I've done
                it.'
              </p>
            </div>
          </div>
        </div>

        {/* Outcome Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {outcomes.map((outcome) => {
            const Icon = outcome.icon;
            return (
              <div
                key={outcome.id}
                className="bg-[#E8CC76] rounded-lg p-5 flex gap-4 flex-col justify-center border border-[#E8C97A]"
              >
                <Icon />
                <span className="text-sm font-medium text-[#092A31]">
                  {outcome.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhyTakeTheInternship;

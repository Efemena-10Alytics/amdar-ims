"use client";

import React from "react";
import { CopyIcon, DefaultAvatarIcon, UniformityStageIcon } from "./icons";
import { Intern } from "./types";

interface ProfileHeaderProps {
  intern: Intern;
}

const ProfileHeader = ({ intern }: ProfileHeaderProps) => {
  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(intern.email).catch(() => {});
  };

  return (
    <div className="relative flex min-h-[216px] flex-col justify-center gap-4 rounded-[24px] bg-[#F8FAFC] p-4">
      <div className="absolute right-4 top-4 flex h-10 items-center gap-1.5 rounded-[80px] bg-[#C7F5D8] px-3 py-2 font-sora text-sm text-[#092A31]">
        <UniformityStageIcon />
        Uniformity stage
        <span className="mx-0.5">•</span>
        {intern.uniformityStage}
      </div>

      <div className="flex flex-col items-start">
        <div className="relative">
          {intern.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={intern.avatarUrl} alt={intern.name} className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <DefaultAvatarIcon />
          )}
          <span className="absolute -bottom-2 left-1/2 flex h-[26px] w-[70px] -translate-x-1/2 items-center justify-center gap-1 rounded-[24px] bg-[#C7F5D8] px-2 font-sora text-sm text-[#297A46]">
            <span className="text-xs">•</span> Active
          </span>
        </div>

        <h2 className="mt-4 font-sora text-2xl font-semibold text-[#092A31]">{intern.name}</h2>
        <div className="mt-1 flex items-center gap-2">
          <p className="font-sora italic text-[#5C6777]">{intern.email}</p>
          <button type="button" onClick={handleCopyEmail} aria-label="Copy email">
            <CopyIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { portfolioInputStyle } from ".";

const BIO_MAX_LENGTH = 280;

export type YourBioData = {
  jobTitle: string;
  yearsOfExperience: string;
  lifeProjectsCount: string;
  bio: string;
};

const textareaStyle = cn(
  portfolioInputStyle,
  "min-h-[120px] h-auto resize-y py-3",
);

type YourBioProps = {
  value: YourBioData;
  onChange: (data: YourBioData) => void;
};

export function YourBio({ value, onChange }: YourBioProps) {
  const bioRemaining = BIO_MAX_LENGTH - value.bio.length;

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold text-zinc-900">Your Bio</h2>
      <p className="mt-1 text-sm text-zinc-500 mb-6">
        Let&apos;s know about you and your professional journey.
      </p>
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="job-title"
            className="text-sm font-medium text-zinc-900 block"
          >
            Job title
          </label>
          <Input
            id="job-title"
            type="text"
            placeholder="Enter your job title"
            value={value.jobTitle}
            onChange={(e) =>
              onChange({ ...value, jobTitle: e.target.value })
            }
            className={portfolioInputStyle}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="years-experience"
            className="text-sm font-medium text-zinc-900 block"
          >
            Years of Experience
          </label>
          <Input
            id="years-experience"
            type="text"
            placeholder="e.g. 7+"
            value={value.yearsOfExperience}
            onChange={(e) =>
              onChange({ ...value, yearsOfExperience: e.target.value })
            }
            className={portfolioInputStyle}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="life-projects"
            className="text-sm font-medium text-zinc-900 block"
          >
            No. of life projects worked on/handled
          </label>
          <Input
            id="life-projects"
            type="text"
            placeholder="e.g. 28+"
            value={value.lifeProjectsCount}
            onChange={(e) =>
              onChange({ ...value, lifeProjectsCount: e.target.value })
            }
            className={portfolioInputStyle}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="bio"
            className="text-sm font-medium text-zinc-900 block"
          >
            Tell us a brief about yourself
          </label>
          <textarea
            id="bio"
            placeholder="I'm a product designer who breaks complex product into simple and friendly interface..."
            value={value.bio}
            onChange={(e) =>
              onChange({ ...value, bio: e.target.value.slice(0, BIO_MAX_LENGTH) })
            }
            maxLength={BIO_MAX_LENGTH}
            rows={4}
            className={textareaStyle}
          />
          <p className="text-xs text-zinc-500">
            {bioRemaining} character{bioRemaining !== 1 ? "s" : ""} remaining
          </p>
        </div>
      </div>
    </div>
  );
}

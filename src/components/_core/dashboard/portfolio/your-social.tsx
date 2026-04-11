"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Link2, Plus, User } from "lucide-react";
import { useGetPortfolio } from "@/features/portfolio/use-get-portfolio";
import { cn, getImageUrl } from "@/lib/utils";
import { portfolioInputStyle } from "./portfolio-styles";

export type YourSocialData = {
  linkedIn: string;
  twitter: string;
  /** Staged locally; uploaded when the user saves step 2. */
  profileImageFile?: File | null;
};

export type SocialPayload = {
  social: {
    linkedIn: string | null;
    twitter: string | null;
  };
};

/** Convert form data to API payload format (camelCase). */
export function socialToPayload(data: YourSocialData): SocialPayload {
  return {
    social: {
      linkedIn: data.linkedIn.trim() || null,
      twitter: data.twitter.trim() || null,
    },
  };
}

/** Parse API social into form data (e.g. for prefilling). */
export function payloadToSocial(payload: {
  social?: {
    linkedIn?: string | null;
    twitter?: string | null;
  };
}): Omit<YourSocialData, "profileImageFile"> {
  const s = payload.social;
  return {
    linkedIn: s?.linkedIn ?? "",
    twitter: s?.twitter ?? "",
  };
}

/** Returns true if value is empty or a valid URL (http/https). */
function isValidUrl(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === "") return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type YourSocialProps = {
  value: YourSocialData;
  onChange: (data: YourSocialData) => void;
};

const LINK_ERROR = "Please enter a valid link (e.g. https://...)";

export function YourSocial({ value, onChange }: YourSocialProps) {
  const { data: portfolioData } = useGetPortfolio();
  const [profileError, setProfileError] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const fileObjectUrl = useMemo(() => {
    if (!value.profileImageFile) return null;
    return URL.createObjectURL(value.profileImageFile);
  }, [value.profileImageFile]);

  useEffect(() => {
    return () => {
      if (fileObjectUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(fileObjectUrl);
      }
    };
  }, [fileObjectUrl]);

  const serverImageUrl = getImageUrl(
    portfolioData?.personalInfo?.image ?? undefined,
  );
  const profileDisplaySrc = fileObjectUrl ?? serverImageUrl ?? null;

  useEffect(() => {
    if (!portfolioData?.social) return;
    const isEmpty = !value.linkedIn.trim() && !value.twitter.trim();
    if (!isEmpty) return;
    const prefill = payloadToSocial(portfolioData);
    if (!prefill.linkedIn && !prefill.twitter) return;
    onChange({ ...value, ...prefill });
  }, [portfolioData]);

  const linkedInInvalid = value.linkedIn.trim() !== "" && !isValidUrl(value.linkedIn);
  const twitterInvalid = value.twitter.trim() !== "" && !isValidUrl(value.twitter);
  const linkedInVerified = value.linkedIn.trim() !== "" && isValidUrl(value.linkedIn);
  const twitterVerified = value.twitter.trim() !== "" && isValidUrl(value.twitter);
  const MAX_PROFILE_SIZE_BYTES = 3 * 1024 * 1024;

  const onProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileError("Please select an image file.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PROFILE_SIZE_BYTES) {
      setProfileError("Profile image must be 3MB or less.");
      e.target.value = "";
      return;
    }
    setProfileError(null);
    onChange({ ...value, profileImageFile: file });
    e.target.value = "";
  };

  return (
    <div className="max-w-md">
      {profileError ? (
        <p className="mb-4 text-sm text-red-500 text-center" role="alert">
          {profileError}
        </p>
      ) : null}
      <h2 className="text-lg font-semibold text-zinc-900">Your Socials & Image</h2>
      <p className="mt-1 text-sm text-zinc-500 mb-6">
        Provide your profile image and links to your socials
      </p>
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        onChange={onProfileChange}
        className="hidden"
        aria-label="Upload profile picture"
      />
      <button
        type="button"
        onClick={() => profileInputRef.current?.click()}
        className="mb-6 mx-auto flex w-full flex-col items-center"
      >
        <div className="relative size-30 overflow-visible">
          <div className="size-full rounded-full border-2 border-dashed border-[#C7DCE2] bg-[#F1F8FA] flex items-center justify-center overflow-hidden">
            {profileDisplaySrc ? (
              <img
                src={profileDisplaySrc}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <User className="size-10 text-[#B6CFD4]" />
            )}
          </div>
          <span className="absolute z-50 bottom-2 -right-0.5 flex size-8 items-center justify-center rounded-full bg-primary text-white shadow-sm ring-2 ring-white">
            <Plus className="size-4" />
          </span>
        </div>
        <span className="mt-3 text-sm text-[#A1A8B1] font-medium">
          Upload profile picture (max 3mb)
        </span>
      </button>

      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="linkedin"
            className="text-sm font-medium text-zinc-900 block"
          >
            LinkedIn
          </label>
          <div className="relative">
            <Input
              id="linkedin"
              type="url"
              placeholder="Paste profile link"
              value={value.linkedIn}
              onChange={(e) =>
                onChange({ ...value, linkedIn: e.target.value })
              }
              aria-invalid={linkedInInvalid}
              className={cn(
                portfolioInputStyle,
                "pr-10",
                linkedInInvalid && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            <Link2
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none transition-colors",
                linkedInVerified ? "text-[#3B82F6]" : "text-zinc-400"
              )}
              aria-hidden
            />
          </div>
          {linkedInInvalid && (
            <p className="text-sm text-red-500" role="alert">
              {LINK_ERROR}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="twitter"
            className="text-sm font-medium text-zinc-900 block"
          >
            X (Twitter)
          </label>
          <div className="relative">
            <Input
              id="twitter"
              type="url"
              placeholder="Paste profile link"
              value={value.twitter}
              onChange={(e) =>
                onChange({ ...value, twitter: e.target.value })
              }
              aria-invalid={twitterInvalid}
              className={cn(
                portfolioInputStyle,
                "pr-10",
                twitterInvalid && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            <Link2
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none transition-colors",
                twitterVerified ? "text-[#3B82F6]" : "text-zinc-400"
              )}
              aria-hidden
            />
          </div>
          {twitterInvalid && (
            <p className="text-sm text-red-500" role="alert">
              {LINK_ERROR}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

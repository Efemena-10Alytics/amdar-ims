"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Link2 } from "lucide-react";
import { useGetUserDetails } from "@/features/user/use-get-user-details";
import { cn } from "@/lib/utils";
import { portfolioInputStyle } from "./portfolio-styles";

export type YourSocialData = {
  linkedIn: string;
  twitter: string;
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
}): YourSocialData {
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

function getSocialFromUserDetails(
  details: Record<string, unknown> | null | undefined
): Partial<YourSocialData> {
  if (!details || typeof details !== "object") return {};
  const linkedIn =
    details.linkedIn ?? details.linkedin ?? details.linked_in ?? "";
  const twitter =
    details.twitter ?? details.x ?? details.x_twitter ?? "";
  return {
    linkedIn: typeof linkedIn === "string" ? linkedIn : "",
    twitter: typeof twitter === "string" ? twitter : "",
  };
}

export function YourSocial({ value, onChange }: YourSocialProps) {
  const { data: userDetails } = useGetUserDetails();
  useEffect(() => {
    if (!userDetails) return;
    const isEmpty = !value.linkedIn.trim() && !value.twitter.trim();
    if (!isEmpty) return;
    const prefill = getSocialFromUserDetails(userDetails);
    if (!prefill.linkedIn && !prefill.twitter) return;
    onChange({ ...value, ...prefill });
  }, [userDetails]);

  const linkedInInvalid = value.linkedIn.trim() !== "" && !isValidUrl(value.linkedIn);
  const twitterInvalid = value.twitter.trim() !== "" && !isValidUrl(value.twitter);
  const linkedInVerified = value.linkedIn.trim() !== "" && isValidUrl(value.linkedIn);
  const twitterVerified = value.twitter.trim() !== "" && isValidUrl(value.twitter);

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold text-zinc-900">Your Socials</h2>
      <p className="mt-1 text-sm text-zinc-500 mb-6">
        Provide the links to your social profile
      </p>
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

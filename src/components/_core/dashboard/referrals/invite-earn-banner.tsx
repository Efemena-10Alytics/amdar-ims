"use client";

import { useState } from "react";
import { LinkIcon } from "../svg";
import { FacebookShareIcon, InviteAndEarnIcon, TwitterShareIcon, WhatsappShareIcon } from "./icons";

export function InviteEarnBanner({
  referralLink,
  isLoading = false,
  errorMessage = null,
}: {
  /** `null` until the referral code has been fetched. */
  referralLink: string | null;
  isLoading?: boolean;
  errorMessage?: string | null;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shareText = encodeURIComponent(
    `Join me on Amdari and kickstart your career! ${referralLink ?? ""}`,
  );
  const shareUrl = encodeURIComponent(referralLink ?? "");

  const shareTargets = [
    {
      key: "whatsapp",
      href: `https://wa.me/?text=${shareText}`,
      label: "Share via WhatsApp",
      icon: <WhatsappShareIcon />,
    },
    {
      key: "facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      label: "Share via Facebook",
      icon: <FacebookShareIcon />,
    },
    {
      key: "twitter",
      href: `https://twitter.com/intent/tweet?text=${shareText}`,
      label: "Share via Twitter",
      icon: <TwitterShareIcon />,
    },
  ];

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-[#FFF5D8] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <InviteAndEarnIcon />
        <div>
          <p className="font-sora text-sm text-[#092A31]">Invite and Earn</p>
          <p className="font-clash-display text-base text-[#092A31] sm:text-lg">
            Earn rewards by referring great minds
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-sora text-sm text-[#092A31]">Your referral link</span>
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-[#E4BF7F] bg-white px-3 sm:w-70">
              <LinkIcon />
              {referralLink ? (
                <span className="truncate font-sora text-sm text-[#092A31]">{referralLink}</span>
              ) : isLoading ? (
                <span
                  className="h-4 w-44 max-w-full animate-pulse rounded bg-[#F1E3C2]"
                  aria-label="Loading your referral link"
                />
              ) : (
                <span className="truncate font-sora text-sm text-[#B42318]">
                  {errorMessage ?? "Referral link unavailable"}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!referralLink}
              className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-[#156374] px-4 font-sora text-sm font-medium text-white transition-colors hover:bg-[#156374]/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        <div className="hidden h-11 w-px bg-[#E4BF7F] lg:block" />

        <div className="flex flex-col gap-1.5">
          <span className="font-sora text-sm text-[#092A31]">Share via</span>
          <div className="flex items-center gap-2">
            {shareTargets.map((target) =>
              referralLink ? (
                <a
                  key={target.key}
                  href={target.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={target.label}
                >
                  {target.icon}
                </a>
              ) : (
                <span
                  key={target.key}
                  aria-label={target.label}
                  aria-disabled="true"
                  className="cursor-not-allowed opacity-60"
                >
                  {target.icon}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

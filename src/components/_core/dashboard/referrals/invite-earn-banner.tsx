"use client";

import { useState } from "react";
import { LinkIcon } from "../svg";
import { FacebookShareIcon, InviteAndEarnIcon, TwitterShareIcon, WhatsappShareIcon } from "./icons";

export function InviteEarnBanner({ referralLink }: { referralLink: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shareText = encodeURIComponent(
    `Join me on Amdari and kickstart your career! ${referralLink}`,
  );
  const shareUrl = encodeURIComponent(referralLink);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${shareText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}`,
  };

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
              <span className="truncate font-sora text-sm text-[#092A31]">{referralLink}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-[#156374] px-4 font-sora text-sm font-medium text-white transition-colors hover:bg-[#156374]/90"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        <div className="hidden h-11 w-px bg-[#E4BF7F] lg:block" />

        <div className="flex flex-col gap-1.5">
          <span className="font-sora text-sm text-[#092A31]">Share via</span>
          <div className="flex items-center gap-2">
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Share via WhatsApp">
              <WhatsappShareIcon />
            </a>
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share via Facebook">
              <FacebookShareIcon />
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share via Twitter">
              <TwitterShareIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

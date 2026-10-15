"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Announcement } from "@/features/announcement/announcement.types";
import { useGetAnnouncements } from "@/features/announcement/use-get-announcement";
import { useMarkAllAnnouncementsAsRead } from "@/features/announcement/use-mark-all-as-read";
import { AnnouncementLinkIcon, AnnouncementSoundIcon, BackArrowIcon } from "./icons";
import PageHeader from "@/components/_core/dashboard/dashboard/header";

function getAnnouncementHref(announcement: Announcement) {
  return announcement.url?.trim() || announcement.fileUrl?.trim() || undefined;
}

function formatAnnouncementDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function AnnouncementRow({ announcement }: { announcement: Announcement }) {
  const href = getAnnouncementHref(announcement);

  const content = (
    <>
      <AnnouncementSoundIcon />

      <div className="min-w-0 flex-1">
        <p className="font-sora text-base font-semibold text-[#092A31]">
          {announcement.title}
        </p>
        <p className="mt-0.5 font-sora text-base text-[#64748B]">
          {announcement.message}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-3 self-stretch">
        <AnnouncementLinkIcon />
        <span className="font-sora text-sm whitespace-nowrap text-[#64748B]">
          {formatAnnouncementDate(announcement.createdAt)}
        </span>
      </div>
    </>
  );

  const className =
    "flex items-center gap-4 rounded-2xl bg-[#F8FAFC] p-4 sm:gap-5 sm:px-5";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} transition-colors hover:bg-[#EEF3F6]`}
      >
        {content}
      </a>
    );
  }

  return <article className={className}>{content}</article>;
}

export default function AnnouncementView() {
  const { newer, older, isLoading, isError, errorMessage } =
    useGetAnnouncements();
  const { markAllAsRead } = useMarkAllAnnouncementsAsRead();
  const hasMarkedReadRef = useRef(false);
  const announcements = [...newer, ...older];

  useEffect(() => {
    if (isLoading || isError || hasMarkedReadRef.current) return;
    if (newer.length === 0) return;

    hasMarkedReadRef.current = true;
    void markAllAsRead().catch(() => {
      // Allow a retry if the request fails.
      hasMarkedReadRef.current = false;
    });
  }, [isLoading, isError, newer.length, markAllAsRead]);

  return (
    <div className="min-w-0 space-y-6 px-4 py-6 lg:px-6">
      {/* Back + heading, stage badges */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/internship-program"
            aria-label="Back to internship program"
            className="shrink-0 transition-opacity hover:opacity-80"
          >
            <BackArrowIcon />
          </Link>
          <h1 className="font-clash-display text-xl font-semibold text-[#092A31]">
            Announcement
          </h1>
        </div>

        <PageHeader />
      </div>

      {/* Feed */}
      {isLoading ? (
        <p className="font-sora text-sm text-[#7D8F98]">Loading announcements…</p>
      ) : isError ? (
        <p className="font-sora text-sm text-[#B91C1C]">
          {errorMessage || "Failed to load announcements."}
        </p>
      ) : announcements.length === 0 ? (
        <p className="font-sora text-sm text-[#7D8F98]">No announcements yet.</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <AnnouncementRow
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>
      )}
    </div>
  );
}

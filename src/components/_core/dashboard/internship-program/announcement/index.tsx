"use client";

import Link from "next/link";
import { useGetCurrentProject } from "@/features/interns-project/use-get-current-project";
import { AnnouncementLinkIcon, AnnouncementSoundIcon, BackArrowIcon } from "./icons";
import PageHeader from "@/components/_core/dashboard/dashboard/header";

type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  /** Rendered as a link only when the announcement points somewhere. */
  href?: string;
};

/**
 * Placeholder feed — there is no announcements endpoint yet. Swap this for the
 * API when one exists; the list below is the only thing that needs replacing.
 */
const ANNOUNCEMENTS: Announcement[] = Array.from({ length: 8 }, (_, index) => ({
  id: String(index + 1),
  title: "A new video has been uploaded",
  description: "How to speak with confident",
  date: "Jan 12, 2026",
}));



function AnnouncementRow({ announcement }: { announcement: Announcement }) {
  const content = (
    <>
      <AnnouncementSoundIcon />

      <div className="min-w-0 flex-1">
        <p className="font-sora text-base font-semibold text-[#092A31]">{announcement.title}</p>
        <p className="mt-0.5 font-sora text-base text-[#64748B]">{announcement.description}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-3 self-stretch">
        <AnnouncementLinkIcon />
        <span className="font-sora text-sm whitespace-nowrap text-[#64748B]">
          {announcement.date}
        </span>
      </div>
    </>
  );

  const className =
    "flex items-center gap-4 rounded-2xl bg-[#F8FAFC] p-4 sm:gap-5 sm:px-5";

  if (announcement.href) {
    return (
      <Link href={announcement.href} className={`${className} transition-colors hover:bg-[#EEF3F6]`}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}

export default function AnnouncementView() {
  
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
      {ANNOUNCEMENTS.length === 0 ? (
        <p className="font-sora text-sm text-[#7D8F98]">No announcements yet.</p>
      ) : (
        <div className="space-y-3">
          {ANNOUNCEMENTS.map((announcement) => (
            <AnnouncementRow key={announcement.id} announcement={announcement} />
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BarChart3, Briefcase, MapPin, User } from "lucide-react";
import type { JobOpening } from "./data";
import { getJobDescription } from "./job-description";

function MetaChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#F1F5F7] px-3 font-sora text-sm text-[#64748B]">
      {icon}
      {label}
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex list-disc flex-col gap-1.5 pl-5 marker:text-[#94A3B8]">
      {items.map((item) => (
        <li key={item} className="font-sora text-base leading-relaxed text-[#1F2937]">
          {item}
        </li>
      ))}
    </ul>
  );
}

const JobDetail = ({ job }: { job: JobOpening }) => {
  const description = getJobDescription(job.detailTitle);

  return (
    <div className="bg-white pb-16">
      <div className="app-width max-w-6xl pt-8 lg:pt-12">
        <Link
          href="/hr-job-listing#job-openings"
          className="inline-flex items-center gap-3 font-sora text-lg font-semibold text-[#092A31] transition-opacity hover:opacity-80"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-[#F1F5F7]">
            <ArrowLeft className="size-4" />
          </span>
          Back to positions
        </Link>

        <h1 className="mt-6 font-clash-display text-4xl font-semibold tracking-tight text-[#092A31] sm:text-5xl lg:text-[56px]">
          {job.detailTitle}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <MetaChip icon={<Briefcase className="size-4" />} label={job.title} />
          <MetaChip icon={<BarChart3 className="size-4" />} label={job.yearsExperience} />
          <MetaChip icon={<MapPin className="size-4" />} label={job.jobType} />
          <MetaChip icon={<User className="size-4" />} label={job.level} />
        </div>

        <Link
          href={`/hr-job-listing/${job.id}/apply`}
          className="mt-6 inline-flex h-13 items-center justify-center rounded-xl bg-[#156374] px-10 font-sora text-base font-semibold text-white transition-colors hover:bg-[#0f4d5a]"
        >
          Apply Now
        </Link>

        <h2 className="mt-10 font-clash-display text-3xl font-semibold text-[#092A31] sm:text-4xl">
          Job Description
        </h2>
        <p className="mt-2 font-clash-display text-xl font-semibold text-[#156374]">
          {job.detailTitle}
        </p>

        {description.intro.map((paragraph) => (
          <p
            key={paragraph.slice(0, 48)}
            className="mt-4 font-sora text-base leading-relaxed text-[#1F2937]"
          >
            {paragraph}
          </p>
        ))}

        {description.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h3 className="font-clash-display text-xl font-semibold text-[#092A31]">
              {section.heading}
            </h3>
            <BulletList items={section.bullets} />
          </section>
        ))}

        <div className="mt-14 rounded-2xl bg-[#A89350] px-6 py-16 text-center">
          <h2 className="font-clash-display text-4xl font-semibold text-white/90 sm:text-5xl">
            Ready to Apply?
          </h2>
          <p className="mt-3 font-sora text-lg text-white/80">
            Join our team and be part of something amazing
          </p>
          <Link
            href={`/hr-job-listing/${job.id}/apply`}
            className="mt-7 inline-flex h-13 items-center gap-3 rounded-full bg-[#156374] py-1.5 pr-1.5 pl-7 font-sora text-base font-medium text-white transition-colors hover:bg-[#0f4d5a]"
          >
            Submit Application
            <span className="flex size-8 items-center justify-center rounded-full bg-[#FFE082] text-[#156374]">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

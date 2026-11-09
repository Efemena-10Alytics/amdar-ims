import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const FLAGS = [
  { src: "/uk-flag.png", alt: "United Kingdom" },
  { src: "/canada-flag.png", alt: "Canada" },
  { src: "/us-flag.png", alt: "United States" },
] as const;

const STATS = [
  {
    title: "100+ Projects Completed",
    description: "Explore a growing collection of projects.",
  },
  {
    title: "Real Business Challenges",
    description: "Work on projects inspired by real business needs.",
  },
] as const;

const HERO_PATTERN_SRC =
  "/images/svgs/become-partners/become-partnes-patterns.svg";

export default function ProjectShowcaseHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[#E8EFF1]"
        style={{
          backgroundImage: `url(${HERO_PATTERN_SRC})`,
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        aria-hidden
      />

      <div className="app-width relative z-10 grid items-center gap-12 py-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8 lg:py-20">
        <div>
          <h1 className="max-w-xl font-clash-display text-[2.15rem] leading-[1.05] font-semibold tracking-tight text-[#092A31] sm:text-5xl lg:text-[3.35rem]">
            Work on Projects That
            <br />
            Build Your Career
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#64748B] sm:text-base">
            At Amdari, you&apos;ll gain practical experience by contributing to
            projects that solve real business challenges. From live client
            engagements to simulated industry projects, every assignment is
            designed to help you build in-demand skills, strengthen your
            portfolio, and prepare for the workplace.
          </p>

          <div className="mt-8 grid max-w-xl grid-cols-1 gap-6 sm:grid-cols-2">
            {STATS.map((stat) => (
              <div key={stat.title}>
                <h2 className="text-base font-semibold text-[#092A31] sm:text-lg">
                  {stat.title}
                </h2>
                <p className="mt-1.5 max-w-56 text-sm leading-relaxed text-[#64748B]">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/internship"
              className="group inline-flex h-13 items-center gap-4 rounded-full bg-[#156374] py-1.5 pr-1.5 pl-5 text-sm font-medium text-white transition-colors hover:bg-[#0f4d5a] sm:h-14 sm:text-base"
            >
              Apply for an Internship
              <span className="flex size-8 items-center justify-center rounded-full bg-[#FFE082] text-[#156374] sm:size-9">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
            <Link
              href="#featured-projects"
              className="inline-flex h-13 items-center rounded-full border border-[#156374]/30 px-6 text-sm font-medium text-[#156374] transition-colors hover:bg-[#156374]/5 sm:h-14 sm:text-base"
            >
              Explore Projects
            </Link>
          </div>

          <div className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#E7EEF0] py-1.5 pr-4 pl-2">
            <div className="flex items-center">
              {FLAGS.map((flag, index) => (
                <Image
                  key={flag.alt}
                  src={flag.src}
                  alt={flag.alt}
                  width={28}
                  height={28}
                  className={`size-7 rounded-full border-2 border-[#E7EEF0] object-cover ${index > 0 ? "-ml-2" : ""}`}
                />
              ))}
            </div>
            <p className="text-sm text-[#94A3B8]">
              <span className="font-medium text-[#64748B]">+ 30K interns</span>{" "}
              Across the world Got hired
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-185">
          <img
            src="/images/svgs/project-showcase-hero.svg"
            alt="Sample Amdari projects in data analysis and ethical hacking"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}

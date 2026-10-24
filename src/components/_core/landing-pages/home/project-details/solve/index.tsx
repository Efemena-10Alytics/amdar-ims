import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "../data";

const Solve = ({ project }: { project: Project }) => {
  const solve = project.details?.solve;
  if (!solve) return null;

  const { title, body, primaryLabel, primaryHref, secondaryLabel, secondaryHref } =
    solve;

  return (
    <section className="bg-[#062E36] py-6 sm:py-8">
      <div className="app-width">
        <div className="flex flex-col gap-8 rounded-[28px] bg-[#156374] px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-12 lg:py-12">
          <div className="max-w-xl text-white">
            <h2 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
              {body}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-between gap-4 rounded-full bg-[#F6D56A] py-1.5 pr-1.5 pl-5 text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F3CC55]"
            >
              {primaryLabel}
              <span className="flex size-8 items-center justify-center rounded-full bg-[#E8C44A]">
                <ArrowRight className="size-4" />
              </span>
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-between gap-4 rounded-full border border-white/80 py-1.5 pr-1.5 pl-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {secondaryLabel}
              <span className="flex size-8 items-center justify-center rounded-full border border-white/80">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solve;

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Crosshair } from "lucide-react";
import { TrophyIcon } from "../../svgs";

const STEPS = ["Understand", "Analyse", "Optimise", "Execute", "Measure"];

const JoinTheTeam = () => {
  return (
    <section className="bg-white pb-14 sm:pb-20">
      <div className="">
        <div className="relative overflow-hidden">
          <Image
            src="/images/pngs/new-home/join-the-team.png"
            alt=""
            width={1440}
            height={337}
            className="h-56 w-full object-cover sm:h-72 lg:h-auto"
          />
          <div className="absolute app-width inset-0 flex items-center px-3 sm:px-6 lg:px-10">
            <div className="flex w-full flex-col items-start justify-between gap-4 rounded-[22px] bg-[#6E6A64]/55 px-5 py-5 backdrop-blur-[2px] sm:flex-row sm:items-center sm:px-8 sm:py-6">
              <p className="text-lg leading-snug font-semibold text-white sm:text-2xl">
                Want to work on project like this?
                <br />
                Click to join the team
              </p>
              <Link
                href="/auth/sign-up"
                className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#F6D56A] py-1.5 pr-1.5 pl-5 text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F3CC55]"
              >
                Join the team
                <span className="flex size-8 items-center justify-center rounded-full bg-[#156374] text-white">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="app-width py-14 sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-[#12343C] sm:text-3xl">
          Turning Business Insight into Measurable Value
        </h2>
        <ul className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 sm:gap-x-10">
          {STEPS.map((step) => (
            <li
              key={step}
              className="inline-flex items-center gap-2.5 text-sm font-medium text-[#12343C] sm:text-2xl"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#E7F3F5] text-[#156374]">
                <TrophyIcon />
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default JoinTheTeam;

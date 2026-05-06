"use client";

import Image from "next/image";

const MISSION_COPY =
  "We have been where you are navigating to career uncertainties, job rejections, and skill gaps. We understand how difficult it can be to land your first role intake without the right experience or guidance. That's why Amdari exist: to provide the stepping stones between learning and achieving, helping you build the confidence and expertise to stand out";

const Mission = () => {
  return (
    <section className="bg-[#062C36] pt-14 lg:pt-20">
      <div className="app-width">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          <h2 className="max-w-105 text-4xl leading-tight font-semibold text-[#EAF2F4] md:text-5xl">
            Why Did We <br /> Start Amdari?
          </h2>

          <p className="max-w-160 text-base leading-relaxed text-[#C4D6DA] lg:pt-1">
            {MISSION_COPY}
          </p>
        </div>

        <div className="mt-10 bg-[#F0DA83] p-5 md:p-7">
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src="/images/pngs/about/about-img-video.png"
              alt="Team collaborating around a laptop"
              fill
              className="object-cover"
            />

            <button
              type="button"
              aria-label="Play mission video"
              className="absolute top-1/2 left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition hover:bg-white/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A778E]">
                <span className="ml-0.5 h-0 w-0 border-t-[7px] border-b-[7px] border-l-11 border-t-transparent border-b-transparent border-l-white" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;

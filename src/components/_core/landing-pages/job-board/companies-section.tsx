"use client";

import Image from "next/image";
import { Reveal } from "../shared/reveal";

/* ------------------------------------------------------------------ */
/* Arrow icon (reused button style from hero CTA)                      */
/* ------------------------------------------------------------------ */

const ArrowIcon = () => (
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="12" fill="#FFE082"/>
<path d="M16.5003 8V14.5C16.5003 14.6326 16.4476 14.7598 16.3538 14.8536C16.2601 14.9473 16.1329 15 16.0003 15C15.8677 15 15.7405 14.9473 15.6467 14.8536C15.553 14.7598 15.5003 14.6326 15.5003 14.5V9.20687L8.35403 16.3538C8.26021 16.4476 8.13296 16.5003 8.00028 16.5003C7.8676 16.5003 7.74035 16.4476 7.64653 16.3538C7.55271 16.2599 7.5 16.1327 7.5 16C7.5 15.8673 7.55271 15.7401 7.64653 15.6462L14.7934 8.5H9.50028C9.36767 8.5 9.24049 8.44732 9.14672 8.35355C9.05296 8.25979 9.00028 8.13261 9.00028 8C9.00028 7.86739 9.05296 7.74021 9.14672 7.64645C9.24049 7.55268 9.36767 7.5 9.50028 7.5H16.0003C16.1329 7.5 16.2601 7.55268 16.3538 7.64645C16.4476 7.74021 16.5003 7.86739 16.5003 8Z" fill="#156374"/>
</svg>

);

/* ------------------------------------------------------------------ */
/* CONFIG — edit these numbers to change how fast each column scrolls. */
/* Value = seconds for one full loop. Lower number = faster scroll.    */
/* ------------------------------------------------------------------ */

const COLUMN_SCROLL_SECONDS = {
  column1: 34,
  column2: 50,
  column3: 24,
} as const;

// Visible height of each scrolling column, in pixels.
const COLUMN_VIEWPORT_HEIGHT = 616;

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const ALL_LOGOS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  src: `/jobboard-companies-icon-${i + 1}.png`,
  alt: `Partner company logo ${i + 1}`,
}));

const COLUMNS = [
  { logos: ALL_LOGOS.slice(0, 5), seconds: COLUMN_SCROLL_SECONDS.column1 },
  { logos: ALL_LOGOS.slice(5, 10), seconds: COLUMN_SCROLL_SECONDS.column2 },
  { logos: ALL_LOGOS.slice(10, 15), seconds: COLUMN_SCROLL_SECONDS.column3 },
];

/* ------------------------------------------------------------------ */
/* Scrolling column                                                    */
/* ------------------------------------------------------------------ */

const ScrollingColumn = ({
  logos,
  seconds,
}: {
  logos: { id: number; src: string; alt: string }[];
  seconds: number;
}) => {
  // Duplicate the list so the loop can reset invisibly at the halfway point.
  const looped = [...logos, ...logos];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: COLUMN_VIEWPORT_HEIGHT,
        maskImage:
          "linear-gradient(to bottom, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)",
      }}
    >
      <div
        className="job-board-scroll-track flex flex-col gap-6"
        style={{ animationDuration: `${seconds}s` }}
      >
        {looped.map((logo, idx) => (
          <div
            key={`${logo.id}-${idx}`}
            className="flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-xl bg-white"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={120}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .job-board-scroll-track {
          animation-name: job-board-scroll-loop;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes job-board-scroll-loop {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .job-board-scroll-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

const CompaniesSection = () => {
  return (
    <section className="bg-[#E8EFF1]">
      <div className="mx-auto app-width grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left: copy */}
        <Reveal as="div">
          <h2 className="font-clash-display text-[32px] font-semibold text-[#092A31] lg:text-[48px]">
            Companies who have hired our interns
          </h2>
          <p className="mt-4 font-sora text-base font-normal text-[#64748B]">
            Our interns have gone on to work with leading companies across tech, finance, care, and
            beyond, proof that the right experience opens the right doors.
          </p>
          <button
            type="button"
            className="mt-8 flex items-center gap-2 rounded-full bg-[#156374] px-6 py-4 font-sora text-lg font-normal text-white transition-opacity hover:opacity-90"
          >
            Be a business partners
            <ArrowIcon />
          </button>
        </Reveal>

        {/* Right: scrolling logo columns */}
        <Reveal as="div" delay={150} y={40} className="grid grid-cols-3 gap-4">
          {COLUMNS.map((col, idx) => (
            <ScrollingColumn key={idx} logos={col.logos} seconds={col.seconds} />
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default CompaniesSection;
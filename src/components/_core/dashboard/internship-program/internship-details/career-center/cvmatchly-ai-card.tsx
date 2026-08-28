import Image from "next/image";
import { Layers2, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const CVMATCHLY_AMDARI_URL = "https://www.cvmatchly.ai/amdari";

const CVMATCHLY_FLAGS = [
  { src: "/images/svgs/country/UK.svg", alt: "United Kingdom" },
  { src: "/images/svgs/country/USA.svg", alt: "United States" },
];

const CvMatchlyAiCard = () => {
  return (
    <section className="rounded-2xl border border-[#F0E6DC] bg-[#FFFBF7] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-[#1E3A8A]"
            aria-hidden
          >
            <Layers2 className="size-5" strokeWidth={2.25} />
          </span>
          <h3 className="text-lg font-semibold text-[#0B2B33]">
            Use CVMatchly AI
          </h3>
        </div>
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FFF0E6] text-[#EA580C]"
          aria-hidden
        >
          <Target className="size-5" strokeWidth={2.25} />
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-[#FFE8D6] p-4">
        <p className="text-sm font-semibold leading-snug text-[#0B2B33]">
          Personalize your resume for any job description
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#475467]">
          Beat ATS systems and increase your interview rate by up to 90%.
        </p>
      </div>

      <div className="mt-4 flex items-center">
        {CVMATCHLY_FLAGS.map((flag, index) => (
          <span
            key={flag.alt}
            className={cn(
              "relative flex size-8 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm",
              index > 0 && "-ml-2",
            )}
          >
            <Image
              src={flag.src}
              alt={flag.alt}
              width={32}
              height={32}
              className="size-full object-cover"
            />
          </span>
        ))}
      </div>

      <a
        href={CVMATCHLY_AMDARI_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-1 rounded-full border border-[#156374] bg-[#003463] p-4 text-sm font-semibold text-white transition hover:bg-[#002a52]"
      >
        Try it now
      </a>
    </section>
  );
};

export default CvMatchlyAiCard;

import Image from "next/image";
import type { Project } from "../data";

const BusinessImpact = ({ project }: { project: Project }) => {
  const impact = project.details?.impact;
  if (!impact) return null;

  const { eyebrow, title, body, value, label, statement, statementDetail, image } =
    impact;
  const titleLines = title.split("\n");

  return (
    <section className="pb-14 sm:pb-20">
      <div className="relative overflow-hidden bg-[#0C3E48]">
        <Image
          src={image}
          alt=""
          fill
          className="scale-110 object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0C3E48]/55" />
        <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-12 lg:py-14">
          <div className="max-w-md text-white">
            {eyebrow ? (
              <p className="text-[11px] font-semibold tracking-[0.18em] text-white/70 uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
              {body}
            </p>
          </div>
          <div className="border border-amdari-yellow px-6 py-10 text-center sm:px-10 sm:py-12">
            {value ? (
              <>
                <p className="text-5xl font-bold tracking-tight text-[#F6D56A] sm:text-6xl">
                  {value}
                </p>
                {label ? (
                  <p className="mt-3 text-sm text-[#F6D56A]/85">{label}</p>
                ) : null}
              </>
            ) : (
              <>
                <p className="text-2xl font-bold tracking-wide text-[#F6D56A] uppercase sm:text-3xl">
                  {statement}
                </p>
                {statementDetail ? (
                  <p className="mt-3 text-sm text-[#F6D56A]/85">
                    {statementDetail}
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessImpact;

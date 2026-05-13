import type { Metadata } from "next";
import { cache } from "react";
import Left from "@/components/_core/landing-pages/internship-program/internship-details/left";
import Right from "@/components/_core/landing-pages/internship-program/internship-details/right";
import Project from "@/components/_core/landing-pages/internship-program/project";
import CrossFunctional from "@/components/_core/landing-pages/internship-program/cross-functional";
import { getInternshipProgram } from "@/features/internship/use-get-internship-program";

type InternshipProgramDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const getProgramByIdCached = cache(async (id: string) => getInternshipProgram(id));

function getSeoDescription(raw?: string | null): string {
  const fallback =
    "Explore internship details, projects, tools, mentors, and outcomes to help you become job-ready.";
  const text = raw?.trim();
  if (!text) return fallback;
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

export async function generateMetadata({
  params,
}: InternshipProgramDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: "Internship Program",
      description: getSeoDescription(),
    };
  }

  try {
    const program = await getProgramByIdCached(id);
    const title = `${program.title} Internship Program`;
    const description = getSeoDescription(program.description);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return {
      title: "Internship Program",
      description: getSeoDescription(),
    };
  }
}

export default async function InternshipProgramDetails({
  params,
}: InternshipProgramDetailsPageProps) {
  const { id } = await params;
  if (!id) {
    return <ProgramUnavailable />;
  }

  const program = await getProgramByIdCached(id).catch(() => null);

  if (!program) {
    return <ProgramUnavailable />;
  }

  return (
    <div className="bg-white mt-10">
      <h1 className="sr-only">{program.title}</h1>
      <p className="sr-only">{getSeoDescription(program.description ?? program.overview)}</p>
      <div className="app-width">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 lg:gap-12">
          <div className="lg:col-span-5">
            <Left program={program} />
          </div>
          <div className="lg:col-span-3">
            <Right program={program} />
          </div>
        </div>
      </div>
      <Project program={program} />
      <CrossFunctional program={program} />
    </div>
  );
}

function ProgramUnavailable() {
  return (
    <div className="bg-white py-24">
      <div className="app-width">
        <div className="mx-auto max-w-2xl rounded-2xl bg-[#E8EFF1] p-8 text-center">
          <h1 className="text-3xl font-bold text-[#092A31]">
            Internship details are being updated
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#64748B]">
            This internship link may have changed. Please return to the
            internship page to choose the latest available career path.
          </p>
        </div>
      </div>
    </div>
  );
}

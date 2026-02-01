"use client";

import { useParams } from "next/navigation";
import { useGetInternshipProgram } from "@/features/internship/use-get-internship-program";
import Left from "@/components/_core/landing-pages/internship-program/internship-details/left";
import Right from "@/components/_core/landing-pages/internship-program/internship-details/right";
import Project from "@/components/_core/landing-pages/internship-program/project";
import CrossFunctional from "@/components/_core/landing-pages/internship-program/cross-functional";

export default function InternshipProgramDetails() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data: program, isLoading, error } = useGetInternshipProgram(id);

  if (isLoading) {
    return (
      <div className="bg-white min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading program...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-[50vh] flex items-center justify-center">
        <p className="text-destructive">
          Failed to load program. Please try again.
        </p>
      </div>
    );
  }

  if (!program) {
    return null;
  }

  return (
    <div className="bg-white">
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Left program={program} />
          </div>
          <div className="lg:col-span-1">
            <Right program={program} />
          </div>
        </div>
      </div>
      <Project program={program} />
      <CrossFunctional program={program} />
    </div>
  );
}

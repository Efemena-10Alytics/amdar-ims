"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useGetInternshipPrograms } from "@/features/internship/use-get-all-internship-programs";
import { InternshipProgram } from "@/types/internship-program";

const ChoosePath = () => {
  const { data, isPending, isFetching } = useGetInternshipPrograms();
  const internshipPrograms = (Array.isArray(data) ? data : (data as { data?: InternshipProgram[] })?.data) ?? [];

  return (
    <div className="bg-white py-12 lg:py-20">
      <div className="app-width">
        {/* Header Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            {/* Title */}
            <div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#092A31] leading-tight">
                Choose & Explore A Career Path
              </h2>
            </div>

            {/* Subtitle */}
            <div>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                Each internship runs for 4 months, with 5 major projects
                designed from real business challenges.
              </p>
            </div>
          </div>
        </div>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4" role="status" aria-live="polite">
            <Loader2 className="size-12 animate-spin text-[#156374]" aria-hidden />
            <p className="text-[#64748B] text-sm font-medium">Loading career paths...</p>
          </div>
        ) : (
          <>
            {isFetching && (
              <div className="flex justify-center mb-4" role="status" aria-live="polite">
                <span className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Updating...
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internshipPrograms.map((career) => (
                <div
                  key={career.id}
                  className="group bg-[#E8EFF1] hover:bg-primary p-4 md:p-6 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full h-48 bg-gray-200 rounded-md">
                    <Image
                      src={career.image}
                      alt={career.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold group-hover:text-white text-[#092A31] mb-3">
                      {career.title}
                    </h3>
                    <p className="text-[#0C3640] group-hover:text-white text-sm mb-4 leading-relaxed line-clamp-3">
                      {career.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-semibold group-hover:text-white text-[#092A31]">
                          <div className="text-[#64748B] group-hover:text-white line-through text-sm font-normal">
                            GBP 500
                          </div>
                          <div>GBP 390</div>
                        </span>
                      </div>
                      <Link href={`/internship-program/${career.id}`}>
                        <Button
                          className={cn(
                            "bg-primary group-hover:bg-amdari-yellow group-hover:text-primary hover:text-primary hover:bg-amdari-yellow text-white rounded-full px-4 py-2 text-sm font-medium",
                          )}
                        >
                          Apply here
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChoosePath;

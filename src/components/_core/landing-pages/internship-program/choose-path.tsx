"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetInternshipPrograms } from "@/features/internship/use-get-all-internship-programs";
import { useAuthStore } from "@/store/auth-store";
import { InternshipProgram } from "@/types/internship-program";

const ChoosePath = () => {
  const { user } = useAuthStore();
  const internshipProgramsQuery = useGetInternshipPrograms();

  useEffect(() => {
    console.log("useGetInternshipPrograms:", internshipProgramsQuery);
  }, [internshipProgramsQuery]);

  const { data: internshipPrograms } = internshipProgramsQuery as unknown as {
    data: InternshipProgram[];
  };

  return (
    <div className="bg-white py-12 lg:py-20">
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Title */}
            <div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#092A31] leading-tight">
                Choose & Explore A Career Path
              </h2>
            </div>

            {/* Subtitle */}
            <div>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                Each internship runs for 6 months, with 2 major projects
                designed from real business challenges & a portfolio worth
                $2000.
              </p>
            </div>
          </div>
        </div>

        {/* Career Path Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internshipPrograms?.map((career) => (
            <div
              key={career.id}
              className="group bg-[#E8EFF1] hover:bg-primary p-4 md:p-6 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-200">
                <Image
                  src={career.image}
                  alt={career.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
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
                        USD 500
                      </div>
                      <div>USD 390</div>
                    </span>
                  </div>
                  <Link
                    href={
                      user
                        ? `/internship-program/${career.id}`
                        : `/auth/sign-in?program=${career.id}`
                    }
                  >
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
      </div>
    </div>
  );
};

export default ChoosePath;

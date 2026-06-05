"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { InternshipProgram } from "@/types/internship-program";
import {
  INTERNSHIP_ORIGINAL_PRICE_LABEL,
  INTERNSHIP_DISCOUNTED_PRICE_LABEL,
} from "@/constants/internship-pricing";

const FALLBACK_IMAGE = "/images/pngs/internship.png";

type ChoosePathProps = {
  internshipPrograms: InternshipProgram[];
};

const ChoosePath = ({ internshipPrograms }: ChoosePathProps) => {
  const searchParams = useSearchParams();
  const uniqueSuffix = searchParams.get("unique") === "1" ? "?unique=1" : "";

  return (
    <div className="bg-white py-12">
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

        {internshipPrograms.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-[#E8EFF1] p-6 text-center text-sm text-[#475467]">
            No internship paths are available right now. Please check back shortly.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internshipPrograms.map((career) => (
              <div
                key={career.id}
                className="group bg-[#E8EFF1] hover:bg-primary p-4 md:p-6 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-48 bg-gray-200 rounded-md">
                  <Image
                    src={getImageUrl(career.image) || FALLBACK_IMAGE}
                    alt={career.title}
                    fill
                    className="object-cover rounded-md"
                    unoptimized={
                      !!(career.image && !career.image.startsWith("/"))
                    }
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
                          {INTERNSHIP_ORIGINAL_PRICE_LABEL}
                        </div>
                        <div>{INTERNSHIP_DISCOUNTED_PRICE_LABEL}</div>
                      </span>
                    </div>
                    <Link href={`/internship/${career.slug}${uniqueSuffix}`}>
                      <Button
                        className={cn(
                          "bg-primary cursor-pointer group-hover:bg-amdari-yellow group-hover:text-primary hover:text-primary hover:bg-amdari-yellow text-white rounded-full px-4 py-2 text-sm font-medium",
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
        )}
      </div>
    </div>
  );
};

export default ChoosePath;

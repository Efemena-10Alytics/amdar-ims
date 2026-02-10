"use client";

import { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import CustomButton from "../../shared/custom-button";
import Link from "next/link";
import { useGetInternshipPrograms } from "@/features/internship/use-get-all-internship-programs";
import { getImageUrl, pickRandomTwo } from "@/lib/utils";
import type { InternshipProgram } from "@/types/internship-program";

const FALLBACK_ITEMS = [
  {
    title: "Data Analytics",
    desc: "Turn complex data into insights that drive decisions. Build dashboards, reports, analytical models, and documentation teams actually use.",
    image: "/images/pngs/internship.png",
  },
  {
    title: "Cybersecurity",
    desc: "Protect systems, analyze threats, investigate incidents, run assessments, and apply industry frameworks used by modern security teams.",
    image: "/images/pngs/internship.png",
  },
];

const Internship = () => {
  const { data: programs } = useGetInternshipPrograms() as unknown as {
    data: InternshipProgram[] | undefined;
  };
  const careerItems = useMemo(() => {
    if (!programs?.length)
      return FALLBACK_ITEMS.map((item, i) => ({
        id: i,
        title: item.title,
        desc: item.desc,
        image: item.image,
      }));
    const picked = pickRandomTwo(programs);
    return picked.map((p) => ({
      id: p.id,
      title: p.title,
      desc: p.description,
      image: getImageUrl(p.image) || "/images/pngs/internship.png",
    }));
  }, [programs]);

  return (
    <div>
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 bg-[#E8EFF1] rounded-xl p-4 sm:p-6 lg:p-10">
        {/* Left Panel - Promotional CTA */}
        <div className="lg:w-[36%] flex flex-col">
          <div>
            <h2 className="text-[24px] max-w-sm lg:text-[28px] font-semibold text-[#092A31] mb-4 leading-tight">
              Gain global <br /> work experience <br /> in any of these careers
            </h2>
            <p className="text-[#64748B] text-sm mb-6">
              Some of our current Work Experience Programmes
            </p>
          </div>

          <Link href="/internship-program">
            <CustomButton btnText="View more" />
          </Link>
        </div>

        {/* Right Section - Career Cards */}
        <div className="flex-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerItems.map((item) => (
            <Link
              key={item.id}
              href={
                programs?.length
                  ? `/internship-program/${item.id}`
                  : "/internship-program"
              }
              className="group bg-white hover:bg-primary p-5 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow block"
            >
              {/* Card Image */}
              <div className="relative w-full h-48 bg-gray-200 rounded-md">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              {/* Card Content */}
              <div className="mt-4">
                <h3 className="text-xl font-bold text-[#092A31] group-hover:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-[#64748B] group-hover:text-white text-sm mb-4 leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
                <Link href={`/internship-program/${item.id}`}>
                  <span className="flex text-[#092A31] group-hover:text-white items-center gap-2 text-sm font-medium">
                    Explore course
                    <div className="flex h-6 w-6 rounded-full justify-center items-center bg-primary">
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </div>
                  </span>
                </Link>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Internship;

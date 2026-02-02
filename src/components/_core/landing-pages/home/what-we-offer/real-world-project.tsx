import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import CustomButton from "../../shared/custom-button";
import Link from "next/link";

const RealWorldProject = () => {
  const careerItems = [
    {
      title: "Product designer Project",
      desc: [
        "Dive video solutions for impactful data visualisation",
        "Analyze diverse datasets, uncovering key patterns.",
      ],
      image: "/images/pngs/internship.png",
    },
    {
      title: "Cybersecurity",
      desc: [
        "Dive video solutions for impactful data visualisation",
        "Analyze diverse datasets, uncovering key patterns.",
      ],
      image: "/images/pngs/internship.png",
    },
  ];
  return (
    <div>
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 bg-[#E8EFF1] rounded-xl p-4 sm:p-6 lg:p-10">
        {/* Left Panel - Promotional CTA */}
        <div className="lg:w-[36%] flex flex-col">
          <div>
            <h2 className="text-[24px] max-w-sm lg:text-[28px] font-semibold text-[#092A31] mb-4 leading-tight">
              The perfect real world <br /> project to have on <br /> your
              portfolio
            </h2>
            <p className="text-[#64748B] text-sm mb-6">
              Real world projects you can work on.
            </p>
          </div>
          <Link href="/internship-program">
            <CustomButton btnText="Work on projects" />
          </Link>
        </div>

        {/* Right Section - Career Cards */}
        <div className="flex-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerItems.map((item, index) => (
            <div
              key={index}
              className="group hover:bg-primary bg-white p-5 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Card Image */}
              <div className="relative w-full h-48 bg-gray-200 rounded-md">
                <Image
                  src={"/images/pngs/internship.png"}
                  alt={"internship"}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              {/* Card Content */}
              <div className="mt-4">
                <h3 className="text-xl font-bold text-[#092A31] group-hover:text-white mb-3">
                  {item.title}
                </h3>
                <ul className="text-gray-600 text-sm mb-4 leading-relaxed list-disc list-inside space-y-1">
                  {item.desc.map((x: string, i: number) => (
                    <li
                      className="text-[#64748B] group-hover:text-white text-sm mb-4 leading-relaxed line-clamp-2"
                      key={i}
                    >
                      {x}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className="flex text-[#092A31] group-hover:text-white items-center gap-2 hover:text-primary transition-colors text-sm font-medium"
                >
                  View Project
                  <div className="flex h-6 w-6 rounded-full justify-center items-center bg-primary">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealWorldProject;

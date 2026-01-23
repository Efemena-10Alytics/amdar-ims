import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

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
      <div className="flex gap-6 bg-[#E8EFF1] rounded-xl p-6 lg:p-10">
        {/* Left Panel - Promotional CTA */}
        <div className="w-[36%] flex flex-col">
          <div>
            <h2 className="text-[24px] lg:text-[28px] font-bold text-[#092A31] mb-4 leading-tight">
              The perfect real world project to have on your portfolio
            </h2>
            <p className="text-[#64748B] text-sm mb-6">
              Real world projects you can work on.
            </p>
          </div>
          <Button
            className={cn(
              "bg-primary text-white hover:bg-[#0f4d5a] rounded-full px-5 py-5",
              "inline-flex items-center gap-2 w-fit justify-center",
            )}
          >
            Work on projects
            <div className="flex h-5 w-5 rounded-full justify-center items-center bg-amdari-yellow">
              <ArrowUpRight className="w-3 h-3" color="#156374" />
            </div>
          </Button>
        </div>

        {/* Right Section - Career Cards */}
        <div className="flex-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerItems.map((item, index) => (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
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
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <ul className="text-gray-600 text-sm mb-4 leading-relaxed list-disc list-inside space-y-1">
                  {item.desc.map((x: string, i: number) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
                <a
                  href="#"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm font-medium"
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

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const Internship = () => {
  const careerItems = [
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
  return (
    <div>
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 bg-[#E8EFF1] rounded-xl p-4 sm:p-6 lg:p-10">
        {/* Left Panel - Promotional CTA */}
        <div className="lg:w-[36%] flex flex-col">
          <div>
            <h2 className="text-[24px] max-w-sm lg:text-[28px] font-bold text-[#092A31] mb-4 leading-tight">
              Gain global work experience in any of these careers
            </h2>
            <p className="text-[#64748B] text-sm mb-6">
              Some of our current Work Experience Programmes
            </p>
          </div>
          <Button
            className={cn(
              "bg-primary text-white hover:bg-[#0f4d5a] rounded-full px-8 py-6 text-base",
              "inline-flex items-center gap-2 w-fit justify-center",
            )}
          >
            View more
            <div className="flex h-5 w-5 rounded-full justify-center items-center bg-amdari-yellow">
              <ArrowUpRight className="w-3 h-3" color="#156374" />
            </div>
          </Button>
        </div>

        {/* Right Section - Career Cards */}
        <div className="flex-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerItems.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
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
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {item.desc}
                </p>
                <a
                  href="#"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                >
                  Explore course
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

export default Internship;

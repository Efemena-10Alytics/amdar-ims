import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import CustomButton from "../../shared/custom-button";

const TalentLoop = () => {
  return (
    <div>
      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-6 bg-[#E8EFF1] rounded-xl p-6 lg:p-10">
        {/* Left Panel - Promotional CTA */}
        <div className="md:w-[36%] flex flex-col">
          <div>
            <h2 className="text-[24px] lg:text-[28px] font-semibold text-[#092A31] mb-4 leading-tight">
              Tired of Job Hunting? <br /> Let Us Do It for You!
            </h2>
            <p className="text-[#64748B] text-sm mb-6">
              We help you land interviews and offers by managing your job
              applications, optimizing your CV & LinkedIn, and positioning you
              for success.
            </p>
          </div>
          <CustomButton btnText="Get started" />
        </div>

        {/* Right Section - Career Cards */}
        <div className="flex-1 gap-6">
          <Image
            src={"/images/pngs/talent-loop.png"}
            alt={"internship"}
            width={800}
            height={420}
            className="object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default TalentLoop;

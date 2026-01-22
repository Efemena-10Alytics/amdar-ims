import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ServiceCard from "./service-card";
import { ArrowUpRight, PlayIcon } from "lucide-react";
import Slider from "./slider";
import Image from "next/image";

const InternshipHero = () => {
  return (
    <div className="text-white relative overflow-hidden">
      {/* Primary Color Background */}
      <div className="absolute inset-0 bg-primary z-0" />
      {/* Ellipse Overlay */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: 'url(/images/svgs/ellipse.svg)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      
      {/* Hero Section */}
      <div className="relative z-10 max-w-325 mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 lg:py-24">
        <div className="text-center max-w-202.5 mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-bold mb-6 leading-12 md:leading-16">
            Gain Work Experience Through <br />
            {/* Carousel */}
            <span className="inline-block overflow-hidden h-[1.2em] relative align-middle">
              <Slider />
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-10">
            Join the Work Experience Platform Trusted by Aspiring Tech
            Professionals Worldwide to Build Real-World Experience and Land Your
            Dream Job
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              className={cn(
                "bg-[#156374] text-white hover:bg-[#0f4d5a] rounded-full px-8 py-6 text-base",
                "border-2 border-white/20 flex items-center gap-2",
              )}
            >
              Get started
              <div className="flex h-5 w-5 rounded-full justify-center items-center bg-amdari-yellow text-primary">
                <ArrowUpRight className="w-3! h-3!" color="#156374" />
              </div>
            </Button>
            <Button
              className={cn(
                "bg-white/10 text-white hover:bg-white/20 rounded-full px-8 py-6 text-base",
                "border-2 border-white/20 flex items-center gap-2",
              )}
            >
              Learn more
              <div className="flex h-5 w-5 rounded-full justify-center items-center bg-white border-2 border-gray-300 text-primary">
                <PlayIcon
                  className="w-3! h-3!"
                  color="#156374"
                  fill="#156374"
                />
              </div>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <Image src={"/images/svgs/flags.svg"} height={32} width={80} alt="USA/UK/Canada" />
            <span className="text-white/80">
              + 10K interns Across the world Got hired
            </span>
          </div>
        </div>
      </div>

      {/* Service Cards Section */}
      <div className="relative z-10 max-w-325 mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            title="Real-world Projects"
            description="Industry-relevant projects that replicate real-world challenges, helping you build practical skills."
            buttonText="Get me started"
          />
          <ServiceCard
            title="Work Experience Internship"
            description="Work experience internship with businesses that will connect you with global work opportunities and mentorship"
            buttonText="Apply now"
          />
          <ServiceCard
            title="Interview Prep"
            description="We help you prepare for interviews by revamping your CV and coaching you on acing technical questions."
            buttonText="I need this"
          />
        </div>
      </div>
    </div>
  );
};

export default InternshipHero;

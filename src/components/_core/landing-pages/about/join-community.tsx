"use client";

import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import Aos from "aos";

const communityMembers = [
  { name: "A", color: "bg-[#B90F36]" },
  { name: "D", color: "bg-[#0B7A84]" },
  { name: "M", color: "bg-[#D2A45B]" },
];

const JoinCommunity = () => {
  useEffect(() => {
    Aos.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 40,
    });
  }, []);

  return (
    <section className="overflow-x-hidden bg-[#0B4A56] py-12 lg:py-16">
      <div className="app-width grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div data-aos="fade-right">
          <h2 className="max-w-100 text-5xl leading-tight font-semibold text-[#EAF2F4]">
            Join the Amdari Community
          </h2>

          <div className="mt-6 flex items-center">
            {communityMembers.map((member, index) => (
              <span
                key={`${member.name}-${index}`}
                data-aos="zoom-in"
                data-aos-delay={120 + index * 70}
                className={`inline-flex size-10 items-center justify-center rounded-full border-2 border-[#0B4A56] text-sm font-semibold text-white ${member.color} ${
                  index > 0 ? "-ml-2.5" : ""
                }`}
              >
                {member.name}
              </span>
            ))}
          </div>
        </div>

        <div data-aos="fade-left" data-aos-delay="120">
          <p className="max-w-160 text-2xl leading-relaxed font-medium text-[#D6E4E8]">
            We&apos;re more than a platform; we&apos;re a thriving community of learners,
            professionals, and mentors committed to empowering each other. Together,
            we&apos;re shaping the future of tech opportunities, one experience at a time.
          </p>

          <button
            type="button"
            data-aos="fade-up"
            data-aos-delay="220"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F3DD83] px-6 py-3 text-lg font-semibold text-[#17434E] transition hover:bg-[#EED46C]"
          >
            Click here to join
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#0B7A84] text-white">
              <ArrowUpRight className="size-3.5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default JoinCommunity;

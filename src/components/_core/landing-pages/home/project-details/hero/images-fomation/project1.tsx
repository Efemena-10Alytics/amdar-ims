"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Eye, Server } from "lucide-react";
import Aos from "aos";

const Project1 = () => {
  useEffect(() => {
    Aos.init({ duration: 800, once: true });
    Aos.refresh();
  }, []);

  return (
    <div className="relative aspect-[560/440] w-full">
      <div className="absolute inset-0 overflow-hidden rounded-[28px]">
        <Image
          src="/images/pngs/new-home/project-1.png"
          alt=""
          fill
          priority
          className="object-cover object-left"
          sizes="(min-width: 1024px) 46vw, 100vw"
        />
      </div>

      <div
        data-aos="fade-left"
        className="absolute top-[7%] right-[4%] bottom-[9%] flex w-[47%] flex-col rounded-[28px] bg-[#F4F6F8] px-3 pt-3.5 pb-3 shadow-[0_16px_40px_rgba(16,24,40,0.08)]"
      >
        <div className="mx-auto h-2.5 w-[42%] shrink-0 rounded-full bg-[#E4E8EC]" />
        <div className="mt-3 min-h-0 flex-1 rounded-[18px] bg-white" />
      </div>

      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="absolute top-[8%] left-[5%] flex min-h-32 w-[54%] flex-col justify-center rounded-2xl border border-white/50 bg-white/35 px-4 pt-2 pb-8 shadow-[0_10px_28px_rgba(16,24,40,0.08)] backdrop-blur-xl"
      >
        <p className="text-sm font-semibold text-[#156374]">
          Operational Complexity
        </p>
        <p className="mt-1.5 text-xs text-[#8B949E]">
          Multiple competing priorities
        </p>
      </div>

      <div
        data-aos="fade-down"
        data-aos-delay="280"
        className="absolute top-[40%] left-[4%] w-[50%] rounded-2xl bg-[#4A4584]/90 px-4 py-3 text-white shadow-[0_10px_28px_rgba(16,24,40,0.12)] backdrop-blur-md"
      >
        <p className="text-sm font-semibold">AI Integration</p>
        <p className="mt-0.5 text-xs text-white/75">
          Data-driven decision-making
        </p>
      </div>

      <div
        data-aos="fade-left"
        data-aos-delay="400"
        className="absolute top-[30%] right-[1%] inline-flex items-center gap-2 rounded py-1.5 pr-4 pl-1.5"
        style={{
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "linear-gradient(144.29deg, rgba(250, 252, 255, 0) -1.24%, rgba(0, 84, 173, 0.0512) 95.01%), linear-gradient(#15637417, #15637417)",
          backgroundBlendMode: "luminosity",
          borderTop: "1.25px solid #495F6E33",
          boxShadow:
            "0.83px 4.17px 9.17px 0px #00000014, 1.67px 16.67px 17.5px 0px #0000000F, 4.17px 38.33px 23.33px 0px #0000000A, 8.33px 68.33px 27.5px 0px #00000003, 12.5px 106.67px 30px 0px #00000000",
        }}
      >
        <span className="flex size-7 items-center justify-center rounded-full border border-[#E4E8EE] text-[#4B5563]">
          <Eye className="size-3.5" />
        </span>
        <span className="text-sm font-medium text-[#1F2937]">Reports</span>
      </div>

      <div
        data-aos="fade-up"
        data-aos-delay="520"
        className="absolute bottom-[24%] left-[30%] inline-flex items-center gap-2 rounded px-3 py-2"
        style={{
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "linear-gradient(144.29deg, rgba(250, 252, 255, 0) -1.24%, rgba(0, 84, 173, 0.0512) 95.01%), linear-gradient(#15637417, #15637417)",
          backgroundBlendMode: "luminosity",
          borderTop: "1.25px solid #495F6E33",
          boxShadow:
            "0.83px 4.17px 9.17px 0px #00000014, 1.67px 16.67px 17.5px 0px #0000000F, 4.17px 38.33px 23.33px 0px #0000000A, 8.33px 68.33px 27.5px 0px #00000003, 12.5px 106.67px 30px 0px #00000000",
        }}
      >
        <Server className="size-4 text-[#374151]" />
        <span className="text-sm font-medium text-[#1F2937]">Dashboard</span>
      </div>
    </div>
  );
};

export default Project1;

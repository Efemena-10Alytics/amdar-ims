"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { RocketIcon } from "@/components/_core/dashboard/internship-program/svg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const PROJECTS = [
  {
    title:
      "How AMDARI Consultants Delivered Over $4.5 Billion in Bottom-Line Impact",
    description:
      "AMDARI Consultants partnered with a leading technology firm to reimagine productivity at scale, by leveraging AI and data-driven decision-making, the engagement focused on streamlining operations",
    image: "/images/pngs/new-home/the-impact/project-1.jpg",
  },
  {
    title:
      "How AMDARI Consultants Unlocked a New Revenue Stream Through Carbon Footprint Accounting",
    description:
      "AMDARI Consultants explored how lower-emission production could become a scalable revenue opportunity. Through technology, data, and sustainability-driven insights, the collaboration",
    image: "/images/pngs/new-home/the-impact/project-2.jpg",
  },
  {
    title:
      "How AMDARI Consultants Helped a Regional Health System Reduce Avoidable Discharges by 32%",
    description:
      "A regional health system faced mounting pressure on beds and clinical capacity. AMDARI Consultants worked alongside its operations, clinical and IT leaders to unify patient-flow data, predict discharge readiness",
    image: "/images/pngs/new-home/the-impact/project-3.jpg",
  },
  {
    title:
      "How AMDARI Consultants Helped a Global Financial Services Firm Respond to Cyber Threats 55% Faster",
    description:
      "A global financial services firm was overwhelmed by security alerts from dozens of disconnected tools. AMDARI Consultants teamed with its security and technology leaders to consolidate telemetry",
    image: "/images/pngs/new-home/the-impact/project-1.jpg",
  },
];

const STEPS = [
  {
    title: "Brief Submission",
    description: "A client contributes a real challenge",
  },
  {
    title: "Consultant Match",
    description: "Amdari shapes the brief and assigns",
  },
  {
    title: "Engagement Delivery",
    description: "Supervised delivery - stand ups, review, sign off",
  },
  {
    title: "Portfolio Built",
    description: "The deliverable is credited and portfolio-ready",
  },
  {
    title: "Job landed.",
    description: "CV, LinkedIn, and interview support to close the loop",
  },
];

const TheImpact = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [progress, setProgress] = useState(0.35);
  const autoplay = useRef(
    Autoplay({
      delay: 3200,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  useEffect(() => {
    if (!api) return;

    const update = () => {
      const snaps = api.scrollSnapList().length;
      if (snaps <= 1) {
        setProgress(1);
        return;
      }
      setProgress((api.selectedScrollSnap() + 1) / snaps);
    };

    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <section className="py-14 lg:py-20">
      <div className="app-width">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F8E7A8] py-1.5 pr-4 pl-1.5 text-sm font-semibold text-[#3D3A1F]">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#F6D56A] text-[#3D3A1F]">
            <RocketIcon className="size-3.5" />
          </span>
          Client Impact
        </span>
        <h2 className="mt-4 max-w-xl text-2xl font-semibold text-[#092A31] sm:text-3xl lg:text-4xl">
          Real problem
          <br />
          Real client{" "}
          <span className="inline-block rounded-md bg-[#F6D56A] px-2 align-middle text-primary">
            Real delivery
          </span>
        </h2>

        <div className="mt-8 rounded-[28px] bg-[#F3F5F6] p-4 sm:p-6 lg:p-8">
          <p className="text-[11px] font-medium tracking-[0.14em] text-[#7B8A90] uppercase">
            Some projects our consultants have worked on
          </p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#D5DEE1]">
            <div
              className="h-full rounded-full bg-[#2F9B73] transition-[width] duration-500"
              style={{ width: `${Math.max(progress, 0.18) * 100}%` }}
            />
          </div>

          <Carousel
            setApi={setApi}
            plugins={[autoplay.current]}
            opts={{ align: "start", loop: true, duration: 35 }}
            className="mt-5"
          >
            <CarouselContent>
              {PROJECTS.map((project) => (
                <CarouselItem
                  key={project.title}
                  className="basis-[86%] sm:basis-[48%] lg:basis-[42%]"
                >
                  <article className="relative flex h-90 flex-col justify-end overflow-hidden rounded sm:h-97.5">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 40vw, 80vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10" />
                    <div className="relative p-5 text-white">
                      <h3 className="text-lg leading-snug font-semibold text-[#F6D56A]">
                        {project.title}
                      </h3>
                      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-white/90">
                        {project.description}
                      </p>
                      {/* <Link
                        href="/projects"
                        className="mt-3 inline-block text-sm underline underline-offset-4"
                      >
                        View project
                      </Link> */}
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="mt-4 grid items-stretch gap-10 rounded-[28px] bg-[#F7F1E4] p-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="relative min-h-115 overflow-hidden rounded-[28px]">
            <Image
              src="/images/pngs/new-home/the-impact/road.png"
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/10 to-black/55" />
            <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
              <div className="max-w-md text-white">
                <h3 className="text-3xl leading-tight font-semibold sm:text-4xl">
                  How an engagement moves from brief to hire
                </h3>
                <p className="mt-3 max-w-xs text-sm text-white/85 sm:text-base">
                  The same model from brief to hire to give the most desired
                  result
                </p>
              </div>

              <div className="mt-8 rounded-2xl bg-white/95 p-4 text-[#092A31] shadow-lg backdrop-blur-sm sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8AA0A6] uppercase">
                    Live engagement
                  </p>
                  <span className="rounded-full bg-[#EDE4FF] px-2.5 py-1 text-[11px] font-medium text-[#6D4CC4]">
                    Data Sc.
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold">
                  (MICROSOFT) Customer Churn analysis
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <p className="text-[#7B8A90]">Consultant team</p>
                  <p className="text-right font-medium">8 Consultants</p>
                  <p className="text-[#7B8A90]">Supervision</p>
                  <p className="text-right font-medium">Data Specialist</p>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E6EEF0]">
                  <div className="h-full w-[62%] rounded-full bg-[#3B82F6]" />
                </div>
              </div>
            </div>
          </article>

          <div className="flex w-full min-w-0 flex-col justify-between">
            <ol className="w-full">
              {STEPS.map((step, index) => (
                <li key={step.title} className="group w-full pb-5 last:pb-0">
                  <span
                    aria-hidden
                    className="mb-4 block h-0.75 w-2/3 bg-linear-to-r from-[#B7CED2] via-[#B7CED2]/40 to-transparent [clip-path:polygon(0_0,100%_38%,100%_62%,0_100%)] transition-all group-hover:from-[#156374] group-hover:via-[#156374]/50"
                  />
                  <div className="flex flex-col gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#8FB3B8] text-[11px] font-semibold text-amdari-yellow transition-colors group-hover:bg-[#156374] group-hover:text-amdari-yellow">
                      {index + 1}
                    </span>
                    <div className="-mt-0.5">
                      <h3 className="text-[15px] font-semibold text-[#3D8C97] transition-colors group-hover:text-[#0E4C58]">
                        {step.title}
                      </h3>
                      <p className="mt-0.5 max-w-60 text-sm leading-snug text-[#76808D]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/auth/sign-up"
              className="group mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#156374] py-2 pr-2 pl-5 text-sm font-semibold text-white transition-colors hover:bg-[#0E4C58]"
            >
              Join a Team Today
              <span className="flex size-8 items-center justify-center rounded-full bg-[#F6D56A] text-[#156374]">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheImpact;

"use client";

import { BriefcaseBusiness, Monitor } from "lucide-react";
import Image from "next/image";

const HowWeHelp = () => {
  return (
    <section className="bg-[#F6FAFB] py-14 lg:py-20">
      <div className="app-width">
        <h2 className="mx-auto max-w-130 text-center text-4xl leading-tight font-semibold text-[#123943] md:text-5xl">
          How We Help <br /> Tech Professionals
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-14 lg:mt-14">
          <article>
            <h3 className="text-2xl leading-tight font-semibold text-[#1D4A55] md:text-3xl">
              Internships{" "}
              <span className="text-[#1B8194]">(RAVE by Amdari)</span>
            </h3>
            <div className=" max-w-130">
              <p className="mt-4 text-sm leading-relaxed text-[#67828A] md:text-base">
                Our Career Experience Internship immerses you in a real-world
                work environment, where you collaborate on live projects that
                solve actual business challenges. With mentorship from industry
                experts and measurable results to showcase on your portfolio,
                you'll also earn a 2-year international job reference to boost
                your credibility with future employers.
              </p>
              <div className="flex justify-end">
                <Image
                  src="/images/svgs/about/file.svg"
                  alt="Internship"
                  width={90}
                  height={70}
                  className="mt-6 rounded-lg object-cover"
                />
              </div>
            </div>
          </article>

          <article className="mt-24">
            <div className="mb-3 flex justify-start">
              <Image
                src="/images/svgs/about/monitor.svg"
                alt="Internship"
                width={114}
                height={80}
                className="rounded-lg object-cover"
              />
            </div>
            <h3 className="text-2xl leading-tight font-semibold text-[#123943] md:text-3xl">
              Real-World Projects
            </h3>
            <p className="mt-4 max-w-125 text-sm leading-relaxed text-[#67828A] md:text-base">
              Our projects go beyond the generic tasks available online,
              offering scenarios with real business context and measurable
              impact. Whether you're a data analyst, engineer, or scientist,
              our library of over 25+ projects ensures you gain the hands-on
              experience you need to impress recruiters and hiring managers.
            </p>
          </article>
        </div>

        <article className="mt-12 max-w-300 mx-auto flex flex-col gap-20 pt-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-135">
            <h3 className="text-2xl leading-tight font-semibold text-[#123943] md:text-3xl">
              TalentLoop
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#67828A] md:text-base">
              Our TalentLoop program helps you apply directly to top
              organizations seeking professionals who are job-ready. By
              matching your skills and career goals with the right
              opportunities, we ensure that we tailor your CV to position you
              for success.
            </p>
          </div>

          <div className="flex flex-1 justify-start md:pt-1">
            <Image
              src="/images/svgs/about/briefcase.svg"
              alt="Internship"
              width={114}
              height={80}
              className="rounded-lg object-cover"
            />
          </div>
        </article>
      </div>
    </section>
  );
};

export default HowWeHelp;

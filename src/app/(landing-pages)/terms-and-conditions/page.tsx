"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type PolicySection = {
  id: string;
  title: string;
  intro?: string;
  points?: string[];
  paragraphs?: string[];
};

const termsParagraphs: string[] = [
  "Hello and welcome to Amdari! We are dedicated to offering you hands-on, project-based internship designed to provide you with real world experience, and we want to make sure you are aware of all the terms and conditions that come with taking part in our program.",
  "As a participant in our program, please update yourself on the policies and procedures outlined in this document. Please carefully read and comprehend these terms and conditions before starting this program.",
  "Our goal at Amdari is to provide each participant with exceptional opportunities for real-world experience through projects and internships that build practical skills. However, we acknowledge that unforeseen circumstances may sometimes necessitate a refund or deferment.",
];

const policySections: PolicySection[] = [
  {
    id: "removal-access-restriction",
    title: "Removal/Access Restriction Policy for Amdari",
    intro:
      "Participants in any of Amdari's programs may have their access restricted or be removed under the following circumstances:",
    points: [
      "Installment Payment: All installment agreements must be honoured. All participants are required to make installment payments on or before their agreed installment date. If ability to meet the agreed date is impaired, a mail must be sent to finance@amdari.io to agree on a compromise to payments. However, this mail must be received before installment date in order to be considered by the finance team.",
      "Failure to make Installment Payment: Failure to make payment on or before agreed installment date will result in your profile being flagged for immediate removal. A grace period of two (2) days will be provided from the initial agreed installment date. After which said participants will be removed from all Amdari platforms.",
      "Attendance: Participants are expected to engage with all assigned projects and meet the deliverables within the program timeline. Repeated unexcused absences or missed deadlines without valid reasons will lead to removal from the program without a refund.",
      "Conduct: Participants are expected to conduct themselves professionally and respectfully at all times. If an intern engages in disruptive or disrespectful behavior, they may be given a warning. If the behavior continues, they will be removed from the program.",
    ],
  },
  {
    id: "program-switching",
    title: "Program Switching Policy for Amdari",
    intro:
      "This section of the policy aims to maintain the integrity of the internship experience while also allowing interns the opportunity to make informed decisions about their career paths:",
    points: [
      "Interns may request a switch to another program within the same cohort only once during their time at Amdari.",
      "Interns must fill the Amdari Switching Form at least 10 business days before the start of the program but not beyond 2 weeks into the program.",
      "Switching programmes may only occur within the same cohort and must take place before two weeks into the programme.",
      "Amdari reserves the right to deny a request to switch programmes based on factors such as limited availability of spaces or insufficient qualifications of the intern.",
      "Interns who have switched programmes are not eligible to switch back to their original programme.",
      "Any subsequent switch requests will lead to a re-enrollment fee at the discretion of Amdari. Please send an email to finance@amdari.org.",
    ],
  },
  {
    id: "refund-policy",
    title: "Refund Policy for Amdari",
    intro:
      "We have devised the following refund policy to make sure that everything is done fairly and openly for parties involved:",
    points: [
      "Cancellations made more than 7 days prior to the start of the program will receive a full refund.",
      "Cancellations made less than 7 days prior to the start of the program will receive a 75% refund.",
      "Cancellations made between 0-7 days after the start of the program will receive a 50% refund.",
      "Cancellations made 7 days after the start of the program, or for no-shows, will not be eligible for a refund.",
      "Refunds for programs that have already started will be evaluated on a case-by-case basis and will be subject to a cancellation fee of 50% of the remaining fees.",
      "In the event that Amdari cancels a program, clients will receive a full refund.",
      "Once the refund request has been received and reviewed, our customer service team will process the refund within 7-10 business days.",
      "Sessions that have been deferred/rescheduled by the participant will not be eligible for a refund.",
      "Refunds issued will be less 8% platform charges in cases where the payment was made through a third-party platform.",
      "Each program coordinator must be informed and requests for refunds must be submitted to Amdari via email at finance@amdari.org.",
    ],
  },
  {
    id: "deferment-policy",
    title: "Deferment Policy for Amdari",
    paragraphs: [
      "This deferment policy has been created to provide participants with the opportunity to defer their enrollment in a program for a future date.",
      "Deferment Criteria: The deferment of a program enrollment may be approved under health reasons, personal circumstances such as bereavement/family emergencies, or change in employment that prevents participation.",
    ],
    points: [
      "Request for deferment: Students must fill the Amdari Deferment Form at least 10 business days before the start of the program but not beyond 2 weeks into the program.",
      "Approval or rejection: Amdari will review the request and communicate a decision within 5 business days.",
      "Limitation on deferment: Participants cannot defer more than 3 months in advance and may defer enrollment once only.",
      "Re-enrollment fee: Participants who defer more than once and/or beyond 3 months in advance will be required to pay a re-enrollment fee equal to 25% of the current program full fee.",
      "Timeline: The re-enrollment fee of 25% is applicable only within 5 months of enrollment. After 5 months, re-enrollment may be treated as a new enrollment.",
    ],
  },
  {
    id: "growth-internship-enrollment",
    title: "Growth Internship Enrollment Policy for Amdari",
    intro:
      "Amdari Internship Policy has been created to provide participants with the opportunity to participate in our Growth Internship upon completion of Capstone Project:",
    points: [
      "All students are entitled to participate free of charge in Amdari Growth Internship with their registered cohort.",
      "Growth Internships are not liable to deferment.",
      "Growth Internship occurs only after the cohort has been completed via Capstone Presentation.",
      "Growth Internship for each registered cohort shall begin not later than 30-days after the cohort capstone presentation date.",
      "Participants who fail to complete their capstone project and join their registered cohort Growth Internship will be liable to pay Growth Internship Enrollment Fee.",
      "Growth Internship Enrollment Fee is 10% of the current training program full fee and must be paid before enrollment in the next internship cycle.",
      "Participants who intend to apply for Growth Internship past their cohort deadline must submit requests via finance@amdari.org.",
    ],
  },
  {
    id: "amdari-references",
    title: "Amdari References",
    paragraphs: [
      "The contract with Amdari participants becomes effective at the start of the cohort. Please note that references will be provided only after participants have completed one month of the program, and not before.",
      "Note: All Amdari program fees are tax exclusive.",
      "This policy is subject to change at any time, and participants will be notified of any changes in writing.",
    ],
  },
];

const PoliciesPage = () => {
  const [activeSectionId, setActiveSectionId] = useState("terms-and-conditions");

  const navItems = useMemo(
    () => [
      { id: "terms-and-conditions", title: "Terms & Conditions" },
      ...policySections.map((section) => ({
        id: section.id,
        title: section.title,
      })),
    ],
    [],
  );

  useEffect(() => {
    const sectionElements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          setActiveSectionId(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-120px 0px -60% 0px",
        threshold: 0.1,
      },
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navItems]);

  return (
    <div className="relative z-10 mx-auto max-w-325 px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <h1 className="font-clash-display text-4xl font-semibold text-[#092A31]">
            Our Terms
          </h1>
          <nav className="mt-6">
            <ul className="space-y-3 text-sm text-[#52616B]">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    className={cn(
                      "transition-colors hover:text-primary",
                      activeSectionId === item.id && "font-semibold text-primary",
                    )}
                    href={`#${item.id}`}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="space-y-10">
          <section id="terms-and-conditions" className="scroll-mt-32 space-y-4">
            <h2 className="font-clash-display text-3xl font-semibold text-[#092A31]">
              Terms & Conditions
            </h2>
            {termsParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-[#52616B]">
                {paragraph}
              </p>
            ))}
          </section>

          {policySections.map((section) => (
            <section
              id={section.id}
              key={section.id}
              className="scroll-mt-32 space-y-4"
            >
              <h3 className="font-clash-display text-3xl font-semibold text-[#092A31]">
                {section.title}
              </h3>
              {section.intro && (
                <p className="text-base leading-7 text-[#52616B]">{section.intro}</p>
              )}
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-base leading-7 text-[#52616B]">
                  {paragraph}
                </p>
              ))}
              {section.points && (
                <ol className="list-decimal space-y-3 pl-5 text-base leading-7 text-[#52616B]">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default PoliciesPage;

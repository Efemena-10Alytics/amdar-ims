"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  POLICY_SECTIONS,
  TERMS_PARAGRAPHS,
} from "@/constants/terms-and-conditions";

const PoliciesPage = () => {
  const [activeSectionId, setActiveSectionId] = useState("terms-and-conditions");

  const navItems = useMemo(
    () => [
      { id: "terms-and-conditions", title: "Terms & Conditions" },
      ...POLICY_SECTIONS.map((section) => ({
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
            {TERMS_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-[#52616B]">
                {paragraph}
              </p>
            ))}
          </section>

          {POLICY_SECTIONS.map((section) => (
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
                  {section.points.map((point) =>
                    typeof point === "string" ? (
                      <li key={point}>{point}</li>
                    ) : (
                      <li key={point.text}>
                        {point.title && (
                          <span className="font-semibold text-[#092A31]">
                            {point.title}
                          </span>
                        )}
                        <p className={cn(point.title && "mt-1")}>{point.text}</p>
                        {point.bullets && (
                          <ul className="mt-2 list-disc space-y-2 pl-5">
                            {point.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ),
                  )}
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

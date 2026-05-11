"use client";

import React from "react";
import { type TeamSlide } from "./stack-carousel";
import StackCards from "./stack-cards";

const teamSlides: TeamSlide[] = [
    {
        tabLabel: "Growth team",
        badge: "01",
        title: "Growth",
        description:
            "Our Growth team is the engine behind Amdari’s expansion. Focused on building strategic partnerships, scaling our reach, and increasing visibility, they ensure we attract and retain the right audience. Whether through innovative campaigns, influencer collaborations, or viral marketing strategies, this team works tirelessly to amplify Amdari’s impact globally.",
    },
    {
        tabLabel: "Sales team",
        badge: "02",
        title: "Sales",
        description:
            "The Sales team is our frontline, bridging the gap between Amdari’s offerings and the needs of our prospects. With a deep understanding of customer pain points, they focus on nurturing leads, converting prospects, and fostering long-term relationships. Their mission is to ensure every professional finds the perfect solution at Amdari ",
    },
    {
        tabLabel: "Product team",
        badge: "03",
        title: "Product and Engineering",
        description:
            "The Product & Engineering team is the creative powerhouse that brings Amdari’s vision to life. From designing user-friendly platforms to integrating cutting-edge features, they ensure our solutions are not only functional but transformative. Their dedication to innovation and seamless user experiences drives Amdari’s technological excellence.",
    },
    {
        tabLabel: "Operations team",
        badge: "04",
        title: "Operations",
        description:
            "The Product & Engineering team is the creative powerhouse that brings Amdari’s vision to life. From designing user-friendly platforms to integrating cutting-edge features, they ensure our solutions are not only functional but transformative. Their dedication to innovation and seamless user experiences drives Amdari’s technological excellence.",
    },
    {
        tabLabel: "Internship team",
        badge: "05",
        title: "Internship",
        description:
            "The Internships team crafts & manages the immersive career experience programs that Amdari is renowned for. They handle all from onboarding to creating impactful project. With a focus on real-world application and mentorship, this team ensures every intern leaves with experience, confidence, & portfolio-worthy accomplishments.",
    },
    {
        tabLabel: "Employability",
        badge: "06",
        title: "Employability",
        description:
            "The Employability team is dedicated to transforming skills into careers. They focus on CV revamps, mock interviews, career mentorship, and equipping participants with the tools needed to land high-paying tech roles. This team’s goal is to ensure every Amdari user has the resources and confidence to excel in the job market.The Employability team is dedicated to transforming skills into careers. They focus on CV revamps, mock interviews, career mentorship, and equipping participants with the tools needed to land high-paying tech roles. This team’s goal is to ensure every Amdari user has the resources and confidence to excel in the job market.",
    },
];

const Team = () => {
    const [activeIndex, setActiveIndex] = React.useState(1);
    const visibleCount = 3;
    const visibleStart = Math.min(
        Math.max(activeIndex - 1, 0),
        Math.max(teamSlides.length - visibleCount, 0),
    );
    const visibleSlides = teamSlides.slice(visibleStart, visibleStart + visibleCount);

    const handleTabClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <section className="relative overflow-hidden bg-[#F5F7F8] py-14 lg:py-20">
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-90"
                style={{
                    backgroundImage: "url(/images/svgs/hero-ellipse.svg)",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1200px auto",
                }}
                aria-hidden
            />
            {/* <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(157,177,186,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(157,177,186,0.16) 1px, transparent 1px)",
                    backgroundSize: "72px 72px",
                }}
                aria-hidden
            /> */}

            <div className="app-width relative z-10 grid items-start gap-8 lg:grid-cols-[0.95fr_1fr] lg:gap-12">
                <div>
                    <h2 className="font-clash-display text-4xl font-semibold text-[#123640] lg:text-5xl">
                        Amdari Team
                    </h2>
                    <p className="mt-1 text-sm font-medium text-[#6B8088] lg:text-base">
                        Driving excellence across department
                    </p>

                    <ul className="mt-10 space-y-3 lg:mt-14">
                        {visibleSlides.map((team, index) => {
                            const actualIndex = visibleStart + index;
                            const isActive = actualIndex === activeIndex;

                            return (
                                <button
                                    key={team.tabLabel}
                                    type="button"
                                    onClick={() => handleTabClick(actualIndex)}
                                    className={`flex items-center gap-2 text-3xl font-semibold ${isActive ? "text-[#115666]" : "text-[#D2DEE2]"}`}
                                >
                                    <span
                                        className={`inline-flex size-3 rounded-full border ${isActive ? "border-[#8AE2AE]" : "border-transparent"}`}
                                        aria-hidden
                                    >
                                        <span
                                            className={`m-auto size-1.5 rounded-full ${isActive ? "bg-[#39C97B]" : "bg-transparent"}`}
                                        />
                                    </span>
                                    {team.tabLabel}
                                </button>
                            );
                        })}
                    </ul>
                </div>

                <div className="relative w-full max-w-135">
                    {/* <StackCards
                        slides={teamSlides}
                        activeIndex={activeIndex}
                        onActiveIndexChange={setActiveIndex}
                        initialIndex={1}
                    /> */}
                </div>
            </div>
        </section>
    );
};

export default Team;

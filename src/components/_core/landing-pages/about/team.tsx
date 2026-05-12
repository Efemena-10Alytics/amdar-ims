"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
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

/** Scroll distance (px) allocated per card peel while the block stays pinned */
function pinScrollPerCardPx(): number {
    if (typeof window === "undefined") return 520;
    return Math.round(Math.max(420, window.innerHeight * 0.48));
}

/** Matches `top-20` / `lg:top-24` on the sticky panel */
function stickyTopOffsetPx(): number {
    if (typeof window === "undefined") return 80;
    return window.innerWidth >= 1024 ? 96 : 80;
}

const Team = () => {
    const scrollDriverRef = useRef<HTMLDivElement>(null);
    const stickyPanelRef = useRef<HTMLDivElement>(null);
    const [scrollLinear, setScrollLinear] = useState(0);
    const [isStuck, setIsStuck] = useState(false);
    const [driverMinHeightPx, setDriverMinHeightPx] = useState<number | null>(null);
    const rafRef = useRef<number | null>(null);

    const lastIndex = Math.max(0, teamSlides.length - 1);

    const syncDriverHeight = useCallback(() => {
        const driver = scrollDriverRef.current;
        const sticky = stickyPanelRef.current;
        if (!driver || !sticky || typeof window === "undefined") return;

        const stickyH = sticky.offsetHeight;
        const pinScroll = lastIndex * pinScrollPerCardPx();
        setDriverMinHeightPx(stickyH + pinScroll);
    }, [lastIndex]);

    useLayoutEffect(() => {
        syncDriverHeight();
    }, [syncDriverHeight]);

    useEffect(() => {
        const sticky = stickyPanelRef.current;
        if (!sticky || typeof ResizeObserver === "undefined") return;

        const ro = new ResizeObserver(() => {
            syncDriverHeight();
        });
        ro.observe(sticky);
        window.addEventListener("resize", syncDriverHeight);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", syncDriverHeight);
        };
    }, [syncDriverHeight]);

    const updateProgress = useCallback(() => {
        const driver = scrollDriverRef.current;
        const sticky = stickyPanelRef.current;
        if (!driver || !sticky || typeof window === "undefined") return;

        const range = driver.offsetHeight - sticky.offsetHeight;
        if (range <= 0) {
            setScrollLinear(0);
            setIsStuck(false);
            return;
        }

        const rect = driver.getBoundingClientRect();
        const scrolledWithin = Math.min(
            Math.max(stickyTopOffsetPx() - rect.top, 0),
            range,
        );
        setIsStuck(scrolledWithin > 0);
        const progress = scrolledWithin / range;

        if (teamSlides.length <= 1) {
            setScrollLinear(0);
            setIsStuck(false);
            return;
        }

        setScrollLinear(Math.min(progress * lastIndex, lastIndex));
    }, [lastIndex]);

    useEffect(() => {
        const tick = () => {
            rafRef.current = null;
            updateProgress();
        };

        const onScrollOrResize = () => {
            if (rafRef.current != null) return;
            rafRef.current = window.requestAnimationFrame(tick);
        };

        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);
        onScrollOrResize();

        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
            if (rafRef.current != null) {
                window.cancelAnimationFrame(rafRef.current);
            }
        };
    }, [updateProgress]);

    const scrollToCard = useCallback(
        (index: number) => {
            const driver = scrollDriverRef.current;
            const sticky = stickyPanelRef.current;
            if (!driver || !sticky || typeof window === "undefined") return;

            const range = driver.offsetHeight - sticky.offsetHeight;
            if (range <= 0 || lastIndex <= 0) return;

            const clamped = Math.max(0, Math.min(lastIndex, index));
            const driverAbsTop = window.scrollY + driver.getBoundingClientRect().top;
            const targetScrollY =
                driverAbsTop - stickyTopOffsetPx() + (clamped / lastIndex) * range;
            window.scrollTo({
                top: Math.max(0, targetScrollY),
                behavior: "smooth",
            });
        },
        [lastIndex],
    );

    const activeTabIndex = Math.min(Math.floor(scrollLinear + 0.001), lastIndex);
    const visibleCount = 3;
    const visibleStart = Math.min(
        Math.max(activeTabIndex - 1, 0),
        Math.max(teamSlides.length - visibleCount, 0),
    );
    const visibleSlides = teamSlides.slice(visibleStart, visibleStart + visibleCount);

    return (
        <section className="relative bg-[#F5F7F8] py-14 lg:py-20">
            {/*
              Do not use overflow-x-hidden on this section: it breaks position:sticky
              for descendants (Chrome treats non-visible overflow as a scroll container).
              Clip the decorative layer only.
            */}
            <div
                className="pointer-events-none absolute inset-0 z-0 overflow-x-hidden opacity-90"
                style={{
                    backgroundImage: "url(/images/svgs/hero-ellipse.svg)",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1200px auto",
                }}
                aria-hidden
            />

            <div
                ref={scrollDriverRef}
                className="relative z-10 min-w-0"
                style={{
                    minHeight:
                        driverMinHeightPx != null
                            ? `${driverMinHeightPx}px`
                            : `calc(100dvh + ${lastIndex * 45}dvh)`,
                }}
            >
                <div
                    ref={stickyPanelRef}
                    className={cn(
                        "sticky top-20 z-10 pb-16 transition-[padding] duration-200 ease-out lg:top-24 lg:pb-20",
                        isStuck && "pt-36",
                    )}
                >
                    <div className="app-width grid items-start gap-8 md:grid-cols-[0.95fr_1fr] md:gap-12">
                        <div className="min-w-0">
                            <h2 className="font-clash-display text-4xl font-semibold text-[#123640] lg:text-5xl">
                                Amdari Team
                            </h2>
                            <p className="mt-1 text-sm font-medium text-[#6B8088] lg:text-base">
                                Driving excellence across department
                            </p>

                            <ul className="mt-10 space-y-3 lg:mt-14">
                                {visibleSlides.map((team, index) => {
                                    const actualIndex = visibleStart + index;
                                    const isActive = actualIndex === activeTabIndex;

                                    return (
                                        <li key={team.tabLabel}>
                                            <button
                                                type="button"
                                                onClick={() => scrollToCard(actualIndex)}
                                                className={`flex items-center gap-2 text-left text-2xl font-semibold sm:text-3xl ${isActive ? "text-[#115666]" : "text-[#D2DEE2]"}`}
                                            >
                                                <span
                                                    className={`inline-flex size-3 shrink-0 rounded-full border ${isActive ? "border-[#8AE2AE]" : "border-transparent"}`}
                                                    aria-hidden
                                                >
                                                    <span
                                                        className={`m-auto size-1.5 rounded-full ${isActive ? "bg-[#39C97B]" : "bg-transparent"}`}
                                                    />
                                                </span>
                                                {team.tabLabel}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="relative mx-auto w-full max-w-135">
                            <StackCards
                                slides={teamSlides}
                                scrollLinear={scrollLinear}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Team;

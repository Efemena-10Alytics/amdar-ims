"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlayIcon } from "lucide-react";
import Aos from "aos";
import LearnMoreVideo from "../home/learn-more-video";
import CustomButton from "../shared/custom-button";

const HERO_PATTERN_SRC =
    "/images/svgs/become-partners/become-partnes-patterns.svg";

const HIGH_IMPACT_TAGS = [
    "No hiring involved",
    "No data shared",
    "No contracts",
    "100% remote",
    "Real social impact",
] as const;

const FLOATING_AVATARS: {
    src: string;
    alt: string;
    className: string;
    cursorClass: string;
}[] = [
        {
            src: "/images/svgs/become-partners/hero-avatar-1.svg",
            alt: "Community member",
            className:
                "left-[2%] top-[8%] size-14 sm:size-16 md:left-[1%] md:top-[-6%] lg:size-[4.5rem]",
            cursorClass: "text-sky-500",
        },
        {
            src: "/images/svgs/become-partners/hero-avatar-2.svg",
            alt: "Community member",
            className:
                "right-[4%] top-[6%] size-14 sm:size-16 md:right-[8%] md:top-[8%] lg:size-[4.5rem]",
            cursorClass: "text-violet-500",
        },
        {
            src: "/images/svgs/become-partners/hero-avatar-3.svg",
            alt: "Community member",
            className:
                "left-[6%] bottom-[18%] size-12 sm:size-14 md:left-[10%] md:bottom-[16%] lg:size-16",
            cursorClass: "text-amber-500",
        },
        {
            src: "/images/svgs/become-partners/hero-avatar-4.svg",
            alt: "Community member",
            className:
                "right-[8%] bottom-[20%] size-12 sm:size-14 md:right-[12%] md:bottom-[24%] lg:size-16",
            cursorClass: "text-emerald-500",
        },
    ];

function PartnerFlags({ size = 28 }: { size?: number }) {
    return (
        <div className="flex shrink-0 items-center">
            <Image
                src="/images/svgs/country/UK.svg"
                width={size}
                height={size}
                alt="United Kingdom"
                className="rounded-full"
            />
            <Image
                src="/images/svgs/country/CAD.svg"
                width={size}
                height={size}
                alt="Canada"
                className="-ml-2 rounded-full"
            />
            <Image
                src="/images/svgs/country/USA.svg"
                width={size}
                height={size}
                alt="United States"
                className="-ml-2 rounded-full"
            />
        </div>
    );
}

export default function BusinessPartnersHero() {
    const [showVideo, setShowVideo] = React.useState(false);

    React.useEffect(() => {
        Aos.init({ duration: 600, once: true });
    }, []);

    return (
        <>
            <section
                className="relative overflow-hidden pt-20 pb-16 text-[#092A31] md:pt-24 md:pb-20 lg:pt-28 lg:pb-24"
                aria-labelledby="business-partners-hero-heading"
            >
                <div
                    className="pointer-events-none absolute inset-0 z-0 bg-[#E8EFF1]"
                    style={{
                        backgroundImage: `url(${HERO_PATTERN_SRC})`,
                        backgroundPosition: "center top",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                />

                <div className="app-width relative z-10">
                    <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:max-w-5xl">
                        {FLOATING_AVATARS.map((item) => (
                            <div
                                key={item.src}
                                className={cn(
                                    "pointer-events-none absolute z-0 hidden sm:block",
                                    item.className,
                                )}
                                aria-hidden
                            >
                                <div className="relative size-full">
                                    <div className="relative size-full rounded-full">
                                        <Image
                                            src={item.src}
                                            alt={item.alt}
                                            fill
                                            sizes="(max-width: 768px) 56px, (max-width: 1024px) 64px, 72px"
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>

                                </div>
                            </div>
                        ))}

                        <h1
                            id="business-partners-hero-heading"
                            data-aos="fade-up"
                            className="font-clash-display relative z-10 text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.12]"
                        >
                            They have the skills. They just need{" "}
                            <span className="text-[#A67C00]">Experience.</span>
                        </h1>

                        <p
                            data-aos="fade-up"
                            data-aos-delay="80"
                            className="relative z-10 mt-5 text-base font-medium text-[#092A31]/85 sm:text-lg md:text-xl"
                        >
                            Be the reason why a struggling professional gets ahead in their
                            desired career.
                        </p>

                        <p
                            data-aos="fade-up"
                            data-aos-delay="120"
                            className="relative z-10 mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#475467] sm:text-base"
                        >
                            Partner with Amdari and give aspiring tech professionals the one
                            thing no course or certificate can offer — a real company to work
                            for. No hiring. No commitment. No cost.
                        </p>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="160"
                            className="relative z-10 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                        >
                            <CustomButton btnText="Become a Partner" href="/auth/sign-up" />
                            <Button
                                type="button"
                                onClick={() => setShowVideo(true)}
                                className={cn(
                                    "group h-12 rounded-full border-2 border-[#B6CFD4] bg-[#E8EFF1] px-5 text-base font-medium text-[#092A31]",
                                    "hover:border-[#156374] hover:bg-[#DCE8EC]",
                                    "inline-flex items-center gap-2",
                                )}
                            >
                                See How It Works
                                <span className="flex size-8 items-center justify-center rounded-full bg-[#0F4652] text-white transition-colors group-hover:bg-[#156374]">
                                    <PlayIcon className="size-3.5 fill-current" />
                                </span>
                            </Button>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="200"
                            className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-[#475467] sm:text-base"
                        >
                            <PartnerFlags />
                            <span className="text-center font-medium text-[#092A31]/80">
                                + 30K interns Across the world Got hired
                            </span>
                        </div>
                    </div>
                </div>


                <LearnMoreVideo showPopUpVid={showVideo} setShowPopUpVid={setShowVideo} />
            </section>
            <div
                className="relative z-10 w-full bg-[#FDE08A] px-4 py-11 sm:px-6  md:py-12"
                aria-labelledby="light-touch-heading"
            >
                <div className="app-width mx-auto">
                    <h2
                        id="light-touch-heading"
                        data-aos="fade-up"
                        className="font-clash-display text-balance text-2xl font-bold tracking-tight text-[#092A31] sm:text-3xl md:text-4xl"
                    >
                        Light-touch. High impact.
                    </h2>
                    <ul
                        data-aos="fade-up"
                        data-aos-delay="100"
                        className="mt-4 flex flex-wrap items-center gap-2 sm:gap-2.5 md:gap-3"
                    >
                        {HIGH_IMPACT_TAGS.map((label) => (
                            <li key={label}>
                                <span
                                    className={cn(
                                        "inline-flex items-center justify-center rounded-full border border-[#6B5E37]",
                                        "bg-[#E8CC76] px-3 py-1.5 text-sm font-bold text-[#6B5E37] sm:px-4 sm:py-2",
                                    )}
                                >
                                    {label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
